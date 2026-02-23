CC = clang
CFLAGS = -Wall -Wextra -Werror -std=c99 -I./include -I./include/utils
LDFLAGS = $(shell pkg-config --libs sdl2)
CFLAGS += $(shell pkg-config --cflags sdl2)

SRC_DIR = src
BUILD_DIR = build
BIN = phys_engine

# Find all .c files recursively in src/
SRCS = $(shell find $(SRC_DIR) -name '*.c')
# Map src/%.c to build/%.o
OBJS = \
	build/main.o \
	build/physics/world.o \
	build/physics/broadphase.o \
	build/physics/joint.o \
	build/physics/vec2.o \
	build/physics/collision.o \
	build/physics/body.o \
	build/graphics/render.o \
	build/utils/array.o

all: $(BIN)

$(BIN): $(OBJS)
	@mkdir -p $(dir $@)
	$(CC) $(OBJS) -o $@ $(LDFLAGS)
	@echo "Build successful: ./"$@

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(BUILD_DIR) $(BIN)

run: all
	./$(BIN)

.PHONY: all clean run
