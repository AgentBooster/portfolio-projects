#ifndef BODY_H
#define BODY_H

#include "vec2.h"
#include <stdbool.h>
#include <stdint.h>

#define MAX_BODIES 1024

typedef enum { BODY_SHAPE_CIRCLE, BODY_SHAPE_RECT } body_shape_t;

// Axis Aligned Bounding Box
typedef struct {
  float min_x, min_y;
  float max_x, max_y;
} aabb_t;

typedef struct {
  // Shape
  body_shape_t shape_type;
  float width;
  float height;
  float radius; // For Circle

  // AABB Cache
  aabb_t aabb;

  vec2_t position;
  vec2_t velocity;
  vec2_t acceleration;

  // Angular State
  float rotation;         // Angle in radians
  float angular_velocity; // radians per second
  float torque;           // Accumulator
  float inertia;          // Moment of inertia
  float inverse_inertia;

  float mass;
  float inverse_mass; // 1/mass, precomputed for optimization. 0 if static.

  // Material Properties
  float restitution;      // Bounciness [0..1]
  float static_friction;  // [0..1] usually
  float dynamic_friction; // [0..1] usually

  // Sleeping
  bool asleep;
  float sleep_time;
  bool in_joint;

  // XPBD Solver Temp Storage
  vec2_t solve_start_pos;
  float solve_start_rot;

  // Visual
  uint32_t color; // 0xRRGGBBAA
} body_t;

// Initialization
body_t *body_init_circle(body_t *body, vec2_t pos, float mass, float radius,
                         uint32_t color);
body_t *body_init_rect(body_t *body, vec2_t pos, float mass, float width,
                       float height, uint32_t color);

// Physics
// Physics
void body_apply_force(body_t *body, vec2_t force);
void body_update(body_t *body, float dt);
void body_compute_aabb(body_t *body);

#endif
