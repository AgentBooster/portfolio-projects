import csv
import sys


def main():
    if len(sys.argv) < 3:
        sys.exit("Too few command-line arguments")
    if len(sys.argv) > 3:
        sys.exit("Too many command-line arguments")

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not input_file.lower().endswith(".csv") or not output_file.lower().endswith(".csv"):
        sys.exit("Not a CSV file")

    try:
        with open(input_file, "r", encoding="utf-8") as infile:
            reader = csv.DictReader(infile)
            with open(output_file, "w", encoding="utf-8", newline="") as outfile:
                writer = csv.DictWriter(outfile, fieldnames=["first", "last", "house"])
                writer.writeheader()
                for row in reader:
                    last, first = [part.strip() for part in row["name"].split(",", 1)]
                    writer.writerow({"first": first, "last": last, "house": row["house"]})
    except FileNotFoundError:
        sys.exit("Could not read input file")


if __name__ == "__main__":
    main()
