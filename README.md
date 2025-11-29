# FitCRM – Simple Client Manager for a Fitness Program

A lightweight, frontend-only CRM webapp for fitness professionals to manage basic client info and goals.

## Features

### Page 1: New Client Form
- Add new clients with fields: Full Name, Age, Gender, Email, Phone, Fitness Goal, Membership Start Date
- Form validation (email format, required fields)
- Data persistence using localStorage


### Page 2: Client List View
- Display all clients in a responsive table
- **Search**: Filter clients by name in real-time
- **Edit**: Update client details with form repopulation
- **Delete**: Remove clients with confirmation prompt
- **View**: Click on any client row to view detailed information


### Page 3: Client Detail View
- Display comprehensive client information
- Show training history
- Fetch 5 suggested exercises from Wger REST API for the next session

## Pages

- `index.html`: Homepage with visuals and quick actions
- `new-client.html`: New Client form page with localStorage integration
- `clients.html`: Client List with search, edit, delete, and view functionality
- `edit-client.html`: Edit Client form page with pre-populated fields
- `client-view.html`: Individual client details with exercise suggestions

## Project Structure

```
fitcrm/
├── index.html
├── new-client.html
├── clients.html
├── edit-client.html
├── client-view.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── README.md
```

## Tech Stack

- HTML5
- CSS3 (Flexbox, Grid, media queries)
- JavaScript
- localStorage for data persistence
- Wger REST API for exercise suggestions

## Running Locally

No build needed. Open `index.html` in a modern browser.

## Deployment

This project is deployed through Netlify. 
```
https://fitcrmclientmanager.netlify.app/
```

### Option 1: GitHub Pages
1. Create a new public GitHub repository (e.g., `fitcrm`)
2. Push these files to the repository root
3. In the repo, go to Settings → Pages
4. Under Source, choose the `main` branch and `/root` folder
5. Save and wait for the link to appear (e.g., `https://username.github.io/fitcrm/`)

### Option 2: Netlify
1. Go to `https://www.netlify.com/` and sign in
2. Click "Add New Site" → "Import an Existing Project"
3. Connect your GitHub and select the repository
4. Since this is static hosting, no build command is required; publish directory is the repo root
5. Deploy and use the generated live URL (you can rename it)

## Notes

- Data is stored in browser localStorage and persists across page refreshes
- All Create, Read, Update, Delete operations are fully functional
- Exercise suggestions are fetched from the Wger API (https://wger.de/api/v2/)
- Responsive design works on desktop and mobile devices

