# Financial Tracker CLI
#### Video Demo: <URL HERE>
#### Description:
Financial Tracker CLI is a Python command-line tool that tracks the current value of a stock or FX position using real-time data from `yfinance`, without an API key. The user enters a ticker (e.g., AAPL or USDUYU=X), the number of units, and the buy price per unit. The program fetches the current price, computes the current value of the position, and shows the percentage performance. The output is formatted as a clean ASCII table that is easy to scan in any terminal.

This project is designed for CS50P’s final requirement and focuses on practical skills: consuming external data safely, validating user input, handling network errors, and presenting results in a professional CLI format. The workflow is intentionally simple so the tool can be tested in seconds.

#### Usage & Examples
When the program runs, it requests three specific inputs. Here is how to use them:

- **Ticker:** The symbol of the asset.
   - For Stocks: Use the standard symbol (e.g., `AAPL`).
   - For Currencies: Use the pair ending in `=X` (e.g., `USDUYU=X` for USD to Uruguayan Peso).
- **Units:** The total quantity you hold (e.g., `100` dollars).
- **Buy Price:** The price you paid in the past, used to calculate profit/loss (e.g., `38` uruguayan peso).

**Example 1 (Currency):**
* Input: `USDUYU=X` -> `100` -> `38`
* Meaning: You have 100 USD bought at 38 UYU. The tool compares it against the current rate.

**Example 2 (Stock):**
* Input: `AAPL` -> `1` -> `200`
* Meaning: You have 1 Apple share bought at $200.

Files
- `project.py`: Contains `main` and the required functions `get_price`, `calculate_performance`, and `format_data_table` at the top level. `get_price` first attempts to read `fast_info`, then falls back to `history` for the latest close. `calculate_performance` validates numeric input and prevents division by zero. `format_data_table` accepts a list of dicts or tuples and returns a `tabulate` grid string. A small helper reads positive numbers from the user.
- `test_project.py`: Pytest unit tests for the three required functions. `get_price` is tested with monkeypatched stubs so tests do not require an internet connection. `calculate_performance` covers gain, loss, and invalid input. `format_data_table` is tested with dict and tuple inputs and an invalid case.
- `requirements.txt`: Lists external dependencies.

Quick Start
1) Install dependencies: `pip install -r requirements.txt`
2) Run the app: `python project.py`
3) Run tests: `pytest`

Expected Output
The CLI prints a grid table containing: ticker, units, buy price, current price, initial investment, current value, and performance percent. It then prints a short label indicating gain or loss.

Design Notes
`yfinance` was chosen to avoid API keys while supporting both stocks and currency pairs. `tabulate` provides clean output without a GUI dependency. The program uses try/except blocks to keep behavior stable when a ticker is invalid or data cannot be retrieved.

Video Requirement
The demo video must open with: project title, full name, GitHub username, city and country, and the recording date. Recommended intro text:
- Name: Christian Moraes
- Project: Financial Tracker CLI
- GitHub: AgentBooster
- City/Country: Montevideo, Uruguay
- Date: December 27, 2025

This project meets CS50P’s structure requirements: Python implementation, `main` plus three additional top-level functions in `project.py`, tests for those functions in `test_project.py`, and a `requirements.txt` listing external libraries.
