# TODO
from cs50 import get_string
import re

def main():
    number = get_string("Number: ")
    
    if is_valid(number):
        print_brand(number)
    else:
        print("INVALID")

def is_valid(number):
    # Luhn's Algorithm
    digits = [int(d) for d in number]
    checksum = 0
    
    # Process digits starting from second to last, moving left
    for i in range(len(digits) - 2, -1, -2):
        doubled = digits[i] * 2
        checksum += doubled // 10 + doubled % 10
        
    # Add the remaining digits
    for i in range(len(digits) - 1, -1, -2):
        checksum += digits[i]
        
    return checksum % 10 == 0

def print_brand(number):
    length = len(number)
    
    if length == 15 and re.match(r"^3[47]", number):
        print("AMEX")
    elif length == 16 and re.match(r"^5[1-5]", number):
        print("MASTERCARD")
    elif (length == 13 or length == 16) and re.match(r"^4", number):
        print("VISA")
    else:
        print("INVALID")

if __name__ == "__main__":
    main()
