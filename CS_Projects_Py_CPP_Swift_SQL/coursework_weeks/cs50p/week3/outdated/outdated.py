def main():
    months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    while True:
        date_str = input("Date: ").strip()
        if "/" in date_str:
            try:
                month_str, day_str, year_str = date_str.split("/")
                month = int(month_str)
                day = int(day_str)
                year = int(year_str)
            except ValueError:
                continue
        else:
            try:
                month_name, rest = date_str.split(" ", 1)
                if not rest or ", " not in rest:
                    continue
                day_str, year_str = rest.split(", ")
                month = months.index(month_name) + 1
                day = int(day_str)
                year = int(year_str)
            except (ValueError, IndexError):
                continue

        if 1 <= month <= 12 and 1 <= day <= 31:
            print(f"{year:04d}-{month:02d}-{day:02d}")
            break


main()
