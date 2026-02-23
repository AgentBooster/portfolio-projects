import os
import sys

from PIL import Image, ImageOps


def main():
    if len(sys.argv) < 3:
        sys.exit("Too few command-line arguments")
    if len(sys.argv) > 3:
        sys.exit("Too many command-line arguments")

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    valid_exts = {".jpg", ".jpeg", ".png"}
    input_ext = os.path.splitext(input_path)[1].lower()
    output_ext = os.path.splitext(output_path)[1].lower()

    if input_ext not in valid_exts or output_ext not in valid_exts:
        sys.exit("Invalid output")
    if input_ext != output_ext:
        sys.exit("Invalid output")

    try:
        shirt = Image.open("shirt.png")
        with Image.open(input_path) as image:
            resized = ImageOps.fit(image, shirt.size)
            resized.paste(shirt, shirt)
            resized.save(output_path)
    except FileNotFoundError:
        sys.exit("Input does not exist")


if __name__ == "__main__":
    main()
