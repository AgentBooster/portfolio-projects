#include <cs50.h>
#include <ctype.h>
#include <stdio.h>
#include <string.h>

int main(int argc, string argv[])
{
    if (argc != 2)
    {
        printf("Usage: ./substitution KEY\n");
        return 1;
    }

    string key = argv[1];
    int key_len = strlen(key);

    if (key_len != 26)
    {
        printf("Key must contain 26 characters.\n");
        return 1;
    }

    bool used[26] = {false};
    for (int i = 0; i < key_len; i++)
    {
        if (!isalpha(key[i]))
        {
            printf("Key must only contain alphabetic characters.\n");
            return 1;
        }

        int index = tolower(key[i]) - 'a';
        if (used[index])
        {
            printf("Key must not contain repeated characters.\n");
            return 1;
        }
        used[index] = true;
    }

    string plaintext = get_string("plaintext:  ");
    printf("ciphertext: ");

    for (int i = 0, n = strlen(plaintext); i < n; i++)
    {
        char c = plaintext[i];
        if (isupper(c))
        {
            int index = c - 'A';
            char sub = toupper(key[index]);
            printf("%c", sub);
        }
        else if (islower(c))
        {
            int index = c - 'a';
            char sub = tolower(key[index]);
            printf("%c", sub);
        }
        else
        {
            printf("%c", c);
        }
    }

    printf("\n");
    return 0;
}
