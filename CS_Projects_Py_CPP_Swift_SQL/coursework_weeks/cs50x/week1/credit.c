#include <cs50.h>
#include <stdio.h>

int main(void)
{
    long number = get_long("Number: ");

    if (number < 0)
    {
        printf("INVALID\n");
        return 0;
    }

    long temp = number;
    int sum = 0;
    int position = 0;
    int length = 0;
    int first_digit = 0;
    int first_two = 0;

    while (temp > 0)
    {
        int digit = temp % 10;

        if (position % 2 == 1)
        {
            int product = digit * 2;
            sum += product / 10 + product % 10;
        }
        else
        {
            sum += digit;
        }

        length++;
        if (temp < 10)
        {
            first_digit = temp;
        }
        else if (temp < 100)
        {
            first_two = temp;
        }

        temp /= 10;
        position++;
    }

    if (sum % 10 != 0)
    {
        printf("INVALID\n");
        return 0;
    }

    if (length == 15 && (first_two == 34 || first_two == 37))
    {
        printf("AMEX\n");
    }
    else if (length == 16 && (first_two >= 51 && first_two <= 55))
    {
        printf("MASTERCARD\n");
    }
    else if ((length == 13 || length == 16) && first_digit == 4)
    {
        printf("VISA\n");
    }
    else
    {
        printf("INVALID\n");
    }
}
