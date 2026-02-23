import re


def parse(s):
    match = re.search(r'<iframe[^>]+src="https?://(?:www\.)?youtube\.com/embed/([^"?]+)[^"]*"', s)
    if not match:
        return None
    return f"https://youtu.be/{match.group(1)}"


def main():
    print(parse(input("HTML: ")))


if __name__ == "__main__":
    main()
