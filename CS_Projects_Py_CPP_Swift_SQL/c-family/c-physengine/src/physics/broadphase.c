#include "broadphase.h"
#include "body.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CELL_SIZE 80
#define GRID_WIDTH 20  // 1600px wide coverage
#define GRID_HEIGHT 20 // 1600px high coverage

// Linked List Grid
// grid_heads[cell_index] -> node_index
// node_body[node_index] -> body_index
// node_next[node_index] -> next_node_index_in_same_cell
static int grid_heads[GRID_WIDTH * GRID_HEIGHT];

void broadphase_grid_compute(world_t *world, array_t *pairs) {
  // 1. Clear Grid
  // -1 indicates empty
  for (int i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++)
    grid_heads[i] = -1;

  size_t n = world->bodies->count;
  if (n == 0)
    return;

  // Dynamic Pair Matrix
  uint8_t *pair_matrix = (uint8_t *)calloc(n * n, sizeof(uint8_t));
  if (!pair_matrix) {
    fprintf(stderr,
            "Broadphase: Failed to allocate pair matrix for %zu bodies\n", n);
    return;
  }

  // Precompute cell spans and total node count
  int *min_xs = malloc(sizeof(int) * n);
  int *min_ys = malloc(sizeof(int) * n);
  int *max_xs = malloc(sizeof(int) * n);
  int *max_ys = malloc(sizeof(int) * n);
  if (!min_xs || !min_ys || !max_xs || !max_ys) {
    free(pair_matrix);
    free(min_xs);
    free(min_ys);
    free(max_xs);
    free(max_ys);
    return;
  }

  size_t total_nodes = 0;
  for (size_t i = 0; i < n; i++) {
    body_t *b = *(body_t **)array_get(world->bodies, i); // Pointer dereference!

    int min_x = (int)(b->aabb.min_x / CELL_SIZE);
    int min_y = (int)(b->aabb.min_y / CELL_SIZE);
    int max_x = (int)(b->aabb.max_x / CELL_SIZE);
    int max_y = (int)(b->aabb.max_y / CELL_SIZE);

    if (min_x < 0)
      min_x = 0;
    if (min_y < 0)
      min_y = 0;
    if (max_x >= GRID_WIDTH)
      max_x = GRID_WIDTH - 1;
    if (max_y >= GRID_HEIGHT)
      max_y = GRID_HEIGHT - 1;

    min_xs[i] = min_x;
    min_ys[i] = min_y;
    max_xs[i] = max_x;
    max_ys[i] = max_y;

    total_nodes += (size_t)(max_x - min_x + 1) * (size_t)(max_y - min_y + 1);
  }

  int *node_body = NULL;
  int *node_next = NULL;
  if (total_nodes > 0) {
    node_body = malloc(sizeof(int) * total_nodes);
    node_next = malloc(sizeof(int) * total_nodes);
  }
  if (total_nodes > 0 && (!node_body || !node_next)) {
    free(pair_matrix);
    free(min_xs);
    free(min_ys);
    free(max_xs);
    free(max_ys);
    free(node_body);
    free(node_next);
    return;
  }

  // 2. Insert Bodies (build nodes)
  size_t node_count = 0;
  for (size_t i = 0; i < n; i++) {
    int min_x = min_xs[i];
    int min_y = min_ys[i];
    int max_x = max_xs[i];
    int max_y = max_ys[i];

    for (int y = min_y; y <= max_y; y++) {
      for (int x = min_x; x <= max_x; x++) {
        int cell_idx = y * GRID_WIDTH + x;

        int node_idx = (int)node_count++;
        node_body[node_idx] = (int)i;
        node_next[node_idx] = grid_heads[cell_idx];
        grid_heads[cell_idx] = node_idx;
      }
    }
  }

  // 3. Collect Pairs
  for (int i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
    int node_a = grid_heads[i];
    while (node_a != -1) {
      int body_a_idx = node_body[node_a];
      int node_b = node_next[node_a];

      while (node_b != -1) {
        int body_b_idx = node_body[node_b];

        // Sort indices
        int a = (body_a_idx < body_b_idx) ? body_a_idx : body_b_idx;
        int b = (body_a_idx < body_b_idx) ? body_b_idx : body_a_idx;

        if (a != b) {
          body_t *body_a = *(body_t **)array_get(world->bodies, a);
          body_t *body_b = *(body_t **)array_get(world->bodies, b);

          bool sleeping = body_a->asleep && body_b->asleep;
          bool both_static =
              body_a->inverse_mass == 0 && body_b->inverse_mass == 0;

          if (!sleeping && !both_static) {
            // Matrix Access: a * n + b
            if (pair_matrix[a * n + b] == 0) {
              pair_matrix[a * n + b] = 1;
              contact_pair_t pair = {a, b};
              array_push(pairs, &pair);
            }
          }
        }
        node_b = node_next[node_b];
      }
      node_a = node_next[node_a];
    }
  }

  free(min_xs);
  free(min_ys);
  free(max_xs);
  free(max_ys);
  free(node_body);
  free(node_next);
  free(pair_matrix);
}
