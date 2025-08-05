# My Portfolio - Full Stack Project 💼

This is a full stack portfolio project designed to showcase some of my development work. It features a PostgreSQL-powered API and a clean React interface. It also includes complete CI/CD pipelines and automated testing.

---

## 🛠 Technologies Used

### Back-end

* Node.js
* Express
* Knex.js
* PostgreSQL
* TypeScript

### Front-end

* React
* TypeScript
* Vite
* Tailwind CSS

### Testing & DevOps

* Playwright (E2E testing for both frontend and backend)
* Docker & Docker Compose
* GitHub Actions (CI/CD)

---

## ✨ Features

* RESTful API with PostgreSQL database
* Frontend that lists and links personal projects
* Responsive design using Tailwind
* Automated testing (frontend + backend)
* CI/CD pipeline with GitHub Actions

---

## 🚀 Running Locally

### Prerequisites

* Node.js v20+
* Docker and Docker Compose

### Steps

```bash
# 1. Clone the repository
$ git clone https://github.com/your-username/your-repo.git
$ cd your-repo

# 2. Start services
$ docker-compose up --build
```

Access the app:

* API: [http://localhost:5000/api/projects](http://localhost:5000/api/projects)
* Frontend: [http://localhost:3000](http://localhost:3000)

---

## ✅ Running Tests

You can run end-to-end tests with Playwright:

```bash
# Backend tests
$ cd server
$ npx playwright test

# Frontend tests
$ cd client
$ npx playwright test
```

> Tests are also executed automatically via GitHub Actions on every push to `main`.

---

## 📦 Useful Scripts

### Backend

```bash
npm run dev       # Start dev server
npm run build     # Compile TypeScript
npm run start     # Start compiled app
```

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 📁 Project Structure

```
.
├── client         # Frontend (React)
├── server         # Backend (Express + Knex)
├── docker-compose.yml
└── README.md
```

---

## 🧩 Project Status

* [x] API with PostgreSQL, migrations and seeds
* [x] React interface for displaying projects
* [x] Docker-based development setup
* [x] End-to-end tests with Playwright
* [x] CI/CD with GitHub Actions

> Coming soon: Admin interface to manage projects via frontend

---

## 📫 Contact

Get in touch via [LinkedIn](https://www.linkedin.com/in/your-username) or check out my portfolio!
