def convert(time):
    hours_str, minutes_str = time.split(":")
    hours = int(hours_str)
    minutes = int(minutes_str)
    return hours + minutes / 60


def main():
    time = convert(input("What time is it? "))
    if 7 <= time <= 8:
        print("breakfast time")
    elif 12 <= time <= 13:
        print("lunch time")
    elif 18 <= time <= 19:
        print("dinner time")


if __name__ == "__main__":
    main()
