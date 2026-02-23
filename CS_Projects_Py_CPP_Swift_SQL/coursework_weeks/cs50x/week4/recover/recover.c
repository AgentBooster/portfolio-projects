#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

typedef uint8_t BYTE;
const int BLOCK_SIZE = 512;

int main(int argc, char *argv[]) {
  // Check usage
  if (argc != 2) {
    printf("Usage: ./recover IMAGE\n");
    return 1;
  }

  // Open memory card
  FILE *raw_file = fopen(argv[1], "r");
  if (raw_file == NULL) {
    printf("Could not open file.\n");
    return 1;
  }

  BYTE buffer[BLOCK_SIZE];
  FILE *img = NULL;
  char filename[8];
  int counter = 0;

  // Read until end of file
  while (fread(buffer, 1, BLOCK_SIZE, raw_file) == BLOCK_SIZE) {
    // Check for JPEG signature
    if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff &&
        (buffer[3] & 0xf0) == 0xe0) {
      // If already found a JPEG, close it
      if (img != NULL) {
        fclose(img);
      }

      // Create new filename and open file
      sprintf(filename, "%03i.jpg", counter);
      img = fopen(filename, "w");
      if (img == NULL) {
        printf("Could not create output file.\n");
        return 1;
      }
      counter++;
    }

    // Write to current JPEG if open
    if (img != NULL) {
      fwrite(buffer, 1, BLOCK_SIZE, img);
    }
  }

  // Close files
  if (img != NULL) {
    fclose(img);
  }
  fclose(raw_file);

  return 0;
}
