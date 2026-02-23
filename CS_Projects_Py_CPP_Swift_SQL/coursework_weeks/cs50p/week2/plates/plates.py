def is_valid(s):
    if not (2 <= len(s) <= 6):
        return False
    if not s[:2].isalpha():
        return False
    if not s.isalnum():
        return False

    number_started = False
    for char in s:
        if char.isdigit():
            if not number_started:
                if char == "0":
                    return False
                number_started = True
        elif number_started:
            return False

    return True


def main():
    plate = input("Plate: ")
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")


main()
