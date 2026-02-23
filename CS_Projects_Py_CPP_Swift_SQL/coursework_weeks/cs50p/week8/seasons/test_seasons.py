from datetime import date

from seasons import minutes_since_birth


def test_minutes_since_birth():
    birthdate = date(1999, 1, 1)
    today = date(2000, 1, 1)
    assert minutes_since_birth(birthdate, today) == "Five hundred twenty-five thousand, six hundred minutes"


def test_minutes_since_birth_other():
    birthdate = date(2020, 1, 1)
    today = date(2020, 1, 2)
    assert minutes_since_birth(birthdate, today) == "One thousand, four hundred forty minutes"
