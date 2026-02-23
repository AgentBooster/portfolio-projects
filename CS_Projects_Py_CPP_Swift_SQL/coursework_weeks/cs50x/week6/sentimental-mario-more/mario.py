# TODO
from cs50 import get_int

while True:
    n = get_int("Height: ")
    if n > 0 and n < 9:
        break

for i in range(n):
    # Print spaces
    print(" " * (n - 1 - i), end="")
    # Print left pyramid
    print("#" * (i + 1), end="")
    # Print gap
    print("  ", end="")
    # Print right pyramid
    print("#" * (i + 1))
