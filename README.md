# FitCRM – Simple Client Manager for a Fitness Program

A lightweight, frontend-only CRM concept for fitness professionals to manage basic client info and goals.

## Features

- Multi-page UI with a homepage and top navigation.
- New Client form with fields: Full Name, Age, Gender, Email, Phone, Fitness Goal, Membership Start Date. The "Add Client" button is a placeholder (no persistence).
- Client List view showing a table of 10 sample clients with placeholder Edit/Delete buttons.
- Search box filters rows client-side by name.
- Responsive design using Flexbox/Grid and media queries.

## Pages

- `index.html`: Homepage with visuals and quick actions.
- `new-client.html`: New Client form page.
- `clients.html`: Client List with search.

## Project Structure

```
fitcrm/
├── index.html
├── new-client.html
├── clients.html
├── css/
│   └── styles.css
├── assets/
│   └── icons/ (optional)
└── README.md
```

## Tech Stack

- HTML5
- CSS3 (Flexbox, Grid, media queries)
- Vanilla JavaScript (very light, for search and year)

## Running Locally

No build needed. Open `index.html` in a modern browser.

## Deployment

This project is deployed through Netlify. 
```
https://fitcrmclientmanager.netlify.app/
```
### Option 1: GitHub Pages
1. Create a new public GitHub repository (e.g., `fitcrm`).
2. Push these files to the repository root.
3. In the repo, go to Settings → Pages.
4. Under Source, choose the `main` branch and `/root` folder.
5. Save and wait for the link to appear (e.g., `https://username.github.io/fitcrm/`).

### Option 2: Netlify
1. Go to `https://www.netlify.com/` and sign in.
2. Click "Add New Site" → "Import an Existing Project".
3. Connect your GitHub and select the repository.
4. Since this is static hosting, no build command is required; publish directory is the repo root.
5. Deploy and use the generated live URL (you can rename it).

## Notes

- This project intentionally does not implement data storage or routing; buttons are placeholders.
- Accessibility: semantic markup, labels, focus states, and adequate color contrast are included.


