import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    user_id = session["user_id"]
    
    rows = db.execute("SELECT symbol, SUM(shares) as total_shares FROM transactions WHERE user_id = ? GROUP BY symbol HAVING total_shares > 0", user_id)
    stocks = []
    grand_total = 0
    
    for row in rows:
        stock = lookup(row["symbol"])
        stocks.append({
            "symbol": stock["symbol"],
            "name": stock["name"],
            "shares": row["total_shares"],
            "price": stock["price"],
            "total": stock["price"] * row["total_shares"]
        })
        grand_total += stock["price"] * row["total_shares"]
        
    cash = db.execute("SELECT cash FROM users WHERE id = ?", user_id)[0]["cash"]
    grand_total += cash

    return render_template("index.html", stocks=stocks, cash=cash, grand_total=grand_total)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        shares = request.form.get("shares")
        
        if not symbol:
            return apology("must provide symbol", 400)
        
        item = lookup(symbol)
        if not item:
            return apology("invalid symbol", 400)
            
        try:
            shares = int(shares)
            if shares <= 0:
                raise ValueError
        except ValueError:
            return apology("shares must be positive integer", 400)

        price = item["price"]
        total_cost = shares * price
        user_id = session["user_id"]
        
        # Check cash
        user_cash = db.execute("SELECT cash FROM users WHERE id = ?", user_id)[0]["cash"]
        
        if user_cash < total_cost:
            return apology("can't afford", 400)
            
        # Update cash
        db.execute("UPDATE users SET cash = cash - ? WHERE id = ?", total_cost, user_id)
        
        # Record transaction
        db.execute("INSERT INTO transactions (user_id, symbol, shares, price) VALUES(?, ?, ?, ?)", 
                   user_id, item["symbol"], shares, price)
                   
        flash("Bought!")
        return redirect("/")

    else:
        return render_template("buy.html")





@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        if not symbol:
            return apology("must provide symbol", 400)
        
        item = lookup(symbol)
        if not item:
            return apology("invalid symbol", 400)
            
        return render_template("quoted.html", item=item)
        
    else:
        return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return apology("must provide username", 400)
        elif not password:
            return apology("must provide password", 400)
        elif not confirmation:
            return apology("must provide confirmation", 400)
        
        if password != confirmation:
            return apology("passwords do not match", 400)

        # Check if username exists
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        if len(rows) > 0:
            return apology("username already exists", 400)

        # Hash and insert
        hash_password = generate_password_hash(password)
        try:
            new_user_id = db.execute("INSERT INTO users (username, hash) VALUES(?, ?)", username, hash_password)
        except ValueError:
             return apology("username taken", 400)

        # Log in automatically
        session["user_id"] = new_user_id
        return redirect("/")

    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    user_id = session["user_id"]
    
    if request.method == "POST":
        symbol = request.form.get("symbol")
        shares = request.form.get("shares")
        
        if not symbol:
            return apology("must provide symbol", 400)
            
        try:
            shares = int(shares)
            if shares <= 0:
                raise ValueError
        except ValueError:
            return apology("shares must be positive integer", 400)
            
        # Check ownership
        user_shares = db.execute("SELECT SUM(shares) as total_shares FROM transactions WHERE user_id = ? AND symbol = ? GROUP BY symbol", user_id, symbol)[0]["total_shares"]
        
        if user_shares < shares:
            return apology("too many shares", 400)
            
        item = lookup(symbol)
        price = item["price"]
        total_sale = shares * price
        
        # Update cash
        db.execute("UPDATE users SET cash = cash + ? WHERE id = ?", total_sale, user_id)
        
        # Record transaction (negative shares)
        db.execute("INSERT INTO transactions (user_id, symbol, shares, price) VALUES(?, ?, ?, ?)", 
                   user_id, symbol, -shares, price)
                   
        flash("Sold!")
        return redirect("/")

    else:
        symbols = db.execute("SELECT symbol FROM transactions WHERE user_id = ? GROUP BY symbol HAVING SUM(shares) > 0", user_id)
        return render_template("sell.html", symbols=[row["symbol"] for row in symbols])


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    transactions = db.execute("SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC", session["user_id"])
    return render_template("history.html", transactions=transactions)
    

@app.route("/add_cash", methods=["GET", "POST"])
@login_required
def add_cash():
    """Add additional cash to account"""
    if request.method == "POST":
        try:
            amount = int(request.form.get("amount"))
            if amount <= 0:
                raise ValueError
        except ValueError:
            return apology("amount must be positive", 400)
            
        db.execute("UPDATE users SET cash = cash + ? WHERE id = ?", amount, session["user_id"])
        flash("Cash Added!")
        return redirect("/")
    else:
        return render_template("add_cash.html")
