def main():
    text = input("Input: ")
    vowels = "aeiouAEIOU"
    result = []
    for char in text:
        if char not in vowels:
            result.append(char)
    print("Output: " + "".join(result))


main()
