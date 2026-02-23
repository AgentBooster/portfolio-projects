#include "world.h"
#include "broadphase.h"
#include "collision.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

static bool bodies_connected_by_joint(world_t *world, body_t *a, body_t *b) {
  for (size_t i = 0; i < world->joints->count; i++) {
    // Joints array now stores POINTERS (joint_t*)
    joint_t *j = *(joint_t **)array_get(world->joints, i);
    if ((j->body_a == a && j->body_b == b) ||
        (j->body_a == b && j->body_b == a)) {
      return true;
    }
  }
  return false;
}

static bool body_has_joint(world_t *world, body_t *body) {
  for (size_t i = 0; i < world->joints->count; i++) {
    joint_t *j = *(joint_t **)array_get(world->joints, i);
    if (j->body_a == body || j->body_b == body) {
      return true;
    }
  }
  return false;
}

void world_init(world_t *world, vec2_t gravity) {
  // 1. Initialize Active Lists (storing pointers)
  world->bodies = array_create(sizeof(body_t *), 32);
  world->contacts =
      array_create(sizeof(contact_t), 32); // Contacts are transient values
  world->joints = array_create(sizeof(joint_t *), 16);
  world->broadphase_pairs = array_create(sizeof(contact_pair_t), 128);
  world->gravity = gravity;

  // 2. Initialize Memory Pools
  world->body_pool_count = MAX_BODIES;
  world->body_pool = (body_t *)malloc(sizeof(body_t) * MAX_BODIES);
  world->body_free_list = (int *)malloc(sizeof(int) * MAX_BODIES);
  world->body_free_count = MAX_BODIES;

  for (int i = 0; i < MAX_BODIES; i++) {
    world->body_free_list[i] = MAX_BODIES - 1 - i; // Stack order
  }

  // Joint Pool (Fixed size, say 1024)
  int MAX_JOINTS = 1024;
  world->joint_pool_count = MAX_JOINTS;
  world->joint_pool = (joint_t *)malloc(sizeof(joint_t) * MAX_JOINTS);
  world->joint_free_list = (int *)malloc(sizeof(int) * MAX_JOINTS);
  world->joint_free_count = MAX_JOINTS;

  for (int i = 0; i < MAX_JOINTS; i++) {
    world->joint_free_list[i] = MAX_JOINTS - 1 - i;
  }
}

void world_destroy(world_t *world) {
  array_destroy(world->bodies);
  array_destroy(world->contacts);
  array_destroy(world->joints);
  array_destroy(world->broadphase_pairs);

  if (world->body_pool)
    free(world->body_pool);
  if (world->body_free_list)
    free(world->body_free_list);
  if (world->joint_pool)
    free(world->joint_pool);
  if (world->joint_free_list)
    free(world->joint_free_list);
}

body_t *world_create_body(world_t *world) {
  if (world->body_free_count <= 0) {
    fprintf(stderr, "World body pool exhausted!\n");
    return NULL;
  }

  // Pop from free list
  int index = world->body_free_list[--world->body_free_count];
  body_t *body = &world->body_pool[index];

  // Initialize generic defaults or zero out
  // NOTE: body_init_... functions will overwrite fields, but zeroing is safer.
  *body = (body_t){0}; // C99 compound literal

  // Push POINTER to active list
  if (array_push(world->bodies, &body) == NULL) {
    // Revert pool allocation if active list push fails
    world->body_free_list[world->body_free_count++] = index;
    return NULL;
  }

  return body;
}

joint_t *world_create_joint(world_t *world) {
  if (world->joint_free_count <= 0) {
    fprintf(stderr, "World joint pool exhausted!\n");
    return NULL;
  }

  int index = world->joint_free_list[--world->joint_free_count];
  joint_t *joint = &world->joint_pool[index];

  *joint = (joint_t){0};
  joint->P = vec2_new(0, 0);

  if (array_push(world->joints, &joint) == NULL) {
    world->joint_free_list[world->joint_free_count++] = index;
    return NULL;
  }

  return joint;
}

