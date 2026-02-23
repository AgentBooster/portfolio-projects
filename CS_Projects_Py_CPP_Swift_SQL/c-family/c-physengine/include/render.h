#ifndef RENDER_H
#define RENDER_H

#include "vec2.h"
#include <stdbool.h>
#include <stdint.h>

bool render_init(const char *title, int width, int height);
void render_cleanup(void);

void render_clear(uint32_t color);
void render_present(void);

void render_circle(vec2_t pos, float radius, uint32_t color);
void render_rect(vec2_t pos, float width, float height, uint32_t color);
void render_fill_rect(vec2_t pos, float width, float height, uint32_t color);
void render_rect_rotated(vec2_t pos, float width, float height, float rotation,
                         uint32_t color);
void render_circle_rotated(vec2_t pos, float radius, float rotation,
                           uint32_t color);

// Debug Primitives
void render_line(vec2_t start, vec2_t end, uint32_t color);
void render_rect_wireframe(vec2_t pos, float width, float height,
                           uint32_t color);

#endif
