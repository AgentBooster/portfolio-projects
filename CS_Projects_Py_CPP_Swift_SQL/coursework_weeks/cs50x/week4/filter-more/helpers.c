#include "helpers.h"
#include <math.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width]) {
  for (int i = 0; i < height; i++) {
    for (int j = 0; j < width; j++) {
      // Calculate average pixel value
      float average =
          (image[i][j].rgbtRed + image[i][j].rgbtGreen + image[i][j].rgbtBlue) /
          3.0;
      int avg = round(average);

      // Set all channels to the average
      image[i][j].rgbtRed = avg;
      image[i][j].rgbtGreen = avg;
      image[i][j].rgbtBlue = avg;
    }
  }
  return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width]) {
  for (int i = 0; i < height; i++) {
    for (int j = 0; j < width / 2; j++) {
      // Swap pixels
      RGBTRIPLE temp = image[i][j];
      image[i][j] = image[i][width - 1 - j];
      image[i][width - 1 - j] = temp;
    }
  }
  return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width]) {
  // Create a copy of image
  RGBTRIPLE copy[height][width];
  for (int i = 0; i < height; i++) {
    for (int j = 0; j < width; j++) {
      copy[i][j] = image[i][j];
    }
  }

  for (int i = 0; i < height; i++) {
    for (int j = 0; j < width; j++) {
      float sumRed = 0, sumGreen = 0, sumBlue = 0;
      int count = 0;

      // Iterate over 3x3 grid
      for (int di = -1; di <= 1; di++) {
        for (int dj = -1; dj <= 1; dj++) {
          int ni = i + di;
          int nj = j + dj;

          // Check boundaries
          if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
            sumRed += copy[ni][nj].rgbtRed;
            sumGreen += copy[ni][nj].rgbtGreen;
            sumBlue += copy[ni][nj].rgbtBlue;
            count++;
          }
        }
      }

      // Update image with average
      image[i][j].rgbtRed = round(sumRed / count);
      image[i][j].rgbtGreen = round(sumGreen / count);
      image[i][j].rgbtBlue = round(sumBlue / count);
    }
  }
  return;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width]) {
  // Create a copy of image
  RGBTRIPLE copy[height][width];
  for (int i = 0; i < height; i++) {
    for (int j = 0; j < width; j++) {
      copy[i][j] = image[i][j];
    }
  }

  // Sobel kernels
  int Gx[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
  int Gy[3][3] = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};

  for (int i = 0; i < height; i++) {
    for (int j = 0; j < width; j++) {
      float Gx_red = 0, Gx_green = 0, Gx_blue = 0;
      float Gy_red = 0, Gy_green = 0, Gy_blue = 0;

      // Iterate over 3x3 grid
      for (int di = -1; di <= 1; di++) {
        for (int dj = -1; dj <= 1; dj++) {
          int ni = i + di;
          int nj = j + dj;

          // Treat out of bounds as black (0)
          if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
            Gx_red += copy[ni][nj].rgbtRed * Gx[di + 1][dj + 1];
            Gx_green += copy[ni][nj].rgbtGreen * Gx[di + 1][dj + 1];
            Gx_blue += copy[ni][nj].rgbtBlue * Gx[di + 1][dj + 1];

            Gy_red += copy[ni][nj].rgbtRed * Gy[di + 1][dj + 1];
            Gy_green += copy[ni][nj].rgbtGreen * Gy[di + 1][dj + 1];
            Gy_blue += copy[ni][nj].rgbtBlue * Gy[di + 1][dj + 1];
          }
        }
      }

      // Combine Gx and Gy
      int finalRed = round(sqrt(Gx_red * Gx_red + Gy_red * Gy_red));
      int finalGreen = round(sqrt(Gx_green * Gx_green + Gy_green * Gy_green));
      int finalBlue = round(sqrt(Gx_blue * Gx_blue + Gy_blue * Gy_blue));

      // Cap at 255
      image[i][j].rgbtRed = (finalRed > 255) ? 255 : finalRed;
      image[i][j].rgbtGreen = (finalGreen > 255) ? 255 : finalGreen;
      image[i][j].rgbtBlue = (finalBlue > 255) ? 255 : finalBlue;
    }
  }
  return;
}
