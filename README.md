# Airbnb-clone-project

This is a small Express/MongoDB demo project (a simplified Airbnb clone).

Quick start
1. Install dependencies:

```powershell
npm install
```

2. Start the app (production / normal):

```powershell
npm start
```

3. Start the app in development mode (auto-restarts on file changes):

```powershell
npm run dev
```

Notes
- `npm run dev` uses `nodemon` which is installed as a devDependency in this project. If you prefer to have `nodemon` globally available, update the global install with:

```powershell
npm install -g nodemon@latest
```

- To change the server entry file, update the `start`/`dev` scripts in `package.json`.

Troubleshooting
- If the server fails to start, check the console for errors. Common issues include MongoDB not running locally (the app expects mongodb://127.0.0.1:27017/wanderlust) or missing environment configuration.

If you want, I can also add a small `CONTRIBUTING.md` or expand setup steps for development databases and environment variables.
