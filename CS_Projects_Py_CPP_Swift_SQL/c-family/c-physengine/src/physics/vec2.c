#include "vec2.h"
#include <math.h>

vec2_t vec2_new(float x, float y) {
  vec2_t result = {.x = x, .y = y};
  return result;
}

vec2_t vec2_add(vec2_t a, vec2_t b) {
  vec2_t result = {.x = a.x + b.x, .y = a.y + b.y};
  return result;
}

vec2_t vec2_sub(vec2_t a, vec2_t b) {
  vec2_t result = {.x = a.x - b.x, .y = a.y - b.y};
  return result;
}

vec2_t vec2_scale(vec2_t v, float factor) {
  vec2_t result = {.x = v.x * factor, .y = v.y * factor};
  return result;
}

float vec2_dot(vec2_t a, vec2_t b) { return (a.x * b.x) + (a.y * b.y); }

float vec2_length_sq(vec2_t v) { return (v.x * v.x) + (v.y * v.y); }

float vec2_length(vec2_t v) { return sqrtf(vec2_length_sq(v)); }

float vec2_dist_sq(vec2_t a, vec2_t b) {
  float dx = a.x - b.x;
  float dy = a.y - b.y;
  return dx * dx + dy * dy;
}

void vec2_normalize(vec2_t *v) {
  float len = vec2_length(*v);
  if (len > 0) {
    v->x /= len;
    v->y /= len;
  }
}

float vec2_cross(vec2_t a, vec2_t b) { return a.x * b.y - a.y * b.x; }

mat22_t mat22_new(float angle_rad) {
  float c = cosf(angle_rad);
  float s = sinf(angle_rad);
  // [ c -s ]
  // [ s  c ]
  mat22_t m = {.m00 = c, .m01 = -s, .m10 = s, .m11 = c};
  return m;
}

vec2_t mat22_mul_vec2(mat22_t m, vec2_t v) {
  // x' = m00*x + m01*y
  // y' = m10*x + m11*y
  return vec2_new(m.m00 * v.x + m.m01 * v.y, m.m10 * v.x + m.m11 * v.y);
}

mat22_t mat22_transpose(mat22_t m) {
  mat22_t t = {.m00 = m.m00, .m01 = m.m10, .m10 = m.m01, .m11 = m.m11};
  return t;
}
