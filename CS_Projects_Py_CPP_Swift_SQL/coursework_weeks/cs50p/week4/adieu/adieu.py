import inflect # type: ignore


def main():
    names = []
    while True:
        try:
            name = input()
        except EOFError:
            break
        if name:
            names.append(name)

    engine = inflect.engine()
    print(f"Adieu, adieu, to {engine.join(names)}")


main()
