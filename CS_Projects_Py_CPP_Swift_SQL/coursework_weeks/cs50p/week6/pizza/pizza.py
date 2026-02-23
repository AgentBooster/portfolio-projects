import csv
import sys

from tabulate import tabulate # type: ignore


def main():
    if len(sys.argv) < 2:
        sys.exit("Too few command-line arguments")
    if len(sys.argv) > 2:
        sys.exit("Too many command-line arguments")

    filename = sys.argv[1]
    if not filename.lower().endswith(".csv"):
        sys.exit("Not a CSV file")

    try:
        with open(filename, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            table = list(reader)
    except FileNotFoundError:
        sys.exit("File does not exist")

    print(tabulate(table[1:], headers=table[0], tablefmt="grid"))


if __name__ == "__main__":
    main()
