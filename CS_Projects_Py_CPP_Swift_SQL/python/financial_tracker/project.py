import yfinance as yf
from tabulate import tabulate


def get_price(symbol):
    try:
        if not isinstance(symbol, str) or not symbol.strip():
            raise ValueError
        ticker = yf.Ticker(symbol)
        price = None
        try:
            info = ticker.fast_info
            if isinstance(info, dict):
                price = info.get("lastPrice") or info.get("last_price")
        except Exception:
            price = None
        if price is None:
            hist = ticker.history(period="1d")
            if getattr(hist, "empty", True):
                raise ValueError
            price = hist["Close"].iloc[-1]
        return float(price)
    except Exception as exc:
        raise ValueError("Could not get the price for the entered symbol.") from exc


def calculate_performance(initial, current):
    try:
        initial = float(initial)
        current = float(current)
        if initial == 0:
            raise ValueError
        return ((current - initial) / initial) * 100
    except Exception as exc:
        raise ValueError("Invalid values to calculate performance.") from exc


def format_data_table(data_list):
    try:
        if not isinstance(data_list, list) or not data_list:
            raise ValueError
        if all(isinstance(row, dict) for row in data_list):
            return tabulate(data_list, headers="keys", tablefmt="grid", floatfmt=".2f")
        if all(isinstance(row, (list, tuple)) for row in data_list):
            return tabulate(data_list, tablefmt="grid", floatfmt=".2f")
        raise ValueError
    except Exception as exc:
        raise ValueError("Invalid data to format the table.") from exc


def read_positive_float(prompt):
    while True:
        raw = input(prompt).strip()
        try:
            value = float(raw)
            if value <= 0:
                raise ValueError
            return value
        except ValueError:
            print("Enter a valid number greater than 0.")


def main():
    print("Financial Tracker CLI")
    print("Press ENTER without typing to exit.")
    try:
        symbol = input("Ticker or currency pair: ").strip().upper()
    except EOFError:
        return
    if not symbol:
        return
    shares = read_positive_float("Number of units: ")
    buy_price = read_positive_float("Purchase price per unit: ")
    try:
        current_price = get_price(symbol)
    except ValueError as exc:
        print(f"Error: {exc}")
        return
    initial_total = shares * buy_price
    current_total = shares * current_price
    performance = calculate_performance(initial_total, current_total)
    data = [
        {
            "Ticker": symbol,
            "Units": shares,
            "Purchase": buy_price,
            "Current": current_price,
            "Initial Investment": initial_total,
            "Current Value": current_total,
            "Performance %": performance,
        }
    ]
    table = format_data_table(data)
    print()
    print(table)
    label = "Gain" if performance >= 0 else "Loss"
    print(f"\nResult: {label}")


if __name__ == "__main__":
    main()
