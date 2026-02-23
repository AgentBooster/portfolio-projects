# Fisia Agent (LangChain, Python)

Conversational agent for bookings and support for the fictional Fisia clinic.
Custom Python implementation using LangChain as the base API (no notebooks).

## Scope

- Booking flow driven by a business prompt.
- Tools with standard names for CRM, calendar, support, and calculator.
- Formatter that splits responses into 1-4 parts for chat delivery.
- Demo mode: tools return simulated responses.

## Structure

- `main.py`: agent runner and formatter.
- `prompts.py`: main prompt and formatter prompt.
- `tools.py`: simulated tools (replace with real integrations).

## Requirements

- Python 3.11 or 3.12 (LangChain does not support Python 3.14 yet, as of 2026)
- OpenAI or Anthropic API key

## Installation

```bash
cd /Users/christianmarcosmp/Documents/GitHub/portfolio-projects/CS_Projects_Py_CPP_Swift_SQL/python/python_agent/fisia_agent_langchain
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Environment variables

```bash
export OPENAI_API_KEY=tu_api_key
# o
export ANTHROPIC_API_KEY=tu_api_key

# Optional
export FISIA_PROVIDER=openai          # openai o anthropic
export FISIA_PRIMARY_MODEL=gpt-4o-mini
export FISIA_FALLBACK_MODEL=
export FISIA_TEMPERATURE=0.2
export FISIA_TIMEZONE=Europe/Madrid
```

## Usage

```bash
python main.py "I want to book a physiotherapy appointment"
```

JSON output with `output1..output4` and formatter metadata.

### Quick examples (tools)

```bash
# Local time (uses timezone from the JSON)
python main.py '{"message":"What time is it right now?","timezone":"Europe/Madrid"}'

# Vector store (simulated)
python main.py "What services does Fisia offer? Use vector_store_answer."

# Web search (simulated)
python main.py "Search what sports physiotherapy is. Use web_search."

# Calendar availability (simulated)
python main.py "I want to book an in-person initial evaluation on Thursday between 17:00 and 19:00 (Spain time). Use check_fisia_calendar_availability and give me options."

# CRM + calendar (simulated)
python main.py "Confirm these details and then use fisia_agent_send_data_to_crm and create_fisia_booking_event: name Ana, email ana@correo.com, phone +34 600000000, reason lower back pain, service initial evaluation, modality in-person, Thursday 17:30 (Spain time)."

# Update / delete (simulated)
python main.py "Use update_fisia_booking_event to move an appointment to Friday 18:00."
python main.py "Use delete_fisia_booking_event to cancel the appointment."

# Support (simulated)
python main.py "I am upset and want to talk to a human. Use send_message_to_support."

# Calculator (real)
python main.py "Use the calculator tool for 120 + 30 * 2."

# Spam (simulated)
python main.py "Mark the user as spam using append_spam_row."
```

### REPL mode (memory within the same session)

```bash
python main.py --repl
```

Type `exit` to quit. Memory lasts while the process is running.

## Notes

- Tools are in demo mode. Connect real CRM/Calendar/Search when you need to.
- Memory lasts only while the process is running.
