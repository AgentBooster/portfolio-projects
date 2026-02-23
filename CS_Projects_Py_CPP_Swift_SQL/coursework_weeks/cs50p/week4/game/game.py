import random


def main():
    level = get_level()
    target = random.randint(1, level)
    while True:
        try:
            guess = int(input("Guess: "))
        except ValueError:
            continue

        if guess <= 0:
            continue
        if guess < target:
            print("Too small!")
        elif guess > target:
            print("Too large!")
        else:
            print("Just right!")
            break


def get_level():
    while True:
        try:
            level = int(input("Level: "))
            if level > 0:
                return level
        except ValueError:
            pass


main()