void world_destroy_joint(world_t *world, joint_t *joint) {
  if (!joint)
    return;

  // 1. Remove from active list
  for (size_t i = 0; i < world->joints->count; i++) {
    joint_t *j = *(joint_t **)array_get(world->joints, i);
    if (j == joint) {
      body_t *a = j->body_a;
      body_t *b = j->body_b;

      array_remove_at(world->joints, i);

      if (a && !body_has_joint(world, a))
        a->in_joint = false;
      if (b && !body_has_joint(world, b))
        b->in_joint = false;

      // 2. Return to pool
      // Calculate index by pointer arithmetic
      // index = (ptr - base)
      long index = joint - world->joint_pool;
      if (index >= 0 && index < world->joint_pool_count) {
        world->joint_free_list[world->joint_free_count++] = (int)index;
      }
      return;
    }
  }
}

void world_update(world_t *world, float dt) {
  const float SLEEP_LINEAR_EPS_SQ = 3.0f; // ~1.73 px/s
  const float SLEEP_ANGULAR_EPS = 0.2f;   // rad/s
  const float SLEEP_TIME = 0.8f;

  // 1. Apply Forces
  for (size_t i = 0; i < world->bodies->count; i++) {
    body_t *body = *(body_t **)array_get(world->bodies, i); // DOUBLE POINTER
    if (body->inverse_mass > 0.0f) {
      if (body->asleep)
        continue;

      vec2_t gravity_force = vec2_scale(world->gravity, body->mass);
      body_apply_force(body, gravity_force);

      body->velocity =
          vec2_add(body->velocity, vec2_scale(body->acceleration, dt));
      body->velocity = vec2_scale(body->velocity, 0.999f);
      body->acceleration = vec2_new(0, 0);

      if (body->inverse_inertia > 0.0f) {
        float angular_acc = body->torque * body->inverse_inertia;
        body->angular_velocity += angular_acc * dt;
        body->angular_velocity *= 0.98f;
        body->torque = 0.0f;
      }
    }
  }

  // 2. Broadphase & Narrowphase
  array_clear(world->contacts);

  // 2a. Update AABBs
  for (size_t i = 0; i < world->bodies->count; i++) {
    body_t *b = *(body_t **)array_get(world->bodies, i);
    body_compute_aabb(b);
  }

  // 2b. Broadphase (Now uses updated list)
  array_clear(world->broadphase_pairs);
  broadphase_grid_compute(world, world->broadphase_pairs);

  // 2c. Narrowphase
  for (size_t k = 0; k < world->broadphase_pairs->count; k++) {
    contact_pair_t *pair =
        (contact_pair_t *)array_get(world->broadphase_pairs, k);

    // Broadphase returns indices into ACTIVE LIST.
    body_t *a = *(body_t **)array_get(world->bodies, pair->a);
    body_t *b = *(body_t **)array_get(world->bodies, pair->b);

    if (a->inverse_mass == 0 && b->inverse_mass == 0)
      continue;
    if (a->asleep && b->asleep)
      continue;
    if (bodies_connected_by_joint(world, a, b))
      continue;

    collision_manifold_t manifold;
    if (collision_detect(a, b, &manifold)) {
      // Wake up logic
      if (a->asleep || b->asleep) {
        bool a_moving = (vec2_length_sq(a->velocity) > SLEEP_LINEAR_EPS_SQ) ||
                        (fabsf(a->angular_velocity) > SLEEP_ANGULAR_EPS);
        bool b_moving = (vec2_length_sq(b->velocity) > SLEEP_LINEAR_EPS_SQ) ||
                        (fabsf(b->angular_velocity) > SLEEP_ANGULAR_EPS);

        bool wake_a = a->asleep && b->inverse_mass > 0.0f && b_moving;
        bool wake_b = b->asleep && a->inverse_mass > 0.0f && a_moving;

        if (wake_a) {
          a->asleep = false;
          a->sleep_time = 0.0f;
        }
        if (wake_b) {
          b->asleep = false;
          b->sleep_time = 0.0f;
        }

        if (!wake_a && !wake_b)
          continue;
      }

      contact_t contact;
      contact.a = a;
      contact.b = b;
      contact.normal = manifold.normal;
      contact.depth = manifold.depth;
      contact.contact_count = manifold.contact_count;
      for (int m = 0; m < manifold.contact_count; m++) {
        contact.contacts[m] = manifold.contacts[m];
      }
      array_push(world->contacts, &contact);
    }
  }

  // 3. Iterative Solver
  prepare_joints(world->joints, dt);

  const int ITERATIONS = 20;
  for (int it = 0; it < ITERATIONS; it++) {
    for (size_t k = 0; k < world->contacts->count; k++) {
      contact_t *contact = (contact_t *)array_get(world->contacts, k);
      resolve_velocity(contact);
    }
  }

  // 4. Integrate Position
  for (size_t i = 0; i < world->bodies->count; i++) {
    body_t *body = *(body_t **)array_get(world->bodies, i); // Pointer!
    if (body->inverse_mass > 0.0f) {
      if (body->asleep)
        continue;

      body->position = vec2_add(body->position, vec2_scale(body->velocity, dt));

      if (body->inverse_inertia > 0.0f) {
        body->rotation += body->angular_velocity * dt;
      }

      if (vec2_length_sq(body->velocity) < 0.5f) {
        body->velocity = vec2_new(0, 0);
      }

      if (vec2_length_sq(body->velocity) > 4000000.0f) {
        vec2_normalize(&body->velocity);
        body->velocity = vec2_scale(body->velocity, 2000.0f);
      }
      if (!body->in_joint && fabsf(body->angular_velocity) < 0.05f) {
        body->angular_velocity = 0.0f;
      }
    }
  }

  // 5. Correction
  for (size_t k = 0; k < world->contacts->count; k++) {
    contact_t *contact = (contact_t *)array_get(world->contacts, k);
    resolve_position(contact);
  }

  // 5b. Joint XPBD
  // XPBD Robust Velocity Update:
  // 1. Snapshot integrated position (prediction)
  for (size_t i = 0; i < world->bodies->count; i++) {
    body_t *b = *(body_t **)array_get(world->bodies, i);
    if (b->inverse_mass > 0.0f) {
      b->solve_start_pos = b->position;
      b->solve_start_rot = b->rotation;
    }
  }

  // 2. Clear Impulses and Solve Position
  for (size_t i = 0; i < world->joints->count; i++) {
    joint_t *j = *(joint_t **)array_get(world->joints, i); // Pointer!
    j->P = vec2_new(0, 0);
  }
  const int JOINT_ITERS = 10;
  for (int it = 0; it < JOINT_ITERS; it++) {
    resolve_joints(world->joints, dt);
  }

  // 3. Update Velocity based on Total Position Correction
  // v_new = v_integrated + (x_corrected - x_integrated) / dt
  for (size_t i = 0; i < world->bodies->count; i++) {
    body_t *b = *(body_t **)array_get(world->bodies, i);
    if (b->inverse_mass > 0.0f && !b->asleep) {
      vec2_t dx = vec2_sub(b->position, b->solve_start_pos);
      float drot = b->rotation - b->solve_start_rot;

      b->velocity = vec2_add(b->velocity, vec2_scale(dx, 1.0f / dt));
      b->angular_velocity += drot / dt;
    }
  }

  // 6. Sleeping
  for (size_t i = 0; i < world->bodies->count; i++) {
    body_t *body = *(body_t **)array_get(world->bodies, i); // Pointer!
    if (body->inverse_mass == 0.0f)
      continue;

    float speed_sq = vec2_length_sq(body->velocity);
    float ang_speed = fabsf(body->angular_velocity);

    if (speed_sq < SLEEP_LINEAR_EPS_SQ && ang_speed < SLEEP_ANGULAR_EPS) {
      if (body->in_joint) {
        body->sleep_time = 0.0f;
        body->asleep = false;
        continue;
      }
      body->sleep_time += dt;
      if (body->sleep_time >= SLEEP_TIME) {
        body->velocity = vec2_new(0, 0);
        body->angular_velocity = 0.0f;
        body->asleep = true;
      }
    } else {
      body->sleep_time = 0.0f;
      body->asleep = false;
    }
  }
}
