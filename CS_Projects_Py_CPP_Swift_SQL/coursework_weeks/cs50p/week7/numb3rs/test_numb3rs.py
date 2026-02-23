from numb3rs import validate


def test_valid_addresses():
    assert validate("0.0.0.0")
    assert validate("1.2.3.4")
    assert validate("255.255.255.255")


def test_invalid_out_of_range():
    assert not validate("256.0.0.1")
    assert not validate("1.2.3.999")


def test_invalid_format():
    assert not validate("1.2.3")
    assert not validate("1.2.3.4.5")
    assert not validate("cat")
