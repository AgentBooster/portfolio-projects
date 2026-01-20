# BooWidget

Embeddable chat widget used on the Boo company site. This folder contains the
standalone JavaScript file and a minimal integration note.

- Try it live in our web app: https://agentbooster.ai
- Test an alternate style here: https://risolvia.com

## Contents
- `boowidget.js`: widget script (paste the full code here).

## Quick start
1. Ensure your page has a mount element:

```html
<div id="boo-ai-widget"></div>
```

2. Load the script (ideally before `</body>`):

```html
<script src="./boowidget.js"></script>
```

If you change the mount ID, update `targetDivId` in `boowidget.js`.

## n8n flow
Template: `Flows_JSON/n8n/BooWebMeet.json`

## External services
- Tailwind CSS via `https://cdn.tailwindcss.com`
- Google Fonts (Inter) via `https://fonts.googleapis.com`
- Image assets hosted on Cloudinary
- Webhook URL configured inside `boowidget.js`
