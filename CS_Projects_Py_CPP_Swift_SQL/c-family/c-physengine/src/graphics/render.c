#include "render.h"
#include <SDL.h>
#include <math.h>
#include <stdio.h>

static SDL_Window *window = NULL;
static SDL_Renderer *renderer = NULL;
static int screen_width = 0;
static int screen_height = 0;

bool render_init(const char *title, int width, int height) {
  if (SDL_Init(SDL_INIT_VIDEO) != 0) {
    fprintf(stderr, "Error initializing SDL: %s\n", SDL_GetError());
    return false;
  }

  window = SDL_CreateWindow(title, SDL_WINDOWPOS_CENTERED,
                            SDL_WINDOWPOS_CENTERED, width, height,
                            0); // SDL_WINDOW_SHOWN is default
  if (!window) {
    fprintf(stderr, "Error creating window: %s\n", SDL_GetError());
    return false;
  }

  // Use hardware acceleration and VSync
  renderer = SDL_CreateRenderer(
      window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
  if (!renderer) {
    fprintf(stderr, "Error creating renderer: %s\n", SDL_GetError());
    return false;
  }

  screen_width = width;
  screen_height = height;
  return true;
}

void render_cleanup(void) {
  if (renderer)
    SDL_DestroyRenderer(renderer);
  if (window)
    SDL_DestroyWindow(window);
  SDL_Quit();
}

void render_clear(uint32_t color) {
  SDL_SetRenderDrawColor(renderer, (color >> 24) & 0xFF, (color >> 16) & 0xFF,
                         (color >> 8) & 0xFF, color & 0xFF);
  SDL_RenderClear(renderer);
}

void render_present(void) { SDL_RenderPresent(renderer); }

// Simple Midpoint Circle Algorithm implementation or similar visualization
void render_circle(vec2_t pos, float radius, uint32_t color) {
  SDL_SetRenderDrawColor(renderer, (color >> 24) & 0xFF, (color >> 16) & 0xFF,
                         (color >> 8) & 0xFF, color & 0xFF);

  // Very naive circle drawing for now (SDL doesn't have default circle)
  // We will draw it as a series of points or lines for efficiency in debug
  // For a solid engine, we might want a texture or a better algorithm.
  // Using a simple approximation: 32 segments
  const int segments = 32;
  float angle_step = 2.0f * M_PI / segments;

  for (int i = 0; i < segments; i++) {
    float angle1 = i * angle_step;
    float angle2 = (i + 1) * angle_step;

    int x1 = (int)(pos.x + cosf(angle1) * radius);
    int y1 = (int)(pos.y + sinf(angle1) * radius);
    int x2 = (int)(pos.x + cosf(angle2) * radius);
    int y2 = (int)(pos.y + sinf(angle2) * radius);

    SDL_RenderDrawLine(renderer, x1, y1, x2, y2);
  }
}

void render_rect(vec2_t pos, float width, float height, uint32_t color) {
  SDL_SetRenderDrawColor(renderer, (color >> 24) & 0xFF, (color >> 16) & 0xFF,
                         (color >> 8) & 0xFF, color & 0xFF);

  SDL_Rect rect = {.x = (int)(pos.x - width * 0.5f), // Center origin
                   .y = (int)(pos.y - height * 0.5f),
                   .w = (int)width,
                   .h = (int)height};
  SDL_RenderDrawRect(renderer, &rect);
}

void render_fill_rect(vec2_t pos, float width, float height, uint32_t color) {
  SDL_SetRenderDrawColor(renderer, (color >> 24) & 0xFF, (color >> 16) & 0xFF,
                         (color >> 8) & 0xFF, color & 0xFF);

  SDL_Rect rect = {.x = (int)(pos.x - width * 0.5f), // Center origin
                   .y = (int)(pos.y - height * 0.5f),
                   .w = (int)width,
                   .h = (int)height};
  SDL_RenderFillRect(renderer, &rect);
}

void render_line(vec2_t start, vec2_t end, uint32_t color) {
  SDL_SetRenderDrawColor(renderer, (color >> 24) & 0xFF, (color >> 16) & 0xFF,
                         (color >> 8) & 0xFF, color & 0xFF);
  SDL_RenderDrawLine(renderer, (int)start.x, (int)start.y, (int)end.x,
                     (int)end.y);
}

void render_rect_rotated(vec2_t pos, float width, float height, float rotation,
                         uint32_t color) {
  float c = cosf(rotation);
  float s = sinf(rotation);
  float hw = width * 0.5f;
  float hh = height * 0.5f;

  // Local corners: (-hw, -hh), (hw, -hh), (hw, hh), (-hw, hh)
  vec2_t v[4];
  v[0] = vec2_new(pos.x + (c * -hw - s * -hh), pos.y + (s * -hw + c * -hh));
  v[1] = vec2_new(pos.x + (c * hw - s * -hh), pos.y + (s * hw + c * -hh));
  v[2] = vec2_new(pos.x + (c * hw - s * hh), pos.y + (s * hw + c * hh));
  v[3] = vec2_new(pos.x + (c * -hw - s * hh), pos.y + (s * -hw + c * hh));

  // Use SDL_RenderGeometry for filled rotated quad
  SDL_Vertex vertices[4];
  SDL_Color sdl_col = {(color >> 24) & 0xFF, (color >> 16) & 0xFF,
                       (color >> 8) & 0xFF, color & 0xFF};

  for (int i = 0; i < 4; i++) {
    vertices[i].position.x = v[i].x;
    vertices[i].position.y = v[i].y;
    vertices[i].color = sdl_col;
    vertices[i].tex_coord.x = 0;
    vertices[i].tex_coord.y = 0;
  }

  int indices[6] = {0, 1, 2, 2, 3, 0};
  SDL_RenderGeometry(renderer, NULL, vertices, 4, indices, 6);

  // Outline hint (Black)
  SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
  SDL_RenderDrawLine(renderer, (int)v[0].x, (int)v[0].y, (int)v[1].x,
                     (int)v[1].y);
  SDL_RenderDrawLine(renderer, (int)v[1].x, (int)v[1].y, (int)v[2].x,
                     (int)v[2].y);
  SDL_RenderDrawLine(renderer, (int)v[2].x, (int)v[2].y, (int)v[3].x,
                     (int)v[3].y);
  SDL_RenderDrawLine(renderer, (int)v[3].x, (int)v[3].y, (int)v[0].x,
                     (int)v[0].y);
}

void render_circle_rotated(vec2_t pos, float radius, float rotation,
                           uint32_t color) {
  // Use SDL_RenderGeometry for filled circle (Triangle Fan)
  const int segments = 32;
  SDL_Vertex vertices[33]; // Center + 32 points
  SDL_Color sdl_col = {(color >> 24) & 0xFF, (color >> 16) & 0xFF,
                       (color >> 8) & 0xFF, color & 0xFF};

  // Center vertex
  vertices[0].position.x = pos.x;
  vertices[0].position.y = pos.y;
  vertices[0].color = sdl_col;
  vertices[0].tex_coord.x = 0;
  vertices[0].tex_coord.y = 0;

  float angle_step = 2.0f * M_PI / segments;
  for (int i = 0; i < segments; i++) {
    float angle = i * angle_step;
    vertices[i + 1].position.x = pos.x + cosf(angle) * radius;
    vertices[i + 1].position.y = pos.y + sinf(angle) * radius;
    vertices[i + 1].color = sdl_col;
    vertices[i + 1].tex_coord.x = 0;
    vertices[i + 1].tex_coord.y = 0;
  }

  // Indices: Each slice is (Center, i, i+1)
  int indices[32 * 3];
  for (int i = 0; i < segments; i++) {
    indices[i * 3] = 0;                          // Center
    indices[i * 3 + 1] = i + 1;                  // Current point
    indices[i * 3 + 2] = (i + 1) % segments + 1; // Next point (wrap around)
    // Special wrap for last segment: point 32 connects to point 1
    if (i == segments - 1)
      indices[i * 3 + 2] = 1;
  }

  SDL_RenderGeometry(renderer, NULL, vertices, segments + 1, indices,
                     segments * 3);

  // Orientation line (Black)
  float c = cosf(rotation);
  float s = sinf(rotation);
  vec2_t end = vec2_new(pos.x + c * radius, pos.y + s * radius);

  SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
  SDL_RenderDrawLine(renderer, (int)pos.x, (int)pos.y, (int)end.x, (int)end.y);

  // Outline (Black)
  for (int i = 0; i < segments; i++) {
    int next = (i + 1) % segments;
    SDL_RenderDrawLine(renderer, (int)vertices[i + 1].position.x,
                       (int)vertices[i + 1].position.y,
                       (int)vertices[next + 1].position.x,
                       (int)vertices[next + 1].position.y);
  }
}

void render_rect_wireframe(vec2_t pos, float width, float height,
                           uint32_t color) {
  SDL_SetRenderDrawColor(renderer, (color >> 24) & 0xFF, (color >> 16) & 0xFF,
                         (color >> 8) & 0xFF, color & 0xFF);
  SDL_Rect rect = {.x = (int)(pos.x - width * 0.5f), // Center origin
                   .y = (int)(pos.y - height * 0.5f),
                   .w = (int)width,
                   .h = (int)height};
  SDL_RenderDrawRect(renderer, &rect);
}
