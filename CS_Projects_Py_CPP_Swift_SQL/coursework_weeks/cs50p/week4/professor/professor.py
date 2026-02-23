import random


def main():
    level = get_level()
    score = 0
    for _ in range(10):
        x = generate_integer(level)
        y = generate_integer(level)
        attempts = 0
        while attempts < 3:
            try:
                answer = int(input(f"{x} + {y} = "))
            except ValueError:
                answer = None
            if answer == x + y:
                score += 1
                break
            print("EEE")
            attempts += 1
        if attempts == 3:
            print(f"{x} + {y} = {x + y}")
    print(f"Score: {score}")


def get_level():
    while True:
        try:
            level = int(input("Level: "))
            if level in {1, 2, 3}:
                return level
        except ValueError:
            pass


def generate_integer(level):
    if level == 1:
        return random.randint(0, 9)
    if level == 2:
        return random.randint(10, 99)
    if level == 3:
        return random.randint(100, 999)
    raise ValueError("Level must be 1, 2, or 3")


if __name__ == "__main__":
    main()
