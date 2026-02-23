// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "dictionary.h"

// Represents a node in a hash table
typedef struct node {
  char word[LENGTH + 1];
  struct node *next;
} node;

// Choose number of buckets in hash table: Large prime number for distribution
const unsigned int N = 150001;

// Hash table
node *table[N];

// Count of words
unsigned int word_count = 0;

// Returns true if word is in dictionary, else false
bool check(const char *word) {
  // Hash the word
  unsigned int index = hash(word);

  // Access linked list at that index
  node *cursor = table[index];

  // Traverse list
  while (cursor != NULL) {
    if (strcasecmp(word, cursor->word) == 0) {
      return true;
    }
    cursor = cursor->next;
  }

  return false;
}

// Hashes word to a number (DJB2 variant)
unsigned int hash(const char *word) {
  unsigned long hash = 5381;
  int c;

  while ((c = *word++)) {
    hash = ((hash << 5) + hash) + tolower(c); /* hash * 33 + c */
  }

  return hash % N;
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary) {
  // Open dictionary file
  FILE *source = fopen(dictionary, "r");
  if (source == NULL) {
    return false;
  }

  // Buffer for reading words
  char word[LENGTH + 1];

  // Read strings from file one at a time
  while (fscanf(source, "%s", word) != EOF) {
    // Create new node
    node *n = malloc(sizeof(node));
    if (n == NULL) {
      fclose(source);
      return false;
    }

    // Copy word into node
    strcpy(n->word, word);

    // Hash word
    unsigned int index = hash(word);

    // Insert node into hash table (at head)
    n->next = table[index];
    table[index] = n;

    // Increment count
    word_count++;
  }

  // Close file
  fclose(source);
  return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void) { return word_count; }

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void) {
  // Iterate through buckets
  for (int i = 0; i < N; i++) {
    node *cursor = table[i];
    while (cursor != NULL) {
      node *tmp = cursor;
      cursor = cursor->next;
      free(tmp);
    }
  }
  return true;
}
