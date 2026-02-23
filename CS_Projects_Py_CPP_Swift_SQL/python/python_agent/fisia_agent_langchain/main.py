import json
import os
import sys
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, Optional

from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory

from prompts import FORMATTER_SYSTEM_PROMPT, SYSTEM_PROMPT_TEMPLATE
from tools import TOOLS

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None

try:
    from langchain_openai import ChatOpenAI
except ImportError:  # pragma: no cover
    ChatOpenAI = None

try:
    from langchain_anthropic import ChatAnthropic
except ImportError:  # pragma: no cover
    ChatAnthropic = None


@dataclass
class LlmConfig:
    provider: str
    model: str
    temperature: float


def _parse_input(raw: str) -> Dict[str, Any]:
    raw = raw.strip()
    if not raw:
        return {}
    if raw.startswith("{") and raw.endswith("}"):
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"message": raw}
    return {"message": raw}


def _extract_user_input(payload: Dict[str, Any]) -> str:
    for key in ("chatInput", "user_input", "message", "text", "query"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def _get_local_timestamp(payload: Dict[str, Any]) -> str:
    timezone = payload.get("timezone") or os.getenv("FISIA_TIMEZONE", "Europe/Madrid")
    candidate_ts = payload.get("timestamp") or payload.get("metadata", {}).get("timestamp")

    tzinfo = None
    if ZoneInfo is not None:
        try:
            tzinfo = ZoneInfo(timezone)
        except Exception:
            tzinfo = None

    def _format(dt: datetime) -> str:
        return dt.strftime("%d/%m/%Y %H:%M:%S")

    if candidate_ts:
        try:
            parsed = datetime.fromisoformat(str(candidate_ts))
            if tzinfo:
                parsed = parsed.astimezone(tzinfo)
            return _format(parsed)
        except Exception:
            pass

    now = datetime.now(tz=tzinfo) if tzinfo else datetime.now()
    return _format(now)


def _build_llm(config: LlmConfig):
    provider = config.provider.lower()
    if provider == "anthropic":
        if ChatAnthropic is None:
            raise RuntimeError("langchain-anthropic is not installed")
        return ChatAnthropic(model=config.model, temperature=config.temperature)

    if ChatOpenAI is None:
        raise RuntimeError("langchain-openai is not installed")
    return ChatOpenAI(model=config.model, temperature=config.temperature)


def _build_agent_executor(llm, system_prompt: str, memory: ConversationBufferMemory) -> AgentExecutor:
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad"),
        ]
    )

    agent = create_tool_calling_agent(llm=llm, tools=TOOLS, prompt=prompt)

    return AgentExecutor(
        agent=agent,
        tools=TOOLS,
        memory=memory,
        verbose=False,
        return_intermediate_steps=True,
        handle_parsing_errors=True,
    )


def _extract_text_from_response(response: Any) -> str:
    if isinstance(response, str):
        return response
    if isinstance(response, dict):
        return str(response.get("output") or response.get("result") or response)
    if hasattr(response, "content"):
        content = response.content
        if isinstance(content, list):
            return "".join(str(part.get("text", "")) for part in content if isinstance(part, dict))
        return str(content)
    return str(response)


def _run_formatter(llm, user_message: str, agent_output: str) -> Dict[str, Any]:
    response_schemas = [
        ResponseSchema(
            name="output1",
            description="Primera parte del mensaje. Siempre debe contener contenido.",
        ),
        ResponseSchema(
            name="output2",
            description="Segunda parte opcional si hay mas ideas relevantes.",
        ),
        ResponseSchema(
            name="output3",
            description="Tercera parte opcional cuando la respuesta lo requiera.",
        ),
        ResponseSchema(
            name="output4",
            description="Cuarta parte opcional para remates o pasos adicionales.",
        ),
    ]
    parser = StructuredOutputParser.from_response_schemas(response_schemas)

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", FORMATTER_SYSTEM_PROMPT),
            (
                "human",
                "\n".join(
                    [
                        "# Mensaje del usuario",
                        "{user_message}",
                        "",
                        "# Mensaje de respuesta del Agente",
                        "{agent_output}",
                        "",
                        "{format_instructions}",
                    ]
                ),
            ),
        ]
    )

    def _coerce_json(text: str) -> Dict[str, Any]:
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(text[start : end + 1])
                except json.JSONDecodeError:
                    return {}
        return {}

    messages = prompt.format_messages(
        user_message=user_message,
        agent_output=agent_output,
        format_instructions=parser.get_format_instructions(),
    )
    raw_response = llm.invoke(messages)
    raw_text = _extract_text_from_response(raw_response)

    parsed_ok = True
    try:
        parsed = parser.parse(raw_text)
    except Exception:
        parsed_ok = False
        parsed = _coerce_json(raw_text)

    outputs = [
        str(parsed.get("output1", "")).strip() if isinstance(parsed, dict) else "",
        str(parsed.get("output2", "")).strip() if isinstance(parsed, dict) else "",
        str(parsed.get("output3", "")).strip() if isinstance(parsed, dict) else "",
        str(parsed.get("output4", "")).strip() if isinstance(parsed, dict) else "",
    ]

    parts = len([part for part in outputs if part])

    status = "success" if parsed_ok else "fallback_json"
    return {
        "output1": outputs[0] or agent_output,
        "output2": outputs[1],
        "output3": outputs[2],
        "output4": outputs[3],
        "meta": {"status": status, "parts": parts},
    }


