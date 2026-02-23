import sys
from datetime import date

import inflect 3 # type: ignore


def minutes_since_birth(birthdate, today=None):
    if today is None:
        today = date.today()
    minutes = (today - birthdate).days * 24 * 60
    engine = inflect.engine()
    words = engine.number_to_words(minutes, andword="")
    return f"{words.capitalize()} minutes"


def main():
    try:
        birthdate = date.fromisoformat(input("Date of Birth: "))
    except ValueError:
        sys.exit("Invalid date")
    print(minutes_since_birth(birthdate))


if __name__ == "__main__":
    main()
