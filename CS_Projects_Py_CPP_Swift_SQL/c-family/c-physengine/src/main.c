#include "body.h"
#include "collision.h"
#include "render.h"
#include "vec2.h"
#include "world.h"
#include <SDL.h>
#include <stdbool.h>
#include <stdio.h>

#define SCREEN_WIDTH 800
#define SCREEN_HEIGHT 600
// Target 60 FPS -> ~16.6ms per frame
#define TIME_STEP (1.0f / 60.0f)
#define MOUSE_THROW_SCALE 1.1f
#define MOUSE_THROW_MAX_SPEED 1200.0f

int main(int argc, char *argv[]) {
  (void)argc;
  (void)argv;

  // 1. Initialize Graphics
  if (!render_init("C-PhysEngine", SCREEN_WIDTH, SCREEN_HEIGHT)) {
    return 1;
  }

  // 2. Initialize Physics World
  world_t world;
  vec2_t gravity = {.x = 0.0f, .y = 9.8f * 50}; // Scaled gravity for pixels
  world_init(&world, gravity);

  // 3. Create some demo bodies

  // STATIC FLOOR
  body_t *floor = world_create_body(&world);
  if (floor) {
    body_init_rect(floor, vec2_new(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 50), 0.0f,
                   SCREEN_WIDTH - 100, 40.0f, 0x00FF00FF); // Mass 0 = Static
    floor->restitution = 0.6f;
  }

  // STACK OF BOXES (Normal friction, low bounce)
  for (int i = 0; i < 3; i++) {
    body_t *box = world_create_body(&world);
    if (box) {
      body_init_rect(box, vec2_new(SCREEN_WIDTH / 2 + 5, 400 - i * 50), 20.0f,
                     40.0f, 40.0f, 0xFF00FFFF);
      box->restitution = 0.0f;     // No bounce for stability
      box->static_friction = 0.8f; // High friction to stop drift
      box->dynamic_friction = 0.5f;
    }
  }

  // BOUNCY BALL (High restitution)
  body_t *bouncy = world_create_body(&world);
  if (bouncy) {
    body_init_circle(bouncy, vec2_new(150, 100), 5.0f, 20.0f,
                     0xFFA500FF); // Orange
    bouncy->restitution = 0.9f;
    bouncy->static_friction = 0.3f;
  }

  // CHAIN DEMO (Revolute Joints)
  // Static anchor
  body_t *anchor = world_create_body(&world);
  body_init_circle(anchor, vec2_new(100, 100), 0.0f, 10.0f,
                   0xFFFFFFFF); // Static

  // Let's overwrite with Vertical Chain
  body_t *chain_anchor = world_create_body(&world);
  body_init_circle(chain_anchor, vec2_new(300, 100), 0.0f, 10.0f,
                   0xFFFFFFFF); // White Anchor

  body_t *prev = chain_anchor;
  for (int i = 0; i < 5; i++) {
    body_t *link = world_create_body(&world);
    // ALIGNMENT FIX (User reported overlap):
    // Height = 30.0f. Width = 20.0f.
    // To avoid overlap, stride must be > 30. Let's use 35 (5px gap).
    // Link 0 Y: Anchor(100) + Radius(10) + Gap(5) + HalfHeight(15) = 130.
    // Stride = 35.
    float link_y = 130.0f + i * 35.0f;

    body_init_rect(link, vec2_new(300, link_y), 5.0f, 20.0f, 30.0f,
                   0x00FF00FF); // Green Chain

    joint_t *j = world_create_joint(&world);

    // Pivot Calculation:
    // Pivot should be in the gap between Prev and Link.
    // RadiusAnchor=10. HalfHeight=15. Gap=5.
    // Dist Center-to-Center = 10 + 5 + 15 = 30? No, Anchor Y=100. Link Y=130.
    // Dist=30. Pivot at Anchor Y + 10 (Edge) + 2.5 (Half Gap) = 112.5.
    //
    // For Link-to-Link:
    // Prev Y = 130. Next Y = 165. Dist = 35.
    // Upper Edge = 130 + 15 = 145.
    // Lower Edge = 165 - 15 = 150.
    // Gap = 145..150 (5px).
    // Pivot = 147.5.
    //
    // General Formula:
    // If i==0 (Anchor->Link): Pivot = 100 + 10 + 2.5 = 112.5.
    // If i>0 (Link->Link): PrevY + 15 + 2.5 = (130 + (i-1)*35) + 17.5.

    float pivot_y;
    if (i == 0) {
      pivot_y = 112.5f;
    } else {
      // Prev link center Y
      float prev_link_y = 130.0f + (i - 1) * 35.0f;
      pivot_y = prev_link_y + 15.0f + 2.5f;
    }

    vec2_t pivot = vec2_new(300, pivot_y);
    joint_init_revolute(j, prev, link, pivot);
    prev = link;
  }

  // HEAVY ROCK
  body_t *rock = world_create_body(&world);

  if (rock) {
    body_init_circle(rock, vec2_new(500, 100), 50.0f, 25.0f,
                     0x808080FF); // Grey
    rock->restitution = 0.5f;
    rock->static_friction = 0.9f;
    rock->dynamic_friction = 0.7f;
  }

  // 4. Game Loop
  bool running = true;
  SDL_Event event;

  // Time keeping
  uint32_t last_time = SDL_GetTicks();
  float accumulator = 0.0f;
  bool debug_mode = false;
  bool debug_key_pressed = false;

  joint_t *mouse_joint = NULL;
  vec2_t mouse_vel = vec2_new(0, 0);
  vec2_t last_mouse_pos = vec2_new(0, 0);
  uint32_t last_mouse_time = SDL_GetTicks();

  while (running) {
    // A. Input Handling
    while (SDL_PollEvent(&event)) {
      if (event.type == SDL_QUIT) {
        running = false;
      }
      if (event.type == SDL_KEYDOWN) {
        if (event.key.keysym.sym == SDLK_ESCAPE)
          running = false;
        if (event.key.keysym.sym == SDLK_d) { // 'd' for Debug
          if (!debug_key_pressed) {
            debug_mode = !debug_mode;
            debug_key_pressed = true;
            printf("Debug Mode: %s\n", debug_mode ? "ON" : "OFF");
          }
        }
      }
      if (event.type == SDL_KEYUP) {
        if (event.key.keysym.sym == SDLK_d)
          debug_key_pressed = false;
      }
      // Mouse Interaction
      if (event.type == SDL_MOUSEBUTTONDOWN) {
        int x, y;
        SDL_GetMouseState(&x, &y);
        vec2_t pos = vec2_new((float)x, (float)y);

        if (event.button.button == SDL_BUTTON_LEFT) {
          // 1. Try to grab a body
          body_t *clicked_body = NULL;
          for (size_t i = 0; i < world.bodies->count; i++) {
            body_t *b = *(body_t **)array_get(world.bodies, i); // Pointer
            if (b->inverse_mass == 0.0f)
              continue;
            // Point vs Body Test
            if (b->shape_type == BODY_SHAPE_CIRCLE) {
              if (vec2_dist_sq(pos, b->position) < b->radius * b->radius) {
                clicked_body = b;
                break;
              }
            } else {
              // Box: Transform point to local
              vec2_t local =
                  mat22_mul_vec2(mat22_transpose(mat22_new(b->rotation)),
                                 vec2_sub(pos, b->position));
              if (fabsf(local.x) < b->width * 0.5f &&
                  fabsf(local.y) < b->height * 0.5f) {
                clicked_body = b;
                break;
              }
            }
          }

          if (clicked_body) {
            if (!mouse_joint) {
              mouse_joint = world_create_joint(&world);
              joint_init_mouse(mouse_joint, clicked_body, pos);
              last_mouse_pos = pos;
              last_mouse_time = SDL_GetTicks();
              mouse_vel = vec2_new(0, 0);
            }
          } else {
            // 2. Spawn Box if no body clicked
            body_t *new_body = world_create_body(&world);
            if (new_body) {
              float w = 30.0f + (rand() % 40);
              float h = 30.0f + (rand() % 40);
              uint32_t color = (rand() % 0xFFFFFF00) | 0xFF;
              body_init_rect(new_body, pos, w * h * 0.05f, w, h, color);
              new_body->restitution = 0.3f;
              new_body->static_friction = 0.5f;
              new_body->dynamic_friction = 0.3f;
            }
          }
        } else if (event.button.button == SDL_BUTTON_RIGHT) {
          // Spawn Ball
          body_t *new_body = world_create_body(&world);
          if (new_body) {
            float r = 10.0f + (rand() % 30);
            uint32_t color = (rand() % 0xFFFFFF00) | 0xFF;
            body_init_circle(new_body, pos, r * r * 0.1f, r, color);
            new_body->restitution = 0.8f;
            new_body->static_friction = 0.3f;
            new_body->dynamic_friction = 0.1f;
          }
        }
      }

      if (event.type == SDL_MOUSEMOTION) {
        if (mouse_joint) {
          int x, y;
          SDL_GetMouseState(&x, &y);
          vec2_t pos = vec2_new((float)x, (float)y);
          mouse_joint->target = pos;
          uint32_t now = SDL_GetTicks();
          float dt = (now - last_mouse_time) / 1000.0f;
          if (dt > 0.0001f) {
            vec2_t vel = vec2_scale(vec2_sub(pos, last_mouse_pos), 1.0f / dt);
            mouse_vel =
                vec2_add(vec2_scale(mouse_vel, 0.6f), vec2_scale(vel, 0.4f));
          }
          last_mouse_pos = pos;
          last_mouse_time = now;
          // Wake up body
          if (mouse_joint->body_a) {
            mouse_joint->body_a->asleep = false;
            mouse_joint->body_a->sleep_time = 0;
          }
        }
      }

      if (event.type == SDL_MOUSEBUTTONUP) {
        if (event.button.button == SDL_BUTTON_LEFT && mouse_joint) {
          if (mouse_joint->body_a) {
            vec2_t v = vec2_scale(mouse_vel, MOUSE_THROW_SCALE);
            float speed = vec2_length(v);
            if (speed > MOUSE_THROW_MAX_SPEED) {
              v = vec2_scale(v, MOUSE_THROW_MAX_SPEED / speed);
            }
            mouse_joint->body_a->velocity = v;
          }
          world_destroy_joint(&world, mouse_joint);
          mouse_joint = NULL;
        }
      }
    }

    // B. Update Physics (Fixed Time Step)
    uint32_t current_time = SDL_GetTicks();
    float frame_time = (current_time - last_time) / 1000.0f;
    if (frame_time > 0.25f)
      frame_time = 0.25f; // Cap incase of lag

    last_time = current_time;
    accumulator += frame_time;

    while (accumulator >= TIME_STEP) {
      world_update(&world, TIME_STEP);
      accumulator -= TIME_STEP;
    }

    // C. Render
    render_clear(0x111111FF); // Dark background

    for (size_t i = 0; i < world.bodies->count; i++) {
      body_t *body = *(body_t **)array_get(world.bodies, i); // Pointer

      // Just reset if far below screen (unless part of a chain/joint)
      // Simple heuristic: don't reset if mass is small 5.0f (chain links)
      if (body->mass > 5.1f && body->position.y > SCREEN_HEIGHT + 200) {
        body->position.y = -50;
        body->position.x = (float)(rand() % SCREEN_WIDTH);
        body->velocity = vec2_new(0, 0);
      }

      if (body->shape_type == BODY_SHAPE_CIRCLE) {
        render_circle_rotated(body->position, body->radius, body->rotation,
                              body->color);
        if (debug_mode) {
          // AABB approximation visualization
        }
      } else {
        // Draw rotated rect (Wireframe for now)
        render_rect_rotated(body->position, body->width, body->height,
                            body->rotation, body->color);
      }
    }

    // Render Joints
    for (size_t i = 0; i < world.joints->count; i++) {
      joint_t *j = *(joint_t **)array_get(world.joints, i); // Pointer

      vec2_t p1 = vec2_new(0, 0);
      vec2_t p2 = vec2_new(0, 0);
      bool draw = false;
      uint32_t color = 0xFFFFFFFF;

      if (j->type == JOINT_REVOLUTE || j->type == JOINT_SPRING) {
        if (!j->body_a || !j->body_b)
          continue;
        p1 = vec2_add(
            j->body_a->position,
            mat22_mul_vec2(mat22_new(j->body_a->rotation), j->local_anchor_a));
        p2 = vec2_add(
            j->body_b->position,
            mat22_mul_vec2(mat22_new(j->body_b->rotation), j->local_anchor_b));
        draw = true;

        if (j->type == JOINT_SPRING)
          color = 0x00FF00FF; // Green Springs
        else
          color = 0xFFFFFFFF; // White Revolute

      } else if (j->type == JOINT_MOUSE) {
        if (!j->body_a)
          continue;
        p1 = vec2_add(
            j->body_a->position,
            mat22_mul_vec2(mat22_new(j->body_a->rotation), j->local_anchor_a));
        p2 = j->target;
        draw = true;
        color = 0x00BFFFFF; // Cyan Mouse
      }

      if (draw && vec2_dist_sq(p1, p2) > 1.0f) {
        render_line(p1, p2, color);
      }
    }

    // DEBUG DRAW: Re-run collision checks
    if (debug_mode) {
      for (size_t i = 0; i < world.bodies->count; i++) {
        for (size_t j = i + 1; j < world.bodies->count; j++) {
          body_t *a = *(body_t **)array_get(world.bodies, i);
          body_t *b = *(body_t **)array_get(world.bodies, j);

          collision_manifold_t m;
          if (collision_detect(a, b, &m)) {
            // Draw Normal (Yellow) at first contact point or center
            vec2_t draw_pos = a->position;
            if (m.contact_count > 0)
              draw_pos = m.contacts[0].point;

            vec2_t end = vec2_add(draw_pos, vec2_scale(m.normal, 30.0f));
            render_line(draw_pos, end, 0xFFFF00FF);

            // Draw Contact Points (Red Boxes)
            for (int k = 0; k < m.contact_count; k++) {
              render_rect(m.contacts[k].point, 4, 4, 0xFF0000FF);
            }
          }
        }
      }
    }

    render_present();
  }

  world_destroy(&world);
  render_cleanup();
  return 0;
}
