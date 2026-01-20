window.tailwind = window.tailwind || {};

window.tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EBF5F3",
          100: "#CCE5DF",
          200: "#A8D3C9",
          300: "#81C0B2",
          400: "#59AD9B",
          500: "#2A9D8F",
          600: "#21867D",
          700: "#1A6F67",
          800: "#135851",
          900: "#0C403B"
        },
        secondary: {
          50: "#EEF3FB",
          100: "#D7E2F4",
          200: "#BBCDEC",
          300: "#9EB7E3",
          400: "#82A2DB",
          500: "#5F86D3",
          600: "#3F66B8",
          700: "#2F4C8C",
          800: "#213460",
          900: "#141F38"
        },
        accent: {
          500: "#56C3B5",
          600: "#3D9F92"
        },
        neutral: {
          50: "#F7FAF9",
          100: "#EDF1F0",
          200: "#E1E8E7",
          300: "#C2CECC",
          400: "#9AA8A6",
          500: "#748481",
          600: "#4F5D5B",
          700: "#3C4846",
          800: "#283130",
          900: "#121616"
        },
        info: "#2F5D90",
        success: "#3CB179",
        warning: "#E1A538",
        danger: "#E57373",
        background: {
          light: "#F4F7F6",
          default: "#FFFFFF",
          dark: "#112117",
          surface: "#FFFFFF"
        }
      },
      fontFamily: {
        display: ["Inter", "Roboto", "system-ui", "sans-serif"],
        body: ["Inter", "Roboto", "system-ui", "sans-serif"]
      },
      spacing: {
        "1": "0.5rem",
        "2": "1rem",
        "3": "1.5rem",
        "4": "2rem",
        "5": "2.5rem",
        "6": "3rem",
        "7": "3.5rem",
        "8": "4rem"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px"
      },
      boxShadow: {
        soft: "0px 10px 40px rgba(12, 64, 59, 0.1)",
        focus: "0 0 0 3px rgba(47, 93, 144, 0.25)"
      }
    }
  }
};
