# Zen Utility

MERN app for keeping notes, logging visitor enquiries and planning events on a calendar.

## Features

- Sign up and log in
- **Enquiries** (dashboard): table of visitors and leads with name, phone, type (visit, meeting, enquiry, delivery, others), reason and description. Add, edit and delete entries
- **Notes**: text notes with an optional image upload
- **Events**: calendar view that shows each event on its day. Click a date to add an event

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, Redux Toolkit, React Router 7, Ant Design 5, Axios, dayjs |
| Backend | Node.js, Express 5, Mongoose 8, Multer |
| Database | MongoDB |

## Architecture

The API is split into layers so each file has one job:

```
router  →  controller  →  DAO  →  model (Mongoose)
```

```
ZenUtility-Final/
├── index.js            Express app, CORS, request logger, /upload (Multer), route mounting
├── router/             one router per resource
├── controller/         request / response handling
├── dao/                database queries
├── model/              user, note, lead, event schemas
└── client/             React app
    └── src/
        ├── containers/     login, signup, dashboard, notes, event
        ├── components/     modals, layout, header, protected route
        └── redux/          session slice and store
```

## API

Each of `/user`, `/note`, `/lead` and `/event` supports:

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | List, filtered by query string (for example `?user=<id>`) |
| POST | `/` | Create |
| PUT | `/:_id` | Update |
| DELETE | `/:_id` | Delete |

Extra routes: `POST /upload` (multipart, field name `file`) returns the stored file's URL, and `GET /` returns a status message.

## Getting started

Requirements: Node.js 18+ and a running MongoDB instance.

```bash
git clone https://github.com/Ruman78-bit/ZenUtility-Final.git
cd ZenUtility-Final
cp .env.example .env        # DB_URL and PORT (the client expects port 3000)
mkdir uploads               # Multer needs this folder to exist
npm run install-deps        # installs server and client dependencies

npm run backend:dev         # API on http://localhost:3000
npm run frontend:dev        # client on http://localhost:5173 (new terminal)
```

## Known limitations

This is a learning project and not ready for real users.

- Passwords are hashed with bcryptjs (12 rounds) before they are saved, and login is `POST /user/login`, so credentials are no longer in the URL. The password field is excluded from queries and from API responses, and the request logger redacts `password` and `re-password`. Accounts created before this change have plain-text passwords and must be re-created.
- There is no JWT or session token yet: after login the client keeps the user in Redux state only, and the other `/user`, `/note`, `/lead` and `/event` routes are not protected. There is also no rate limiting on login.
- The API returns HTTP 200 with `success: false` for errors, and there is no input validation.
- The client has `http://localhost:3000` written into its requests.
- No automated tests.
