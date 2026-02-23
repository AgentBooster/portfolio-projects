#ifndef BROADPHASE_H
#define BROADPHASE_H

#include "array.h"
#include "world.h"

typedef struct {
  int a;
  int b;
} contact_pair_t;

// Uses a Uniform Grid to find potential collision pairs.
// Populates the 'pairs' array with contact_pair_t.
void broadphase_grid_compute(world_t *world, array_t *pairs);

#endif
