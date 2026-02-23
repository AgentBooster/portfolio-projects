import re


def validate(ip):
    pattern = r"^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$"
    return re.search(pattern, ip) is not None


def main():
    print(validate(input("IPv4 Address: ")))


if __name__ == "__main__":
    main()
