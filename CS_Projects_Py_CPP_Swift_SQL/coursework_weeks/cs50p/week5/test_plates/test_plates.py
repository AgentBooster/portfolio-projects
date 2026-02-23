from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parents[2]
sys.path.append(str(BASE_DIR / "week2" / "plates"))

from plates import is_valid # type: ignore


def test_starts_with_two_letters():
    assert is_valid("CS50")
    assert not is_valid("C50")
    assert not is_valid("1A")


def test_length_limits():
    assert is_valid("AB")
    assert is_valid("ABCDEF")
    assert not is_valid("A")
    assert not is_valid("ABCDEFG")


def test_numbers_at_end_only():
    assert is_valid("AB12")
    assert not is_valid("AB1C")


def test_first_number_not_zero():
    assert not is_valid("AB01")


def test_no_punctuation_or_spaces():
    assert not is_valid("AB-12")
    assert not is_valid("AB 12")
