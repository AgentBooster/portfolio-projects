#include "collision.h"
#include <math.h>
#include <stdlib.h>

// Helpers
// SAT Helper: Get Vertices of a Box
static void get_vertices(body_t *b, vec2_t v[4]) {
  mat22_t rot = mat22_new(b->rotation);
  float hw = b->width * 0.5f;
  float hh = b->height * 0.5f;

  v[0] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(-hw, -hh)));
  v[1] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(hw, -hh)));
  v[2] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(hw, hh)));
  v[3] = vec2_add(b->position, mat22_mul_vec2(rot, vec2_new(-hw, hh)));
}

// SAT Helper: Project vertices onto axis
static void project_vertices(vec2_t v[4], vec2_t axis, float *min, float *max) {
  *min = vec2_dot(v[0], axis);
  *max = *min;
  for (int i = 1; i < 4; i++) {
    float p = vec2_dot(v[i], axis);
    if (p < *min)
      *min = p;
    if (p > *max)
      *max = p;
  }
}

// Clip a segment to a line (n . x <= c). Returns number of points (0..2).
static int clip_segment(vec2_t in[2], vec2_t out[2], vec2_t n, float c) {
  int count = 0;
  float d1 = vec2_dot(n, in[0]) - c;
  float d2 = vec2_dot(n, in[1]) - c;

  if (d1 <= 0.0f)
    out[count++] = in[0];
  if (d2 <= 0.0f)
    out[count++] = in[1];

  if (d1 * d2 < 0.0f) {
    float t = d1 / (d1 - d2);
    vec2_t v = vec2_add(in[0], vec2_scale(vec2_sub(in[1], in[0]), t));
    out[count++] = v;
  }

  return count;
}

