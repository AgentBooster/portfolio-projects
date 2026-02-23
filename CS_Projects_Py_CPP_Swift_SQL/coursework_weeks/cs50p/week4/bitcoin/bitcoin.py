import sys

import requests #type: ignore


def main():
    if len(sys.argv) != 2:
        sys.exit("Missing command-line argument")

    try:
        bitcoins = float(sys.argv[1])
    except ValueError:
        sys.exit("Command-line argument is not a number")

    try:
        response = requests.get("https://api.coincap.io/v2/assets/bitcoin")
        response.raise_for_status()
        data = response.json()
        rate = float(data["data"]["priceUsd"])
    except (requests.RequestException, ValueError, KeyError):
        sys.exit("API request failed")

    total = rate * bitcoins
    print(f"${total:,.4f}")


if __name__ == "__main__":
    main()
