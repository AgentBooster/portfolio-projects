def main():
    amount_due = 50
    accepted = {25, 10, 5}
    while amount_due > 0:
        print(f"Amount Due: {amount_due}")
        coin = int(input("Insert Coin: "))
        if coin in accepted:
            amount_due -= coin
    change_owed = -amount_due
    print(f"Change Owed: {change_owed}")


main()
