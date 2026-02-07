import pytest
import project


class DummySeries:
    def __init__(self, values):
        self.values = values

    @property
    def iloc(self):
        return self

    def __getitem__(self, idx):
        return self.values[idx]


class DummyHistory:
    def __init__(self, values):
        self._values = values
        self.empty = len(values) == 0

    def __getitem__(self, key):
        if key != "Close":
            raise KeyError(key)
        return DummySeries(self._values)


class DummyTickerFast:
    def __init__(self, price):
        self.fast_info = {"lastPrice": price}

    def history(self, period="1d"):
        return DummyHistory([])


class DummyTickerHistory:
    def __init__(self, values):
        self.fast_info = {}
        self._values = values

    def history(self, period="1d"):
        return DummyHistory(self._values)


class DummyTickerEmpty:
    def __init__(self):
        self.fast_info = {}

    def history(self, period="1d"):
        return DummyHistory([])


def test_get_price_fast_info(monkeypatch):
    def fake_ticker(symbol):
        return DummyTickerFast(123.45)

    monkeypatch.setattr(project.yf, "Ticker", fake_ticker)
    assert project.get_price("AAPL") == pytest.approx(123.45)


def test_get_price_history(monkeypatch):
    def fake_ticker(symbol):
        return DummyTickerHistory([150.0])

    monkeypatch.setattr(project.yf, "Ticker", fake_ticker)
    assert project.get_price("MSFT") == pytest.approx(150.0)


def test_get_price_invalid(monkeypatch):
    def fake_ticker(symbol):
        return DummyTickerEmpty()

    monkeypatch.setattr(project.yf, "Ticker", fake_ticker)
    with pytest.raises(ValueError):
        project.get_price("BAD")


def test_calculate_performance_gain():
    assert project.calculate_performance(100, 110) == pytest.approx(10.0)


def test_calculate_performance_loss():
    assert project.calculate_performance(200, 150) == pytest.approx(-25.0)


def test_calculate_performance_invalid():
    with pytest.raises(ValueError):
        project.calculate_performance(0, 10)


def test_format_data_table_dicts():
    data = [{"Ticker": "AAPL", "Precio": 10.0}]
    table = project.format_data_table(data)
    assert "Ticker" in table and "AAPL" in table


def test_format_data_table_tuples():
    data = [("AAPL", 10.0), ("MSFT", 12.0)]
    table = project.format_data_table(data)
    assert "AAPL" in table and "MSFT" in table


def test_format_data_table_invalid():
    with pytest.raises(ValueError):
        project.format_data_table("bad")
