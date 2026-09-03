# 🚗 Veyra — Roadside Assistance & Mechanic Booking Platform

<p align="center">
  <strong>Find Help. Get Moving. Stay Safe.</strong>
</p>

<p align="center">
  A full-stack roadside assistance platform that connects vehicle owners with nearby mechanics through location-based discovery, service requests, booking, and real-time updates.
</p>

<p align="center">

[![Live App](https://img.shields.io/badge/Live%20App-Veyra-success?style=for-the-badge)](https://veyra-roadside-assistance.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge\&logo=github)](https://github.com/GitWithKomal/Veyra-Roadside-Assistance)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?style=for-the-badge\&logo=githubactions)](https://github.com/GitWithKomal/Veyra-Roadside-Assistance/actions)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge\&logo=docker)](https://www.docker.com/)

</p>

---

## 🌐 Live Demo

### 🚗 Veyra Application

**[Open Veyra →](https://veyra-roadside-assistance.vercel.app/)**

### 🚀 Production Backend

**[Veyra API →](https://veyra-backend-ghcr.onrender.com/api)**

### 💻 Source Code

**[GitHub Repository →](https://github.com/GitWithKomal/Veyra-Roadside-Assistance)**

---

## 📌 Overview

**Veyra** is a full-stack roadside assistance and mechanic booking platform designed to help vehicle owners quickly find and connect with nearby mechanics during vehicle breakdowns and roadside emergencies.

The platform enables users to discover nearby mechanics, request roadside assistance, book services, track requests, and receive real-time updates.

Mechanics can manage their availability, receive service requests, accept jobs, update service status, and share their location.

The application combines **MERN-stack development, geolocation, interactive maps, real-time communication, Docker containerization, and CI/CD automation** into a production-deployed application.

---

## ✨ Key Features

### 👤 User Features

* 🔐 Secure registration and login
* 📍 Location-based mechanic discovery
* 🗺️ Interactive Mappls map integration
* 👨‍🔧 Find nearby mechanics
* 🔧 Request roadside assistance
* 📅 Book mechanic services
* 📋 Track service requests
* 🔄 Real-time service updates
* ⭐ Rate mechanics
* 🌙 Light / Dark mode
* 📱 Responsive interface

### 👨‍🔧 Mechanic Features

* 🔐 Mechanic authentication
* 🟢 Availability management
* 📍 Location updates
* 📋 View incoming service requests
* ✅ Accept / reject requests
* 🔄 Update service status
* 📊 Manage assigned services
* ⭐ Customer ratings

### 🛡️ Admin Features

* 🔐 Admin authentication
* 👥 User management
* 👨‍🔧 Mechanic management
* 📋 Service request monitoring
* 📊 Platform management

### ⚡ Real-Time Communication

Veyra uses **Socket.IO** to provide real-time application updates.

* Live mechanic location updates
* Service request notifications
* Request status changes
* Mechanic availability updates
* Real-time communication between users and mechanics

---

## 🗺️ Location-Based Assistance

Veyra integrates **Mappls APIs** to provide location-aware roadside assistance.

The mapping system enables:

* 📍 Current user location
* 👨‍🔧 Nearby mechanic discovery
* 🗺️ Interactive map visualization
* 📌 Mechanic location markers
* 🧭 Location-based service workflows

This allows users to identify nearby assistance based on their current location.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │        Veyra App        │
                         │   React + Vite + UI     │
                         └────────────┬────────────┘
                                      │
                           REST API / Socket.IO
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     Render Backend      │
                         │   Node.js + Express     │
                         │   Docker Container      │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
             MongoDB Atlas         Mappls          Socket.IO
                Database        Maps / Location     Real-Time
```

---

# ⚙️ Deployment & CI/CD

Veyra uses **GitHub Actions, Docker, GitHub Container Registry, and Render** to create a containerized deployment workflow.

### CI/CD Pipeline

```text
                     Developer
                         │
                         ▼
                    Git Push
                         │
                         ▼
                ┌─────────────────┐
                │ GitHub Actions  │
                │    Veyra CI     │
                └────────┬────────┘
                         │
                         ▼
                 Docker Image Build
                         │
                         ▼
                  GitHub Container
                     Registry
                         │
                         ▼
                     Render
                         │
                         ▼
                Production Backend
```

### Pipeline Highlights

* GitHub Actions workflow
* Docker image builds
* Frontend Docker build configuration
* Backend Docker build
* Safe frontend build arguments
* Docker image publishing to GHCR
* Container-based backend deployment through Render

**[View GitHub Actions →](https://github.com/GitWithKomal/Veyra-Roadside-Assistance/actions)**

---

# 🐳 Docker & GitHub Container Registry

The Veyra backend is containerized using **Docker** and published to **GitHub Container Registry (GHCR)**.

### Container Image

```text
ghcr.io/gitwithkomal/veyra-backend
```

The containerized backend is deployed through Render.

This approach provides a consistent application environment and integrates the backend deployment with the CI/CD workflow.

---

# 🧰 Tech Stack

## Frontend

* **React 19**
* **Vite**
* **Tailwind CSS**
* **React Router**
* **Axios**
* **React Hook Form**
* **React Hot Toast**
* **Framer Motion**
* **React Markdown**

## Backend

* **Node.js**
* **Express.js**
* **Socket.IO**
* **JWT**
* **bcrypt**
* **Mongoose**

## Database

* **MongoDB**
* **MongoDB Atlas**

## Maps & Location

* **Mappls APIs**
* Browser Geolocation API

## DevOps & Deployment

* **Docker**
* **GitHub Actions**
* **GitHub Container Registry**
* **Render**
* **Vercel**
* **Git / GitHub**

---

# 🔐 Authentication & Security

Veyra implements authentication and authorization using:

* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Role-based access control
* Authenticated service workflows
* Environment-based configuration

Sensitive credentials such as database connection strings, JWT secrets, and API keys are stored using environment variables and are **not committed to the repository**.

---

# 🔄 Core User Workflow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Allow Location Access
 │
 ▼
Find Nearby Mechanics
 │
 ▼
Select Required Service
 │
 ▼
Create Assistance Request
 │
 ▼
Mechanic Receives Request
 │
 ▼
Mechanic Accepts
 │
 ▼
Service Tracking
 │
 ▼
Service Completed
 │
 ▼
User Rates Mechanic
```

---

# 📡 Real-Time Workflow

Veyra uses Socket.IO to provide real-time updates during active service requests.

```text
User
 │
 │ Create Assistance Request
 ▼
Backend
 │
 │ Store Request
 │
 │ Emit Event
 ▼
Mechanic
 │
 │ Receive Request
 ▼
Accept Request
 │
 ▼
Backend
 │
 │ Real-Time Update
 ▼
User
 │
 ▼
Track Service
```

---

# 📁 Project Structure

```text
Veyra-Roadside-Assistance/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── map/
│   │   │   └── ...
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── utils/
│   ├── validators/
│   ├── seedAdmin.js
│   ├── server.js
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── README.md
└── ...
```

---

# ⚙️ Environment Configuration

## Frontend

Create a `.env` file inside `client/`:

```env
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_url
VITE_MAPPLS_API_KEY=your_mappls_api_key
```

### Production API

The deployed Vercel frontend communicates with the production backend:

```text
https://veyra-backend-ghcr.onrender.com/api
```

## Backend

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> ⚠️ Never commit `.env` files, API keys, database credentials, or JWT secrets to GitHub.

---

# 🚀 Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/GitWithKomal/Veyra-Roadside-Assistance.git

cd Veyra-Roadside-Assistance
```

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

Configure the backend environment variables and start the development server:

```bash
npm run dev
```

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

> Production deployment uses **Vercel for the frontend** and **Render for the containerized backend**.

---

# ☁️ Production Deployment

| Component               | Platform / Technology     |
| ----------------------- | ------------------------- |
| Frontend                | Vercel                    |
| Backend                 | Render                    |
| Backend Runtime         | Docker                    |
| Container Registry      | GitHub Container Registry |
| Database                | MongoDB Atlas             |
| CI/CD                   | GitHub Actions            |
| Maps                    | Mappls                    |
| Real-Time Communication | Socket.IO                 |

### Production Frontend

**https://veyra-roadside-assistance.vercel.app/**

### Production Backend

**https://veyra-backend-ghcr.onrender.com/api**

### Docker Image

**ghcr.io/gitwithkomal/veyra-backend**

---

# 📈 Engineering Highlights

Veyra demonstrates practical experience with:

* Full-stack MERN development
* REST API architecture
* JWT authentication
* Role-based workflows
* MongoDB data modeling
* Geolocation-based search
* Map API integration
* Real-time communication with Socket.IO
* Docker containerization
* GitHub Actions CI/CD
* GitHub Container Registry
* Cloud deployment
* Responsive UI development
* Environment-based configuration

---

# 🔮 Future Improvements

* 💳 Online payment integration
* 📱 Progressive Web App / mobile application
* 🤖 AI-powered vehicle issue assistance
* 🧠 Intelligent mechanic recommendations
* 📊 Advanced analytics dashboard
* 🔔 Push notifications
* 🗺️ Live route and ETA optimization
* 📞 Emergency calling integration
* 🧾 Digital service invoices
* 📚 Service history
* ☁️ Further cloud infrastructure scaling

---

# 📊 Project Status

**🚀 Deployed & Active Development**

Veyra is currently deployed with:

* React frontend on Vercel
* Containerized Node.js backend on Render
* MongoDB Atlas database
* Mappls integration
* Socket.IO real-time communication
* GitHub Actions CI/CD
* Docker + GitHub Container Registry

---

# 👩‍💻 Author

## Komal Nimje

**Software Engineer | Full Stack Developer | AI/GenAI | DevOps**

Building practical applications across:

`React` · `Node.js` · `MongoDB` · `Python` · `GenAI` · `Docker` · `DevOps`

---

## ⭐ Support

If you find Veyra interesting, consider giving the repository a ⭐.

**[GitHub Repository →](https://github.com/GitWithKomal/Veyra-Roadside-Assistance)**

---

## 📄 License

This project is developed for portfolio, learning, and demonstration purposes.