static bool intersect_polygon_polygon(body_t *a, body_t *b,
                                      collision_manifold_t *m) {
  vec2_t vA[4];
  vec2_t vB[4];
  get_vertices(a, vA);
  get_vertices(b, vB);

  vec2_t axes[4];
  // Normals of A
  mat22_t rotA = mat22_new(a->rotation);
  axes[0] = mat22_mul_vec2(rotA, vec2_new(1, 0));
  axes[1] = mat22_mul_vec2(rotA, vec2_new(0, 1));
  // Normals of B
  mat22_t rotB = mat22_new(b->rotation);
  axes[2] = mat22_mul_vec2(rotB, vec2_new(1, 0));
  axes[3] = mat22_mul_vec2(rotB, vec2_new(0, 1));

  float min_overlap = 1000000.0f;
  vec2_t smallest_axis;
  int smallest_axis_index = -1;

  for (int i = 0; i < 4; i++) {
    vec2_t axis = axes[i];
    float minA, maxA, minB, maxB;
    project_vertices(vA, axis, &minA, &maxA);
    project_vertices(vB, axis, &minB, &maxB);

    if (minA >= maxB || minB >= maxA) {
      return false; // Separating Axis Found
    }

    float overlap = fminf(maxA - minB, maxB - minA);
    if (overlap < min_overlap) {
      min_overlap = overlap;
      smallest_axis = axis;
      smallest_axis_index = i;
    }
  }

  // Ensure normal points from A to B
  vec2_t d = vec2_sub(b->position, a->position);
  if (vec2_dot(d, smallest_axis) < 0) {
    smallest_axis = vec2_scale(smallest_axis, -1.0f);
  }

  m->is_colliding = true;
  m->normal = smallest_axis;
  m->depth = min_overlap;

  // Build proper contact points using reference/incident faces + clipping.
  // Reference face is chosen from the axis of minimum penetration.
  bool reference_is_a = (smallest_axis_index < 2);
  vec2_t *vRef = reference_is_a ? vA : vB;
  vec2_t *vInc = reference_is_a ? vB : vA;
  vec2_t axisRefX = reference_is_a ? axes[0] : axes[2];
  vec2_t axisRefY = reference_is_a ? axes[1] : axes[3];
  vec2_t axisIncX = reference_is_a ? axes[2] : axes[0];
  vec2_t axisIncY = reference_is_a ? axes[3] : axes[1];

  // Reference normal should point from reference to incident
  vec2_t ref_normal = m->normal;
  if (!reference_is_a) {
    ref_normal = vec2_scale(ref_normal, -1.0f);
  }

  // Choose reference face (0: v0->v1, 1: v1->v2, 2: v2->v3, 3: v3->v0)
  float dot_ref_x = vec2_dot(ref_normal, axisRefX);
  float dot_ref_y = vec2_dot(ref_normal, axisRefY);
  int ref_face;
  if (fabsf(dot_ref_x) > fabsf(dot_ref_y)) {
    ref_face = (dot_ref_x > 0.0f) ? 1 : 3;
  } else {
    ref_face = (dot_ref_y > 0.0f) ? 2 : 0;
  }

  // Choose incident face: most opposite to reference normal
  float dot_inc_x = vec2_dot(ref_normal, axisIncX);
  float dot_inc_y = vec2_dot(ref_normal, axisIncY);
  int inc_face;
  if (fabsf(dot_inc_x) > fabsf(dot_inc_y)) {
    // If ref_normal aligns with +x, choose -x face (3), else +x face (1)
    inc_face = (dot_inc_x > 0.0f) ? 3 : 1;
  } else {
    // If ref_normal aligns with +y, choose -y face (0), else +y face (2)
    inc_face = (dot_inc_y > 0.0f) ? 0 : 2;
  }

  vec2_t ref_v1 = vRef[ref_face];
  vec2_t ref_v2 = vRef[(ref_face + 1) % 4];
  vec2_t inc_face_verts[2] = {vInc[inc_face], vInc[(inc_face + 1) % 4]};

  // Clip incident face to the side planes of the reference face
  vec2_t tangent = vec2_sub(ref_v2, ref_v1);
  vec2_normalize(&tangent);
  float ref_c = vec2_dot(ref_normal, ref_v1);
  float side_c1 = vec2_dot(tangent, ref_v1);
  float side_c2 = vec2_dot(tangent, ref_v2);

  vec2_t clip1[2];
  int clip_count = clip_segment(inc_face_verts, clip1, tangent, side_c2);
  if (clip_count < 2) {
    m->contact_count = 0;
    return true;
  }

  vec2_t clip2[2];
  clip_count = clip_segment(clip1, clip2, vec2_scale(tangent, -1.0f), -side_c1);

  int contact_count = 0;
  for (int i = 0; i < clip_count; i++) {
    float separation = vec2_dot(ref_normal, clip2[i]) - ref_c;
    if (separation <= 0.0f) {
      m->contacts[contact_count++].point = clip2[i];
    }
  }

  if (contact_count == 0) {
    // Fallback to face midpoint to avoid zero-contact instability
    m->contacts[0].point =
        vec2_scale(vec2_add(inc_face_verts[0], inc_face_verts[1]), 0.5f);
    contact_count = 1;
  }

  m->contact_count = contact_count;
  return true;
}

// Circle-Polygon SAT (Simplified)
static bool intersect_circle_polygon(body_t *circle, body_t *poly,
                                     collision_manifold_t *m) {
  vec2_t v[4];
  get_vertices(poly, v);

  vec2_t axes[5]; // 2 box axes + 1 circle axis
  mat22_t rot = mat22_new(poly->rotation);
  axes[0] = mat22_mul_vec2(rot, vec2_new(1, 0));
  axes[1] = mat22_mul_vec2(rot, vec2_new(0, 1));

  // Axis from center to closest vertex
  vec2_t closest = v[0];
  float min_dist = vec2_length_sq(vec2_sub(circle->position, v[0]));
  for (int i = 1; i < 4; i++) {
    float d = vec2_length_sq(vec2_sub(circle->position, v[i]));
    if (d < min_dist) {
      min_dist = d;
      closest = v[i];
    }
  }
  vec2_t axis_c = vec2_sub(circle->position, closest);
  vec2_normalize(&axis_c);
  axes[2] = axis_c;

  float min_overlap = 10000.0f;
  vec2_t smallest_axis;

  int axis_count = 3;
  if (vec2_length_sq(axis_c) == 0)
    axis_count = 2; // Center on vertex

  for (int i = 0; i < axis_count; i++) {
    vec2_t axis = axes[i];
    float minP, maxP;
    project_vertices(v, axis, &minP, &maxP);

    float minC = vec2_dot(circle->position, axis) - circle->radius;
    float maxC = vec2_dot(circle->position, axis) + circle->radius;

    if (minP >= maxC || minC >= maxP)
      return false;

    float overlap = fminf(maxP - minC, maxC - minP);
    if (overlap < min_overlap) {
      min_overlap = overlap;
      smallest_axis = axis;
    }
  }

  vec2_t d = vec2_sub(poly->position, circle->position);
  if (vec2_dot(d, smallest_axis) < 0) {
    smallest_axis = vec2_scale(smallest_axis, -1.0f);
  }

  m->is_colliding = true;
  m->normal = smallest_axis;
  m->depth = min_overlap;

  // Contact point on circle: center + (normal * radius)
  m->contact_count = 1;
  m->contacts[0].point =
      vec2_add(circle->position, vec2_scale(m->normal, circle->radius));

  return true;
}

