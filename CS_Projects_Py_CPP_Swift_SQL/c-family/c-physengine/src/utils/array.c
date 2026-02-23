#include "utils/array.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

array_t *array_create(size_t stride, size_t initial_capacity) {
  array_t *array = malloc(sizeof(array_t));
  if (!array)
    return NULL;

  if (initial_capacity == 0)
    initial_capacity = 4;

  array->data = malloc(stride * initial_capacity);
  if (!array->data) {
    free(array);
    return NULL;
  }

  array->count = 0;
  array->capacity = initial_capacity;
  array->stride = stride;

  return array;
}

void array_destroy(array_t *array) {
  if (array) {
    free(array->data);
    free(array);
  }
}

void *array_push(array_t *array, void *value) {
  if (array->count >= array->capacity) {
    size_t new_capacity = array->capacity * 2;
    void *new_data = realloc(array->data, new_capacity * array->stride);
    if (!new_data) {
      fprintf(stderr, "Array allocation failed!\n");
      return NULL;
    }
    array->data = new_data;
    array->capacity = new_capacity;
  }

  void *target = (char *)array->data + (array->count * array->stride);
  if (value) {
    memcpy(target, value, array->stride);
  } else {
    // Just zero init key memory if pushing NULL logic (optional)
    memset(target, 0, array->stride);
  }

  array->count++;
  return target;
}

void *array_get(array_t *array, size_t index) {
  return (char *)array->data + (index * array->stride);
}

void array_clear(array_t *array) { array->count = 0; }

void array_remove_at(array_t *array, size_t index) {
  if (index >= array->count)
    return;

  // Swap with last element if it's not the last one
  if (index < array->count - 1) {
    void *dest = (char *)array->data + index * array->stride;
    void *src = (char *)array->data + (array->count - 1) * array->stride;
    memcpy(dest, src, array->stride);
  }

  array->count--;
}
