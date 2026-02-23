import ast
import operator as op
import secrets
from typing import Any, Dict, Optional

from langchain_core.tools import tool

_BASE32HEX_ALPHABET = "0123456789abcdefghijklmnopqrstuv"


def _generate_base32hex_id(length: int = 24) -> str:
    return "".join(secrets.choice(_BASE32HEX_ALPHABET) for _ in range(length))


_ALLOWED_OPERATORS = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.Mod: op.mod,
    ast.Pow: op.pow,
    ast.USub: op.neg,
}


def _safe_eval(expr: str) -> float:
    def _eval(node: ast.AST) -> float:
        if isinstance(node, ast.Num):  # py<3.8
            return float(node.n)
        if isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                return float(node.value)
            raise ValueError("Unsupported constant")
        if isinstance(node, ast.BinOp):
            operator = _ALLOWED_OPERATORS.get(type(node.op))
            if operator is None:
                raise ValueError("Unsupported operator")
            return operator(_eval(node.left), _eval(node.right))
        if isinstance(node, ast.UnaryOp):
            operator = _ALLOWED_OPERATORS.get(type(node.op))
            if operator is None:
                raise ValueError("Unsupported unary operator")
            return operator(_eval(node.operand))
        raise ValueError("Unsupported expression")

    parsed = ast.parse(expr, mode="eval")
    return _eval(parsed.body)


@tool("think")
def think_tool(reflection: str) -> str:
    """Strategic reflection tool for ambiguous or multi-step tasks."""
    return f"Reflection recorded: {reflection}"


@tool("vector_store_answer")
def vector_store_answer(query: str) -> str:
    """Answer using internal knowledge base (demo placeholder)."""
    return (
        "Vector store not configured in this standalone demo. "
        "Provide official Fisia info or connect a real knowledge base."
    )


@tool("web_search")
def web_search(query: str) -> str:
    """General web search (demo placeholder)."""
    return (
        "Web search not configured in this standalone demo. "
        "Connect a real search tool to use this feature."
    )


@tool("check_fisia_calendar_availability")
def check_fisia_calendar_availability(request: str) -> str:
    """Check calendar availability for a given date/time range (demo placeholder)."""
    return (
        "Calendar availability is not connected. "
        "Configure your calendar integration to return real slots."
    )


@tool("create_fisia_booking_event")
def create_fisia_booking_event(details: str) -> Dict[str, Any]:
    """Create a booking event in the calendar with a base32hex ID (demo placeholder)."""
    event_id = _generate_base32hex_id()
    return {
        "status": "created",
        "event_id": event_id,
        "message": "Event created in demo mode. Store this ID for updates/cancelations.",
    }


@tool("update_fisia_booking_event")
def update_fisia_booking_event(details: str) -> Dict[str, Any]:
    """Update an existing booking event by ID (demo placeholder)."""
    return {
        "status": "updated",
        "message": "Event updated in demo mode. Connect real calendar for production.",
    }


@tool("delete_fisia_booking_event")
def delete_fisia_booking_event(details: str) -> str:
    """Delete an existing booking event by ID (demo placeholder)."""
    return "Event deleted in demo mode. Connect real calendar for production."


@tool("fisia_agent_send_data_to_crm")
def fisia_agent_send_data_to_crm(details: str) -> str:
    """Send booking data to CRM after user confirmation (demo placeholder)."""
    return "CRM write simulated in demo mode. Connect your CRM to store real data."


@tool("send_message_to_support")
def send_message_to_support(details: str) -> str:
    """Escalate to human support when needed (demo placeholder)."""
    return "Support notification simulated in demo mode."


@tool("calculator")
def calculator(expression: str) -> str:
    """Evaluate a simple arithmetic expression."""
    try:
        result = _safe_eval(expression)
        return str(result)
    except Exception as exc:
        return f"Calculator error: {exc}"


@tool("append_spam_row")
def append_spam_row(identifier: str) -> str:
    """Append a user identifier to a spam list (demo placeholder)."""
    return "Spam flag simulated in demo mode."


TOOLS = [
    think_tool,
    vector_store_answer,
    web_search,
    check_fisia_calendar_availability,
    create_fisia_booking_event,
    update_fisia_booking_event,
    delete_fisia_booking_event,
    fisia_agent_send_data_to_crm,
    send_message_to_support,
    calculator,
    append_spam_row,
]
