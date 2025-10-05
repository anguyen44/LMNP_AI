# 🚀 LMNP AI Monorepo

This project is an **Nx monorepo** that includes both a **NestJS backend** and a **Vite-based frontend**.  
It provides an integrated environment for developing, building, and running full-stack applications easily.

---

## 🧠 Overview

**Structure:**

```
LMNP_AI-main/
├── apps/
│   ├── backend/     # NestJS API server
│   └── frontend/    # Frontend app (Vite + React)
├── nx.json          # Nx configuration
├── package.json     # Root dependencies and scripts
├── tsconfig.base.json
└── Makefile         # Optional helper for automation
```

---

## ⚙️ 1. Prerequisites

Make sure you have installed:

- **Node.js** ≥ 18
- **npm** (comes with Node.js) or **pnpm**
- (Optional) **Nx CLI** for better developer experience

```bash
npm install -g nx
```

Check your versions:

```bash
node -v
npm -v
nx --version
```

---

## 📥 2. Clone the repository

```bash
git clone https://github.com/anguyen44/LMNP_AI.git
cd LMNP_AI
```

---

## 📦 3. Install dependencies

From the root directory, run:

```bash
npm install
```

> This installs all dependencies for both frontend and backend automatically using Nx.

---

## 🧩 4. Setup environment variables

### Backend

Go to the backend directory:

```bash
cd apps/backend
```

Copy the example environment file:

```bash
cp .env.example .env
```

Then open `.env` and configure your variables, for example:

```
GROQ_API_KEY=your_groq_api_key
```

---

## ⚡ 5. Run frontend and backend together in development mode

To run both apps concurrently with Nx:

```bash
nx run-many --target=serve --all
```

## ▶️ 6. Run the each service in development mode

You can use **Nx** or run apps directly.
From the root directory, run:

### Run backend only

```bash
nx serve backend
```

### Run frontend only

```bash
nx serve frontend
```

## 💡 7. Access points

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
