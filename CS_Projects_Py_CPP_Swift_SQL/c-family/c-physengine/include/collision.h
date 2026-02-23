#ifndef COLLISION_H
#define COLLISION_H

#include "body.h"
#include <stdbool.h>

typedef struct {
  vec2_t point; // World space contact point
} contact_point_t;

typedef struct {
  bool is_colliding;
  vec2_t normal; // Collision normal (direction of resolution)
  float depth;   // Penetration depth
  int contact_count;
  contact_point_t contacts[2];
} collision_manifold_t;

// Contact structure for the solver list
typedef struct {
  body_t *a;
  body_t *b;
  vec2_t normal;
  float depth;
  int contact_count;
  contact_point_t contacts[2];
} contact_t;

// Detection
bool collision_detect(body_t *a, body_t *b, collision_manifold_t *manifold);

// Split Solver API
void resolve_velocity(contact_t *contact);
void resolve_position(contact_t *contact);

#endif
