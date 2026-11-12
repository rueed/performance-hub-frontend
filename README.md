# Performance Hub - Frontend

React (Vite) frontend. The backend lives in the `performance-hub-backend` repo.

## Run
1. `npm install`
2. Copy `.env.example` to `.env` (the `.env` file is never committed).
3. `npm run dev` then open http://localhost:5173

## Folder structure
```
src/
  styles/theme.css     shared colors + classes (light theme)   <- shared
  api/client.js        the only place that calls fetch         <- shared
  components/          small shared pieces (layout, ...)       <- shared
  context/             AuthContext (Jana)
  pages/
    auth/              login (Jana)
    dashboard/         dashboards
    objectives/        objectives + evaluations (Ruaa)
    timesheet/         timesheet (Serin)
```
Each person works inside her own `pages/<name>/` folder.

## Design rules (light theme)
- Import `styles/theme.css` once in `main.jsx`. Do not use `index.css` / `App.css`.
- Never write hex colors in your own CSS. Use `var(--primary)`, `var(--danger)`, ...
- Use the shared classes: `page`, `card`, `btn`, `btn-secondary`, `btn-danger`,
  `field`, `input`, `badge`, `error-text`, `muted-text`.
- Need a new color or class? Add it to `theme.css` in a small PR and tell the team.

## Git rules
- Never push to `main`. Work on `feature/<name>-<topic>`, open a Pull Request,
  the other teammate reviews it.
- Shared files (`theme.css`, `client.js`, `App.jsx`, `main.jsx`): tell the team before you change them.
