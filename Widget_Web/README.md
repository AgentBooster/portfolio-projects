# Widget-Web

Embeddable conversational widget with two variants: React and vanilla JS. Built for support, lead capture, and webhook automation.

## Quick start

- Open `widget-embed.html` in the browser.
- The demo loads `widget.js` with the `DEFAULT_CONFIG` setup.

## Basic configuration (widget.js)

- `company_name`
- `welcome_message`
- `logo_url`
- `webhook_url`
- `agents` (name and avatar)

## Key files

- `Widget.tsx`: React version (requires `useIsMobile`).
- `widget.js`: embeddable vanilla JS version.
- `widget-embed.html`: HTML demo for embedding.
- `widget-liquid-glass/`: Vite + React + TS demo.

## Version notes

- `widget.js` (vanilla): lighter, embeddable, and no build step.
- `Widget.tsx` / `widget-liquid-glass`: richer UI and easier to evolve, but requires a build and is heavier.

## `widget-liquid-glass` notes

- Stack: Vite + React + TypeScript + Tailwind; `index.html` loads `src/main.tsx`.
- Scripts in `package.json`: `dev`, `build`, `preview`.
- Requires Node.js and `npm` (Node Package Manager) to install dependencies and run scripts.
- To try it: `npm install`, `npm run dev`, then open the local URL printed by Vite.
