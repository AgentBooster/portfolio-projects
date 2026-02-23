#ifndef WORLD_H
#define WORLD_H

#include "body.h"
#include "joint.h"
#include "utils/array.h"
#include "vec2.h"

// Dynamic world using pool + active list
typedef struct {
  // Active Lists (store pointers only)
  array_t *bodies;   // Stores body_t*
  array_t *contacts; // Stores contact_t* (or values? Contacts are transient)
  // Actually contacts are rebuilt every frame, values is fine, but for
  // consistency let's check constraints. Original plan: contacts array stores
  // contact_t values. That's fine as they are transient. Bodies and Joints need
  // pools.

  array_t *joints; // Stores joint_t*

  array_t *broadphase_pairs; // Cache for candidate pairs
  vec2_t gravity;

  // Memory Pools
  body_t *body_pool;
  int *body_free_list;
  int body_pool_count; // Total slots (MAX_BODIES)
  int body_free_count; // Available slots

  joint_t *joint_pool;
  int *joint_free_list;
  int joint_pool_count; // Total slots
  int joint_free_count; // Available slots
} world_t;

void world_init(world_t *world, vec2_t gravity);
void world_destroy(world_t *world);
body_t *world_create_body(world_t *world);
joint_t *world_create_joint(world_t *world);
void world_destroy_joint(world_t *world, joint_t *joint);

void world_update(world_t *world, float dt);

#endif
