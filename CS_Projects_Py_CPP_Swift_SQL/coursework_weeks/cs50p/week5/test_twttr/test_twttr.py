from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parents[2]
sys.path.append(str(BASE_DIR / "week2" / "twttr"))

from twttr import shorten # type: ignore


def test_lowercase_vowels():
    assert shorten("twitter") == "twttr"


def test_uppercase_vowels():
    assert shorten("TWITTER") == "TWTTR"


def test_numbers():
    assert shorten("CS50") == "CS50"


def test_punctuation():
    assert shorten("Hello, world!") == "Hll, wrld!"
