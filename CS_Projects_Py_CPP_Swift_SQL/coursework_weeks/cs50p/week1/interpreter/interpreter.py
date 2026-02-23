def main():
    expression = input("Expression: ")
    x_str, operator, z_str = expression.split()
    x = float(x_str)
    z = float(z_str)

    if operator == "+":
        result = x + z
    elif operator == "-":
        result = x - z
    elif operator == "*":
        result = x * z
    else:
        result = x / z

    print(f"{result:.1f}")


main()
