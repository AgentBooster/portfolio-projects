import random
import sys

from pyfiglet import Figlet # type: ignore


def main():
    figlet = Figlet()
    fonts = figlet.getFonts()

    if len(sys.argv) == 1:
        font = random.choice(fonts)
    elif len(sys.argv) == 3 and sys.argv[1] in {"-f", "--font"}:
        font = sys.argv[2]
        if font not in fonts:
            sys.exit("Invalid usage")
    else:
        sys.exit("Invalid usage")

    figlet.setFont(font=font)
    text = input("Input: ")
    print(figlet.renderText(text))


main()
