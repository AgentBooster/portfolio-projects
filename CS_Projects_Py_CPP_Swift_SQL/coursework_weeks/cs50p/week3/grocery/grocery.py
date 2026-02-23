def main():
    items = {}
    while True:
        try:
            item = input().strip().upper()
        except EOFError:
            break
        if item:
            items[item] = items.get(item, 0) + 1

    for item in sorted(items):
        print(f"{items[item]} {item}")


main()
