from pathlib import Path
import sys

import pytest # type: ignore

BASE_DIR = Path(__file__).resolve().parents[2]
sys.path.append(str(BASE_DIR / "week3" / "fuel"))

from fuel import convert, gauge # type: ignore


def test_convert_valid_fraction():
    assert convert("1/2") == 50
    assert convert("3/4") == 75


def test_convert_value_error():
    with pytest.raises(ValueError):
        convert("cat/dog")
    with pytest.raises(ValueError):
        convert("3/2")
    with pytest.raises(ValueError):
        convert("-1/4")


def test_convert_zero_division():
    with pytest.raises(ZeroDivisionError):
        convert("1/0")


def test_gauge_empty():
    assert gauge(0) == "E"
    assert gauge(1) == "E"


def test_gauge_full():
    assert gauge(99) == "F"
    assert gauge(100) == "F"


def test_gauge_percentage():
    assert gauge(50) == "50%"
