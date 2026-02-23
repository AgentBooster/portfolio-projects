import pytest # type: ignore

from jar import Jar


def test_init():
    jar = Jar()
    assert jar.capacity == 12
    assert jar.size == 0


def test_custom_capacity():
    jar = Jar(5)
    assert jar.capacity == 5


def test_invalid_capacity():
    with pytest.raises(ValueError):
        Jar(-1)


def test_deposit():
    jar = Jar(3)
    jar.deposit(2)
    assert jar.size == 2
    with pytest.raises(ValueError):
        jar.deposit(2)


def test_withdraw():
    jar = Jar(3)
    jar.deposit(2)
    jar.withdraw(1)
    assert jar.size == 1
    with pytest.raises(ValueError):
        jar.withdraw(5)


def test_str():
    jar = Jar(4)
    jar.deposit(3)
    assert str(jar) == "🍪🍪🍪"
