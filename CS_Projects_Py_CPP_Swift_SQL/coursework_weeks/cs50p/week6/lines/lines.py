import sys


def main():
    if len(sys.argv) < 2:
        sys.exit("Too few command-line arguments")
    if len(sys.argv) > 2:
        sys.exit("Too many command-line arguments")

    filename = sys.argv[1]
    if not filename.lower().endswith(".py"):
        sys.exit("Not a Python file")

    try:
        with open(filename, "r", encoding="utf-8") as file:
            count = 0
            for line in file:
                stripped = line.strip()
                if stripped and not stripped.startswith("#"):
                    count += 1
    except FileNotFoundError:
        sys.exit("File does not exist")

    print(count)


if __name__ == "__main__":
    main()
