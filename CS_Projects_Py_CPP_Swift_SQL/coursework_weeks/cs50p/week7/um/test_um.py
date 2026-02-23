from um import count


def test_counts_word_only():
    assert count("um") == 1
    assert count("um, um.") == 2


def test_ignores_substrings():
    assert count("yummy album") == 0


def test_case_insensitive():
    assert count("UM Um uM") == 3
