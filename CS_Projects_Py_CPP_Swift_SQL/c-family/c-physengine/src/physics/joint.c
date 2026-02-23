#include "joint.h"
#include <math.h>

void joint_init_revolute(joint_t *joint, body_t *a, body_t *b, vec2_t anchor) {
  joint->type = JOINT_REVOLUTE;
  joint->body_a = a;
  joint->body_b = b;

  // Calculate local anchors
  // Local = Rot^T * (WorldAnchor - BodyPos)
  mat22_t rot_a_t = mat22_transpose(mat22_new(a->rotation));
  mat22_t rot_b_t = mat22_transpose(mat22_new(b->rotation));

  joint->local_anchor_a =
      mat22_mul_vec2(rot_a_t, vec2_sub(anchor, a->position));
  joint->local_anchor_b =
      mat22_mul_vec2(rot_b_t, vec2_sub(anchor, b->position));

  joint->P = vec2_new(0, 0);
  joint->compliance = 0.0f; // Rigid revolute by default

  // Mark bodies as part of a joint (avoid sleeping and self-collisions)
  a->in_joint = true;
  b->in_joint = true;
}

void resolve_joint_revolute(joint_t *joint, float dt) {
  body_t *a = joint->body_a;
  body_t *b = joint->body_b;

  mat22_t rot_a = mat22_new(a->rotation);
  mat22_t rot_b = mat22_new(b->rotation);

  vec2_t ra = mat22_mul_vec2(rot_a, joint->local_anchor_a);
  vec2_t rb = mat22_mul_vec2(rot_b, joint->local_anchor_b);

  vec2_t pa = vec2_add(a->position, ra);
  vec2_t pb = vec2_add(b->position, rb);
  vec2_t C = vec2_sub(pb, pa);

  float inv_mass_sum = a->inverse_mass + b->inverse_mass;

  float rax2 = ra.x * ra.x;
  float ray2 = ra.y * ra.y;
  float rbx2 = rb.x * rb.x;
  float rby2 = rb.y * rb.y;

  float k11 =
      inv_mass_sum + a->inverse_inertia * ray2 + b->inverse_inertia * rby2;
  float k22 =
      inv_mass_sum + a->inverse_inertia * rax2 + b->inverse_inertia * rbx2;
  float k12 =
      -a->inverse_inertia * ra.y * ra.x - b->inverse_inertia * rb.y * rb.x;

  float det = k11 * k22 - k12 * k12;
  if (det == 0.0f)
    return;

  float alpha = joint->compliance / (dt * dt);
  float k11c = k11 + alpha;
  float k22c = k22 + alpha;
  float det_c = k11c * k22c - k12 * k12;
  if (det_c == 0.0f)
    return;

  vec2_t rhs = vec2_sub(vec2_scale(joint->P, -alpha), C);

  vec2_t delta_lambda;
  delta_lambda.x = (k22c * rhs.x - k12 * rhs.y) / det_c;
  delta_lambda.y = (k11c * rhs.y - k12 * rhs.x) / det_c;

  // Calculate Corrections
  vec2_t dx_a = vec2_scale(delta_lambda, -a->inverse_mass);
  vec2_t dx_b = vec2_scale(delta_lambda, b->inverse_mass);
  float drot_a =
      -(ra.x * delta_lambda.y - ra.y * delta_lambda.x) * a->inverse_inertia;
  float drot_b =
      (rb.x * delta_lambda.y - rb.y * delta_lambda.x) * b->inverse_inertia;

  // Apply Position
  a->position = vec2_add(a->position, dx_a);
  b->position = vec2_add(b->position, dx_b);
  a->rotation += drot_a;
  b->rotation += drot_b;

  joint->P = vec2_add(joint->P, delta_lambda);
}

void joint_init_mouse(joint_t *joint, body_t *body, vec2_t target) {
  joint->type = JOINT_MOUSE;
  joint->body_a = body;
  joint->body_b = NULL;
  joint->target = target;
  float mass = body->mass;
  joint->stiffness = 8000.0f + mass * 40.0f;
  joint->damping = 12.0f;
  joint->max_force = 60000.0f + mass * 500.0f;
  if (joint->max_force > 180000.0f)
    joint->max_force = 180000.0f;
  if (joint->stiffness <= 0.0f)
    joint->compliance = 1e20f;
  else
    joint->compliance = 1.0f / joint->stiffness;

  joint->P = vec2_new(0, 0); // Lambda

  mat22_t rot_t = mat22_transpose(mat22_new(body->rotation));
  joint->local_anchor_a =
      mat22_mul_vec2(rot_t, vec2_sub(target, body->position));

  body->in_joint = true;
}