bool collision_detect(body_t *a, body_t *b, collision_manifold_t *manifold) {
  if (a->shape_type == BODY_SHAPE_CIRCLE &&
      b->shape_type == BODY_SHAPE_CIRCLE) {
    float r = a->radius + b->radius;
    vec2_t diff = vec2_sub(b->position, a->position);
    float d2 = vec2_length_sq(diff);
    if (d2 > r * r)
      return false;
    float d = sqrtf(d2);
    manifold->is_colliding = true;
    manifold->depth = r - d;
    if (d > 0)
      manifold->normal = vec2_scale(diff, 1.0f / d);
    else
      manifold->normal = vec2_new(0, 1);
    manifold->contact_count = 1;
    // Single point: Middle of overlap? Or surface?
    // For simplicity: Point on A towards B
    manifold->contacts[0].point = vec2_add(
        a->position, vec2_scale(manifold->normal, a->radius)); // Approx
    return true;
  }
  if (a->shape_type == BODY_SHAPE_RECT && b->shape_type == BODY_SHAPE_RECT) {
    return intersect_polygon_polygon(a, b, manifold);
  }
  if (a->shape_type == BODY_SHAPE_CIRCLE && b->shape_type == BODY_SHAPE_RECT) {
    return intersect_circle_polygon(a, b, manifold);
  }
  if (a->shape_type == BODY_SHAPE_RECT && b->shape_type == BODY_SHAPE_CIRCLE) {
    bool result = intersect_circle_polygon(b, a, manifold);
    if (result)
      manifold->normal = vec2_scale(manifold->normal, -1.0f);
    return result;
  }
  return false;
}

