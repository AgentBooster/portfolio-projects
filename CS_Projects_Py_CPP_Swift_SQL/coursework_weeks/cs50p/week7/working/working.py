import re


def convert(s):
    match = re.search(
        r"^([1-9]|1[0-2])(?::([0-5][0-9]))?\s(AM|PM) to ([1-9]|1[0-2])(?::([0-5][0-9]))?\s(AM|PM)$",
        s,
    )
    if not match:
        raise ValueError

    start_hour = int(match.group(1))
    start_min = int(match.group(2) or 0)
    start_period = match.group(3)
    end_hour = int(match.group(4))
    end_min = int(match.group(5) or 0)
    end_period = match.group(6)

    start_hour = to_24(start_hour, start_period)
    end_hour = to_24(end_hour, end_period)

    return f"{start_hour:02d}:{start_min:02d} to {end_hour:02d}:{end_min:02d}"


def to_24(hour, period):
    if period == "AM":
        return 0 if hour == 12 else hour
    return 12 if hour == 12 else hour + 12


def main():
    print(convert(input("Hours: ")))


if __name__ == "__main__":
    main()
