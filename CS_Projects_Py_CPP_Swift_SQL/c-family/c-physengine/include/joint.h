#ifndef JOINT_H
#define JOINT_H

#include "body.h"
#include "utils/array.h"
#include "vec2.h"

typedef enum {
  JOINT_REVOLUTE,
  JOINT_SPRING,
  JOINT_MOUSE // Added for later
} joint_type_t;

typedef struct {
  joint_type_t type;
  body_t *body_a;
  body_t *body_b;

  // Anchor points in local space (relative to body center)
  vec2_t local_anchor_a;
  vec2_t local_anchor_b;

  // Spring Parameters
  float rest_length;
  float stiffness;
  float damping;

  // Solver Cache (Warm Starting)
  vec2_t P;             // Accumulated impulse
  float bias;           // For Baumgarte (position correction)
  float effective_mass; // K_inv
  float compliance;     // XPBD compliance (0 = rigid)

  // Soft Constraint params (Gamma/Beta) could go here too

  // Mouse Joint
  vec2_t target;
  float max_force;
} joint_t;

// Factory methods
void joint_init_revolute(joint_t *joint, body_t *a, body_t *b, vec2_t anchor);
void joint_init_spring(joint_t *joint, body_t *a, body_t *b, float length,
                       float stiffness, float damping);
void joint_init_mouse(joint_t *joint, body_t *body, vec2_t target);
void resolve_joints(array_t *joints, float dt);
void prepare_joints(array_t *joints, float dt);

#endif
