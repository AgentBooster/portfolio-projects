from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parents[2]
sys.path.append(str(BASE_DIR / "week1" / "bank"))

from bank import value # type: ignore


def test_hello_any_case():
    assert value("hello") == 0
    assert value("HeLLo") == 0
    assert value("   hello") == 0


def test_starts_with_h():
    assert value("hi") == 20
    assert value("how are you") == 20


def test_other_greeting():
    assert value("good morning") == 100