void resolve_joint_spring(joint_t *joint, float dt) {
  body_t *a = joint->body_a;
  body_t *b = joint->body_b;
  if (!a || !b)
    return;

  mat22_t rot_a = mat22_new(a->rotation);
  mat22_t rot_b = mat22_new(b->rotation);
  vec2_t ra = mat22_mul_vec2(rot_a, joint->local_anchor_a);
  vec2_t rb = mat22_mul_vec2(rot_b, joint->local_anchor_b);

  vec2_t pa = vec2_add(a->position, ra);
  vec2_t pb = vec2_add(b->position, rb);

  vec2_t delta = vec2_sub(pb, pa);
  float dist = vec2_length(delta);
  if (dist < 1e-5f)
    return;

  float C = dist - joint->rest_length;
  vec2_t n = vec2_scale(delta, 1.0f / dist);

  float alpha = joint->compliance / (dt * dt + 1e-6f);

  float rn_a = vec2_cross(ra, n);
  float rn_b = vec2_cross(rb, n);

  float w = a->inverse_mass + b->inverse_mass +
            a->inverse_inertia * rn_a * rn_a + b->inverse_inertia * rn_b * rn_b;

  if (w == 0.0f)
    return;

  float lambda = joint->P.x;
  float dlambda = -(C + alpha * lambda) / (w + alpha);
  joint->P.x += dlambda;

  vec2_t P = vec2_scale(n, dlambda);

  // Corrections
  vec2_t dx_a = vec2_scale(P, -a->inverse_mass);
  float drot_a = -a->inverse_inertia * vec2_cross(ra, P);
  vec2_t dx_b = vec2_scale(P, b->inverse_mass);
  float drot_b = b->inverse_inertia * vec2_cross(rb, P);

  a->position = vec2_add(a->position, dx_a);
  a->rotation += drot_a;
  b->position = vec2_add(b->position, dx_b);
  b->rotation += drot_b;
}

void resolve_joint_mouse(joint_t *joint, float dt) {
  if (!joint->body_a)
    return;
  body_t *a = joint->body_a;
  vec2_t target = joint->target;

  mat22_t rot_a = mat22_new(a->rotation);
  vec2_t ra = mat22_mul_vec2(rot_a, joint->local_anchor_a);
  vec2_t pa = vec2_add(a->position, ra);

  vec2_t delta = vec2_sub(target, pa);
  float dist = vec2_length(delta);
  float C = dist;

  vec2_t n = vec2_new(1, 0);
  if (dist > 1e-5f)
    n = vec2_scale(delta, 1.0f / dist);

  float alpha = joint->compliance / (dt * dt + 1e-6f);
  float rn_a = vec2_cross(ra, n);
  float w = a->inverse_mass + a->inverse_inertia * rn_a * rn_a;

  if (w == 0.0f)
    return;

  float lambda = joint->P.x;
  float dlambda = -(C + alpha * lambda) / (w + alpha);

  float max_imp = joint->max_force * dt;
  if (dlambda > max_imp)
    dlambda = max_imp;
  if (dlambda < -max_imp)
    dlambda = -max_imp;

  joint->P.x += dlambda;
  vec2_t P = vec2_scale(n, dlambda);

  vec2_t dx_a = vec2_scale(P, -a->inverse_mass);
  float drot_a = -a->inverse_inertia * vec2_cross(ra, P);

  a->position = vec2_add(a->position, dx_a);
  a->rotation += drot_a;
}

void resolve_joints(array_t *joints, float dt) {
  for (size_t i = 0; i < joints->count; i++) {
    joint_t *j = *(joint_t **)array_get(joints, i); // Pointer!

    // Anti-sleep
    if (j->body_a) {
      j->body_a->asleep = false;
      j->body_a->sleep_time = 0;
    }
    if (j->body_b) {
      j->body_b->asleep = false;
      j->body_b->sleep_time = 0;
    }

    if (j->type == JOINT_REVOLUTE) {
      resolve_joint_revolute(j, dt);
    } else if (j->type == JOINT_SPRING) {
      resolve_joint_spring(j, dt);
    } else if (j->type == JOINT_MOUSE) {
      resolve_joint_mouse(j, dt);
    }
  }
}

void prepare_joints(array_t *joints, float dt) {
  (void)dt;
  (void)joints;
  // XPBD Warm Starting is incompatible with Velocity Impulses.
  // Disabled as per user request to avoid instability.
}
