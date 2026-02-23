import pytest # type: ignore

from working import convert


def test_valid_no_minutes():
    assert convert("9 AM to 5 PM") == "09:00 to 17:00"
    assert convert("12 AM to 12 PM") == "00:00 to 12:00"


def test_valid_with_minutes():
    assert convert("9:00 AM to 5:00 PM") == "09:00 to 17:00"
    assert convert("11:59 PM to 12:01 AM") == "23:59 to 00:01"


def test_invalid_format():
    with pytest.raises(ValueError):
        convert("9AM to 5PM")
    with pytest.raises(ValueError):
        convert("09:00 AM to 5:00 PM")
    with pytest.raises(ValueError):
        convert("9 AM 5 PM")


def test_invalid_range():
    with pytest.raises(ValueError):
        convert("13 AM to 5 PM")
    with pytest.raises(ValueError):
        convert("9:60 AM to 5 PM")