def _get_llm_configs() -> tuple[LlmConfig, Optional[LlmConfig]]:
    provider = os.getenv("FISIA_PROVIDER", "openai")
    primary_model = os.getenv("FISIA_PRIMARY_MODEL", "gpt-4o-mini")
    fallback_model = os.getenv("FISIA_FALLBACK_MODEL")
    temperature = float(os.getenv("FISIA_TEMPERATURE", "0.2"))

    primary = LlmConfig(provider=provider, model=primary_model, temperature=temperature)
    fallback = None
    if fallback_model:
        fallback = LlmConfig(provider=provider, model=fallback_model, temperature=temperature)
    return primary, fallback


def _run_turn(
    user_input: str,
    payload: Dict[str, Any],
    memory: ConversationBufferMemory,
    primary_config: LlmConfig,
    fallback_config: Optional[LlmConfig],
) -> Dict[str, Any]:
    local_timestamp = _get_local_timestamp(payload)
    system_prompt = SYSTEM_PROMPT_TEMPLATE.replace("__LOCAL_TIMESTAMP__", local_timestamp)

    used_model = "primary"
    result = None

    try:
        primary_llm = _build_llm(primary_config)
        executor = _build_agent_executor(primary_llm, system_prompt, memory)
        result = executor.invoke({"input": user_input})
        active_llm = primary_llm
    except Exception:
        if not fallback_config:
            raise
        fallback_llm = _build_llm(fallback_config)
        executor = _build_agent_executor(fallback_llm, system_prompt, memory)
        result = executor.invoke({"input": user_input})
        active_llm = fallback_llm
        used_model = "fallback"

    agent_output_text = ""
    intermediate_steps = None
    if isinstance(result, dict):
        agent_output_text = result.get("output") or result.get("result") or ""
        intermediate_steps = result.get("intermediate_steps")
    if not agent_output_text:
        agent_output_text = _extract_text_from_response(result)

    try:
        formatted = _run_formatter(active_llm, user_input, agent_output_text)
    except Exception as exc:
        formatted = {
            "output1": agent_output_text,
            "output2": "",
            "output3": "",
            "output4": "",
            "meta": {
                "status": "formatter_error",
                "error": str(exc),
                "parts": 1 if agent_output_text else 0,
            },
        }

    safe_steps = None
    if intermediate_steps is not None:
        try:
            safe_steps = json.loads(json.dumps(intermediate_steps, default=str))
        except Exception:
            safe_steps = str(intermediate_steps)

    return {
        "input": user_input,
        "output1": formatted.get("output1"),
        "output2": formatted.get("output2"),
        "output3": formatted.get("output3"),
        "output4": formatted.get("output4"),
        "usedModel": used_model,
        "formatterModel": primary_config.model
        if used_model == "primary"
        else (fallback_config.model if fallback_config else "unknown"),
        "formatterStatus": formatted.get("meta", {}).get("status", "unknown"),
        "formatterParts": formatted.get("meta", {}).get("parts", 0),
        "formatterError": formatted.get("meta", {}).get("error", ""),
        "intermediateSteps": safe_steps,
    }


def _run_repl(primary_config: LlmConfig, fallback_config: Optional[LlmConfig]) -> None:
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="output",
    )
    print("REPL activo. Escribe 'exit' para salir.")
    while True:
        try:
            user_input = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit"}:
            break
        response = _run_turn(user_input, {}, memory, primary_config, fallback_config)
        print(json.dumps(response, ensure_ascii=False, indent=2))


def main() -> None:
    primary_config, fallback_config = _get_llm_configs()

    if "--repl" in sys.argv or os.getenv("FISIA_REPL") == "1":
        _run_repl(primary_config, fallback_config)
        return

    if len(sys.argv) > 1:
        raw_input = " ".join(arg for arg in sys.argv[1:] if arg != "--repl")
    else:
        raw_input = sys.stdin.read()

    payload = _parse_input(raw_input)
    user_input = _extract_user_input(payload)

    if not user_input:
        print(
            json.dumps(
                {
                    "error": "No input text found in chatInput/user_input/message/text/query.",
                    "raw": payload,
                },
                ensure_ascii=False,
            )
        )
        sys.exit(1)

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="output",
    )
    response = _run_turn(user_input, payload, memory, primary_config, fallback_config)
    print(json.dumps(response, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