// 1. Velocity Solver (Iterative - Sequential Impulses)
void resolve_velocity(contact_t *c) {
  body_t *a = c->a;
  body_t *b = c->b;
  float inv_mass_sum = a->inverse_mass + b->inverse_mass;
  if (inv_mass_sum == 0.0f)
    return;

  int contact_count = c->contact_count;
  if (contact_count <= 0)
    return;
  float contact_scale = 1.0f / (float)contact_count;

  // For each contact point (usually 1 or 2)
  for (int i = 0; i < contact_count; i++) {
    vec2_t normal = c->normal;
    vec2_t point = c->contacts[i].point;

    // r = point - com
    vec2_t ra = vec2_sub(point, a->position);
    vec2_t rb = vec2_sub(point, b->position);

    // Relative Velocity at Contact Point
    // v_rel = (vb + cross(wb, rb)) - (va + cross(wa, ra))
    vec2_t rva = vec2_add(a->velocity, vec2_new(-a->angular_velocity * ra.y,
                                                a->angular_velocity * ra.x));
    vec2_t rvb = vec2_add(b->velocity, vec2_new(-b->angular_velocity * rb.y,
                                                b->angular_velocity * rb.x));
    vec2_t rel_vel = vec2_sub(rvb, rva);

    float vel_along_normal = vec2_dot(rel_vel, normal);

    // Do not resolve if moving away
    if (vel_along_normal > 0)
      continue;

    // Rotational Impulse Denominator
    float ra_cross_n = vec2_cross(ra, normal);
    float rb_cross_n = vec2_cross(rb, normal);
    float inv_mass_effective = inv_mass_sum +
                               (ra_cross_n * ra_cross_n) * a->inverse_inertia +
                               (rb_cross_n * rb_cross_n) * b->inverse_inertia;

    // Elasticity (Restitution)
    float e = fminf(a->restitution, b->restitution);
    if (vel_along_normal > -2.0f) { // Dampen very small bounces
      e = 0.0f;
    }

    // Impulse Magnitude
    float j = -(1 + e) * vel_along_normal;
    j /= inv_mass_effective;
    j *= contact_scale;

    vec2_t impulse = vec2_scale(normal, j);

    // Apply Linear
    a->velocity = vec2_add(a->velocity, vec2_scale(impulse, -a->inverse_mass));
    b->velocity = vec2_add(b->velocity, vec2_scale(impulse, b->inverse_mass));

    // Apply Angular: w += (r x J) * inv_I
    a->angular_velocity += -vec2_cross(ra, impulse) * a->inverse_inertia;
    b->angular_velocity += vec2_cross(rb, impulse) * b->inverse_inertia;

    // --- Friction ---
    // Re-calculate relative velocity (essential for stability)
    rva = vec2_add(a->velocity, vec2_new(-a->angular_velocity * ra.y,
                                         a->angular_velocity * ra.x));
    rvb = vec2_add(b->velocity, vec2_new(-b->angular_velocity * rb.y,
                                         b->angular_velocity * rb.x));
    rel_vel = vec2_sub(rvb, rva);

    vec2_t tangent =
        vec2_sub(rel_vel, vec2_scale(normal, vec2_dot(rel_vel, normal)));

    // Safe Normalization to prevent Ghost Friction
    if (vec2_length_sq(tangent) < 0.0001f)
      continue;

    vec2_normalize(&tangent);

    float jt = -vec2_dot(rel_vel, tangent);

    // Friction Denominator
    float ra_cross_t = vec2_cross(ra, tangent);
    float rb_cross_t = vec2_cross(rb, tangent);
    float inv_mass_tan = inv_mass_sum +
                         (ra_cross_t * ra_cross_t) * a->inverse_inertia +
                         (rb_cross_t * rb_cross_t) * b->inverse_inertia;

    jt /= inv_mass_tan;

    if (fabsf(jt) < 0.0001f)
      continue;

    // Coulomb's Law
    float mu = (a->static_friction + b->static_friction) * 0.5f;
    vec2_t friction_impulse;
    if (fabsf(jt) < j * mu) { // Static
      friction_impulse = vec2_scale(tangent, jt);
    } else { // Dynamic
      mu = (a->dynamic_friction + b->dynamic_friction) * 0.5f;
      friction_impulse = vec2_scale(tangent, -fabsf(j) * mu); // Oppose
    }

    a->velocity =
        vec2_add(a->velocity, vec2_scale(friction_impulse, -a->inverse_mass));
    b->velocity =
        vec2_add(b->velocity, vec2_scale(friction_impulse, b->inverse_mass));

    a->angular_velocity +=
        -vec2_cross(ra, friction_impulse) * a->inverse_inertia;
    b->angular_velocity +=
        vec2_cross(rb, friction_impulse) * b->inverse_inertia;
  }
}

// 2. Position Solver (Anti-Sinking)
void resolve_position(contact_t *c) {
  body_t *a = c->a;
  body_t *b = c->b;
  float inv_mass_sum = a->inverse_mass + b->inverse_mass;
  if (inv_mass_sum == 0.0f)
    return;

  // Constants
  const float PERCENT = 0.2f; // Reduced from 0.8 to prevent jitter in stacks
  const float SLOP = 0.01f;

  float correction_mag =
      (fmaxf(c->depth - SLOP, 0.0f) / inv_mass_sum) * PERCENT;
  vec2_t correction = vec2_scale(c->normal, correction_mag);

  a->position = vec2_add(a->position, vec2_scale(correction, -a->inverse_mass));
  b->position = vec2_add(b->position, vec2_scale(correction, b->inverse_mass));
}
