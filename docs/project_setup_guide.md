# Project Initialization Guide

This document outlines the commands used to set up the **Restaurant / Takeaway Ordering System** from scratch.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or cloud connection string)

## 1. Project Root Setup
Create the main project directory and initialize git.
```bash
mkdir resturent_mng_sys
cd resturent_mng_sys
git init
```

## 2. Server Setup (Backend)
Initialize the Node.js server and install dependencies.

```bash
# Create server directory
mkdir server
cd server

# Initialize package.json
npm init -y

# Install Production Dependencies
npm install express mongoose dotenv cors socket.io bcryptjs jsonwebtoken morgan

# Install Development Dependencies (Testing & Linting)
npm install --save-dev nodemon jest supertest eslint
```

**Key Dependencies:**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `socket.io`: Real-time communication
- `bcryptjs` & `jsonwebtoken`: Authentication
- `jest` & `supertest`: Testing framework

## 3. Client Setup (Frontend)
Initialize the React application using Vite.

```bash
# Go back to project root
cd ..

# Create Vite App (React Template)
npx create-vite@latest client --template react

# Navigate to client
cd client

# Install Default Dependencies
npm install

# Install Project Dependencies
npm install react-router-dom axios socket.io-client
```

**Key Dependencies:**
- `react-router-dom`: Navigation
- `axios`: API requests
- `socket.io-client`: Real-time client

## 4. Running the Project

**Start Server:**
```bash
cd server
npm start
# OR for development with hot-reload:
npm run dev
```

**Start Client:**
```bash
cd client
npm run dev
```

## 5. Directory Structure Created
```
resturent_mng_sys/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Login, Register, Home
│   │   └── ...
│   └── package.json
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # DB Connection
│   │   ├── controllers/    # API Logic
│   │   ├── middleware/     # Auth Middleware
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # API Routes
│   │   └── ...
│   └── package.json
├── .gitignore
└── README.md
```
