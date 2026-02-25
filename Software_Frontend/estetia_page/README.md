Modern landing page for an aesthetic clinic, built with React, Vite, and Tailwind CSS.

![Estetia Hero Preview](assets/estetia_preview.png)
![Estetia Services Preview](assets/estetia_services.png)

## Credits

Design made possible thanks to [Vasyl Pavlyuchok](https://github.com/vasyl-pavlyuchok).

## Features

- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Modern UI**: Smooth animations, glassmorphism effects, and clean typography.
- **Component Based**: Modular architecture using React components.
- **Fast Performance**: Powered by Vite.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start development server:**

    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

## Deployment Reference

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) configuration for automatic deployment to GitHub Pages.

### How to Deploy (Standalone)

Since this project is currently nested within a portfolio monorepo, the included workflow will **not** trigger automatically. To deploy this project:

1.  Copy the contents of this folder to a **new, empty GitHub repository**.
2.  Push changes to the `main` branch.
3.  The workflow will automatically build and deploy the site to `gh-pages` branch.
4.  Go to **Settings > Pages** in your repository and select the `gh-pages` branch as the source.

**Note:** Ensure `vite.config.js` has the correct `base` URL matching your new repository name (e.g., `base: '/repo-name/'`).

- `src/App.jsx`: Main application layout.
- `src/main.jsx`: Entry point.
- `public/`: Static assets.

## License

MIT License.
