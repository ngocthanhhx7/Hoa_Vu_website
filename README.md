# HOA VU Project

Hoa Vu website project with:

- `client/`: React + Vite frontend
- `server/`: Express + MongoDB + S3 backend

## Clone

```bash
git clone <your-repo-url>
cd Demo_show_project1
```

## Install

```bash
cd server
npm install

cd ../client
npm install
```

## Environment

Create `server/.env` from `server/.env.example` and fill in your real values:

```bash
cp server/.env.example server/.env
```

Important:

- do not commit `server/.env`
- keep MongoDB, JWT, and AWS credentials only on your machine or VPS

## Run locally

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Build frontend

```bash
cd client
npm run build
```

## Production notes

- backend reads config from `server/.env`
- uploaded media uses Amazon S3 when AWS env vars are configured
- legacy local uploads are served from `/uploads`
