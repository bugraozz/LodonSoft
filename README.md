# Lodonsoft

Lodonsoft is a full-stack React application served by an Express backend. Local development uses a JSON file database by default, so PostgreSQL credentials are not required.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>. The API health check is available at <http://localhost:3000/api/health>.

Application data is stored in `data/db.json`. The server creates the file and seeds it with the initial sample data if it does not exist. To use PostgreSQL for project tracker data, copy `.env.example` to `.env`, fill in the PostgreSQL connection settings, and start the app again. Other application data continues to use the JSON file.

Set `PORT` in `.env` to use a different local port.

## Production

```powershell
npm run build
$env:NODE_ENV = "production"
npm start
```

Set `NODE_ENV=production` before `npm start` to serve the built frontend and API from the same Express server.
