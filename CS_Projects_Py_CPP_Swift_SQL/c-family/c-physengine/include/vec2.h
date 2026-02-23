#ifndef VEC2_H
#define VEC2_H

typedef struct {
  float x;
  float y;
} vec2_t;

vec2_t vec2_new(float x, float y);
vec2_t vec2_add(vec2_t a, vec2_t b);
vec2_t vec2_sub(vec2_t a, vec2_t b);
vec2_t vec2_scale(vec2_t v, float factor);
float vec2_dot(vec2_t a, vec2_t b);
float vec2_length_sq(vec2_t v);
float vec2_length(vec2_t v);
float vec2_dist_sq(vec2_t a, vec2_t b);
void vec2_normalize(vec2_t *v);

// Cross Product (2D) - Returns scalar magnitude of Z component
float vec2_cross(vec2_t a, vec2_t b);

// 2x2 Matrix for Rotation
typedef struct {
  float m00, m01;
  float m10, m11;
} mat22_t;

mat22_t mat22_new(float angle_rad);
vec2_t mat22_mul_vec2(mat22_t m, vec2_t v);
mat22_t mat22_transpose(mat22_t m);

#endif
