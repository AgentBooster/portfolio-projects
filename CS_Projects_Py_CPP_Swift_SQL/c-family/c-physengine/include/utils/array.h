#ifndef ARRAY_H
#define ARRAY_H

#include <stddef.h>

typedef struct {
  void *data;      // Pointer to raw memory
  size_t count;    // Number of elements
  size_t capacity; // Allocated slots
  size_t stride;   // Size of one element (bytes)
} array_t;

// Initialize an empty array
array_t *array_create(size_t stride, size_t initial_capacity);

// Free the array and its internal data
void array_destroy(array_t *array);

// Add an element. 'data' must point to the value to copy.
void *array_push(array_t *array, void *data);

// Get pointer to element at index (unsafe: no bounds check for speed)
void *array_get(array_t *array, size_t index);

// Clear all elements (does not free memory)
void array_clear(array_t *array);

void array_remove_at(array_t *array, size_t index);

#endif
