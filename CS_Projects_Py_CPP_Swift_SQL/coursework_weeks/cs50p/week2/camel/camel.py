def main():
    text = input("camelCase: ")
    result = []
    for char in text:
        if char.isupper():
            result.append("_")
            result.append(char.lower())
        else:
            result.append(char)
    print("snake_case: " + "".join(result))


main()
