#include <cs50.h>
#include <ctype.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

int count_letters(string text);
int count_words(string text);
int count_sentences(string text);

int main(void)
{
    string text = get_string("Text: ");

    int letters = count_letters(text);
    int words = count_words(text);
    int sentences = count_sentences(text);

    if (words == 0)
    {
        printf("Before Grade 1\n");
        return 0;
    }

    double l = (double) letters / words * 100.0;
    double s = (double) sentences / words * 100.0;
    double index = 0.0588 * l - 0.296 * s - 15.8;

    int grade = (int) round(index);

    if (grade < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (grade >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", grade);
    }
}

int count_letters(string text)
{
    int count = 0;

    for (int i = 0, n = strlen(text); i < n; i++)
    {
        if (isalpha(text[i]))
        {
            count++;
        }
    }

    return count;
}

int count_words(string text)
{
    int count = 0;
    int in_word = 0;

    for (int i = 0, n = strlen(text); i < n; i++)
    {
        if (text[i] != ' ' && in_word == 0)
        {
            in_word = 1;
            count++;
        }
        else if (text[i] == ' ')
        {
            in_word = 0;
        }
    }

    return count;
}

int count_sentences(string text)
{
    int count = 0;

    for (int i = 0, n = strlen(text); i < n; i++)
    {
        if (text[i] == '.' || text[i] == '!' || text[i] == '?')
        {
            count++;
        }
    }

    return count;
}
