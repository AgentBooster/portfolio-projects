#include "body.h"
#include <math.h>

// Helpers for AABB
static void get_vertices_aabb(body_t *b, vec2_t v[4]) {
  mat22_t rot = mat22_new(b->rotation);
  float hw = b->width * 0.5f;
  float hh = b->height * 0.5f;

  v[0] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(-hw, -hh)));
  v[1] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(hw, -hh)));
  v[2] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(hw, hh)));
  v[3] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(-hw, hh)));
}

void body_compute_aabb(body_t *body) {
  if (body->shape_type == BODY_SHAPE_CIRCLE) {
    body->aabb.min_x = body->position.x - body->radius;
    body->aabb.min_y = body->position.y - body->radius;
    body->aabb.max_x = body->position.x + body->radius;
    body->aabb.max_y = body->position.y + body->radius;
  } else {
    vec2_t v[4];
    get_vertices_aabb(body, v);

    float min_x = v[0].x;
    float min_y = v[0].y;
    float max_x = v[0].x;
    float max_y = v[0].y;

    for (int i = 1; i < 4; i++) {
      if (v[i].x < min_x)
        min_x = v[i].x;
      if (v[i].x > max_x)
        max_x = v[i].x;
      if (v[i].y < min_y)
        min_y = v[i].y;
      if (v[i].y > max_y)
        max_y = v[i].y;
    }
    body->aabb.min_x = min_x;
    body->aabb.min_y = min_y;
    body->aabb.max_x = max_x;
    body->aabb.max_y = max_y;
  }
}

// Angular Integration added
void body_update(body_t *body, float dt) {
  if (body->inverse_mass == 0.0f)
    return;

  // 1. Linear Integration
  // Damping
  body->velocity = vec2_scale(body->velocity, 0.999f);
  body->velocity = vec2_add(body->velocity, vec2_scale(body->acceleration, dt));
  body->position = vec2_add(body->position, vec2_scale(body->velocity, dt));
  body->acceleration = vec2_new(0, 0);

  // 2. Angular Integration
  if (body->inverse_inertia > 0.0f) {
    // Angular Damping
    body->angular_velocity *= 0.99f;

    float angular_acc = body->torque * body->inverse_inertia;
    body->angular_velocity += angular_acc * dt;
    body->rotation += body->angular_velocity * dt;
    body->torque = 0.0f;
  }

  // Micro-velocity clamping
  if (vec2_length_sq(body->velocity) < 0.5f) {
    body->velocity = vec2_new(0, 0);
  }
}

void body_apply_force(body_t *body, vec2_t force) {
  if (body->inverse_mass == 0.0f)
    return;

  // a = F / m
  vec2_t a = vec2_scale(force, body->inverse_mass);
  body->acceleration = vec2_add(body->acceleration, a);
}

body_t *body_init_circle(body_t *body, vec2_t pos, float mass, float radius,
                         uint32_t color) {
  body->position = pos;
  body->velocity = vec2_new(0, 0);
  body->acceleration = vec2_new(0, 0);
  body->rotation = 0.0f;
  body->angular_velocity = 0.0f;
  body->torque = 0.0f;

  body->mass = mass;
  if (mass > 0.0f) {
    body->inverse_mass = 1.0f / mass;
    body->inertia = 0.5f * mass * radius * radius;
    body->inverse_inertia = 1.0f / body->inertia;
  } else {
    body->inverse_mass = 0.0f;
    body->inertia = 0.0f;
    body->inverse_inertia = 0.0f;
  }

  body->shape_type = BODY_SHAPE_CIRCLE;
  body->radius = radius;
  body->color = color;

  // Materials
  body->restitution = 0.5f;
  body->static_friction = 0.5f;
  body->dynamic_friction = 0.3f;

  // Sleeping
  body->asleep = false;
  body->sleep_time = 0.0f;
  body->in_joint = false;
  return body;
}

body_t *body_init_rect(body_t *body, vec2_t pos, float mass, float width,
                       float height, uint32_t color) {
  body->position = pos;
  body->velocity = vec2_new(0, 0);
  body->acceleration = vec2_new(0, 0);
  body->rotation = 0.0f;
  body->angular_velocity = 0.0f;
  body->torque = 0.0f;

  body->mass = mass;
  if (mass > 0.0f) {
    body->inverse_mass = 1.0f / mass;
    // Box Inertia: m * (w^2 + h^2) / 12
    body->inertia = (mass * (width * width + height * height)) / 12.0f;
    body->inverse_inertia = 1.0f / body->inertia;
  } else {
    body->inverse_mass = 0.0f;
    body->inertia = 0.0f;
    body->inverse_inertia = 0.0f;
  }

  body->shape_type = BODY_SHAPE_RECT;
  body->width = width;
  body->height = height;
  body->color = color;
  // Material defaults
  body->restitution = 0.2f;
  body->static_friction = 0.6f;
  body->dynamic_friction = 0.4f;

  // Sleeping
  body->asleep = false;
  body->sleep_time = 0.0f;
  body->in_joint = false;
  return body;
}
