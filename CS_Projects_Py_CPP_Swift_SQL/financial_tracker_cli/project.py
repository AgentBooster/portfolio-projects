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
        raise ValueError("No se pudo obtener el precio para el simbolo ingresado.") from exc


def calculate_performance(initial, current):
    try:
        initial = float(initial)
        current = float(current)
        if initial == 0:
            raise ValueError
        return ((current - initial) / initial) * 100
    except Exception as exc:
        raise ValueError("Valores invalidos para calcular rendimiento.") from exc


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
        raise ValueError("Datos invalidos para formatear la tabla.") from exc


def read_positive_float(prompt):
    while True:
        raw = input(prompt).strip()
        try:
            value = float(raw)
            if value <= 0:
                raise ValueError
            return value
        except ValueError:
            print("Ingresa un numero valido mayor a 0.")


def main():
    print("Financial Tracker CLI")
    print("Presiona ENTER sin escribir para salir.")
    try:
        symbol = input("Ticker o par de divisas: ").strip().upper()
    except EOFError:
        return
    if not symbol:
        return
    shares = read_positive_float("Cantidad de unidades: ")
    buy_price = read_positive_float("Precio de compra por unidad: ")
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
            "Unidades": shares,
            "Compra": buy_price,
            "Actual": current_price,
            "Inversion Inicial": initial_total,
            "Valor Actual": current_total,
            "Rendimiento %": performance,
        }
    ]
    table = format_data_table(data)
    print()
    print(table)
    label = "Ganancia" if performance >= 0 else "Perdida"
    print(f"\nResultado: {label}")


if __name__ == "__main__":
    main()
