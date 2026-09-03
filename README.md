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

**https://veyra-roadside-assistance.vercel.app/**

### 🚀 Production Backend

**https://veyra-backend-ghcr.onrender.com/api**

### 💻 Source Code

**https://github.com/GitWithKomal/Veyra-Roadside-Assistance**

---

## 📌 Overview

**Veyra** is a full-stack roadside assistance and mechanic booking platform built to solve a common problem: finding reliable roadside help quickly when a vehicle breaks down.

The platform allows users to discover nearby mechanics, request roadside assistance, book services, track service requests, and receive real-time updates.

Mechanics can manage their availability, receive service requests, accept jobs, update service status, and share their location.

The application combines **MERN-stack development, geolocation, interactive maps, real-time communication, Docker, and CI/CD automation** into a production-deployed application.

---

## ✨ Key Features

### 👤 User

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
* 📱 Responsive UI

### 👨‍🔧 Mechanic

* 🔐 Mechanic authentication
* 🟢 Availability management
* 📍 Location updates
* 📋 View incoming service requests
* ✅ Accept / reject requests
* 🔄 Update service status
* 📊 Manage assigned services
* ⭐ Customer ratings

### 🛡️ Admin

* 🔐 Admin authentication
* 👥 User management
* 👨‍🔧 Mechanic management
* 📋 Service request monitoring
* 📊 Platform management

### ⚡ Real-Time Communication

Veyra uses **Socket.IO** for real-time application updates.

* Live mechanic location updates
* Service request notifications
* Request status changes
* Mechanic availability updates
* Real-time communication between relevant users and mechanics

---

## 🗺️ Location-Based Assistance

Veyra integrates **Mappls APIs** to provide location-aware roadside assistance.

The mapping system enables:

* 📍 Current user location
* 👨‍🔧 Nearby mechanic discovery
* 🗺️ Interactive map visualization
* 📌 Mechanic location markers
* 🧭 Location-based service workflows

This allows users to identify nearby assistance instead of manually searching for mechanics.

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
              Database          Maps / Location    Real-Time
```

### Deployment & CI/CD

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
```# 🚗 Veyra — Roadside Assistance & Mechanic Booking Platform

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

**https://veyra-roadside-assistance.vercel.app/**

### 🚀 Production Backend

**https://veyra-backend-ghcr.onrender.com/api**

### 💻 Source Code

**https://github.com/GitWithKomal/Veyra-Roadside-Assistance**

---

## 📌 Overview

**Veyra** is a full-stack roadside assistance and mechanic booking platform built to solve a common problem: finding reliable roadside help quickly when a vehicle breaks down.

The platform allows users to discover nearby mechanics, request roadside assistance, book services, track service requests, and receive real-time updates.

Mechanics can manage their availability, receive service requests, accept jobs, update service status, and share their location.

The application combines **MERN-stack development, geolocation, interactive maps, real-time communication, Docker, and CI/CD automation** into a production-deployed application.

---

## ✨ Key Features

### 👤 User

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
* 📱 Responsive UI

### 👨‍🔧 Mechanic

* 🔐 Mechanic authentication
* 🟢 Availability management
* 📍 Location updates
* 📋 View incoming service requests
* ✅ Accept / reject requests
* 🔄 Update service status
* 📊 Manage assigned services
* ⭐ Customer ratings

### 🛡️ Admin

* 🔐 Admin authentication
* 👥 User management
* 👨‍🔧 Mechanic management
* 📋 Service request monitoring
* 📊 Platform management

### ⚡ Real-Time Communication

Veyra uses **Socket.IO** for real-time application updates.

* Live mechanic location updates
* Service request notifications
* Request status changes
* Mechanic availability updates
* Real-time communication between relevant users and mechanics

---

## 🗺️ Location-Based Assistance

Veyra integrates **Mappls APIs** to provide location-aware roadside assistance.

The mapping system enables:

* 📍 Current user location
* 👨‍🔧 Nearby mechanic discovery
* 🗺️ Interactive map visualization
* 📌 Mechanic location markers
* 🧭 Location-based service workflows

This allows users to identify nearby assistance instead of manually searching for mechanics.

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
              Database          Maps / Location    Real-Time
```

### Deployment & CI/CD

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

---

# ⚙️ CI/CD Pipeline

Veyra includes a **GitHub Actions CI/CD workflow** for its containerized backend deployment.

The pipeline is responsible for building and publishing Docker images to **GitHub Container Registry (GHCR)**.

### Pipeline Flow

```text
Push to main
     │
     ▼
GitHub Actions
     │
     ▼
Docker Build
     │
     ├── Frontend build
     │
     └── Backend build
     │
     ▼
Docker Image
     │
     ▼
GHCR
     │
     ▼
Render
     │
     ▼
Production
```

### CI/CD Highlights

* GitHub Actions workflow
* Docker image builds
* Frontend Docker build configuration
* Backend Docker build
* Safe frontend build arguments
* Docker image publishing to GHCR
* Render deployment using the containerized backend

The repository currently has successful CI workflow runs for the Docker build and GHCR publishing process.

**Pipeline:**
https://github.com/GitWithKomal/Veyra-Roadside-Assistance/actions

---

# 🐳 Docker & Containerization

The backend is containerized using Docker and deployed through Render.

The container image is published to:

```text
ghcr.io/gitwithkomal/veyra-backend
```

This provides a consistent runtime environment between development and deployment and integrates directly with the CI/CD workflow.

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
* Geolocation APIs

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
* Environment variables for sensitive configuration

Sensitive credentials such as:

* MongoDB connection strings
* JWT secrets
* Mappls credentials
* Other private configuration

are stored through environment variables and are **not committed to the repository**.

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
Select Service
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

Veyra uses Socket.IO to reduce the need for constant polling and provide real-time updates.

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
│
├── .gitignore
├── README.md
└── ...
```

---

# ⚙️ Environment Configuration

### Frontend

Create a `.env` file inside `client/`:

```env
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_url
VITE_MAPPLS_API_KEY=your_mappls_api_key
```

For production, the frontend uses the deployed backend rather than a localhost API.

Example production API:

```text
https://veyra-backend-ghcr.onrender.com/api
```

### Backend

Create a `.env` file inside `server/` with the required server-side configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit `.env` files or expose private credentials in the repository.

---

# 🚀 Running the Project Locally

### Clone

```bash
git clone https://github.com/GitWithKomal/Veyra-Roadside-Assistance.git

cd Veyra-Roadside-Assistance
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The local development frontend can then be accessed through the Vite development server.

> Production deployment uses Vercel for the frontend and Render for the backend.

---

# ☁️ Production Deployment

| Component               | Platform                  |
| ----------------------- | ------------------------- |
| Frontend                | Vercel                    |
| Backend                 | Render                    |
| Backend Container       | Docker                    |
| Container Registry      | GitHub Container Registry |
| Database                | MongoDB Atlas             |
| CI/CD                   | GitHub Actions            |
| Maps                    | Mappls                    |
| Real-Time Communication | Socket.IO                 |

### Production Frontend

https://veyra-roadside-assistance.vercel.app/

### Production Backend

https://veyra-backend-ghcr.onrender.com/api

---

# 📈 Engineering Highlights

Veyra demonstrates practical experience with:

* Full-stack MERN development
* REST API design
* JWT authentication
* Role-based workflows
* MongoDB data modeling
* Geolocation-based search
* Map API integration
* Real-time communication
* Socket.IO
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
* 📊 Advanced analytics
* 🔔 Push notifications
* 🗺️ Live route and ETA optimization
* 📞 Emergency calling integration
* 🧾 Digital service invoices
* 📚 Service history
* ☁️ Further cloud infrastructure scaling

---

# 📊 Project Status

**Status: 🚀 Deployed & Active Development**

Veyra is currently deployed with:

* React frontend on Vercel
* Containerized Node.js backend on Render
* MongoDB Atlas database
* Mappls integration
* Socket.IO real-time communication
* GitHub Actions CI/CD
* Docker + GHCR

---

# 👩‍💻 Author

## Komal Nimje

**Software Engineer | Full Stack Developer | AI/GenAI | DevOps**

Building practical applications across:

`React` · `Node.js` · `MongoDB` · `Python` · `GenAI` · `Docker` · `DevOps`

---

## ⭐ Support

If you found Veyra interesting, consider giving the repository a ⭐.

**GitHub:**
https://github.com/GitWithKomal/Veyra-Roadside-Assistance

---

## 📄 License

This project is developed for portfolio, learning, and demonstration purposes.


---

# ⚙️ CI/CD Pipeline

Veyra includes a **GitHub Actions CI/CD workflow** for its containerized backend deployment.

The pipeline is responsible for building and publishing Docker images to **GitHub Container Registry (GHCR)**.

### Pipeline Flow

```text
Push to main
     │
     ▼
GitHub Actions
     │
     ▼
Docker Build
     │
     ├── Frontend build
     │
     └── Backend build
     │
     ▼
Docker Image
     │
     ▼
GHCR
     │
     ▼
Render
     │
     ▼
Production
```

### CI/CD Highlights

* GitHub Actions workflow
* Docker image builds
* Frontend Docker build configuration
* Backend Docker build
* Safe frontend build arguments
* Docker image publishing to GHCR
* Render deployment using the containerized backend

The repository currently has successful CI workflow runs for the Docker build and GHCR publishing process.

**Pipeline:**
https://github.com/GitWithKomal/Veyra-Roadside-Assistance/actions

---

# 🐳 Docker & Containerization

The backend is containerized using Docker and deployed through Render.

The container image is published to:

```text
ghcr.io/gitwithkomal/veyra-backend
```

This provides a consistent runtime environment between development and deployment and integrates directly with the CI/CD workflow.

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
* Geolocation APIs

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
* Environment variables for sensitive configuration

Sensitive credentials such as:

* MongoDB connection strings
* JWT secrets
* Mappls credentials
* Other private configuration

are stored through environment variables and are **not committed to the repository**.

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
Select Service
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

Veyra uses Socket.IO to reduce the need for constant polling and provide real-time updates.

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
│
├── .gitignore
├── README.md
└── ...
```

---

# ⚙️ Environment Configuration

### Frontend

Create a `.env` file inside `client/`:

```env
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_url
VITE_MAPPLS_API_KEY=your_mappls_api_key
```

For production, the frontend uses the deployed backend rather than a localhost API.

Example production API:

```text
https://veyra-backend-ghcr.onrender.com/api
```

### Backend

Create a `.env` file inside `server/` with the required server-side configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit `.env` files or expose private credentials in the repository.

---

# 🚀 Running the Project Locally

### Clone

```bash
git clone https://github.com/GitWithKomal/Veyra-Roadside-Assistance.git

cd Veyra-Roadside-Assistance
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The local development frontend can then be accessed through the Vite development server.

> Production deployment uses Vercel for the frontend and Render for the backend.

---

# ☁️ Production Deployment

| Component               | Platform                  |
| ----------------------- | ------------------------- |
| Frontend                | Vercel                    |
| Backend                 | Render                    |
| Backend Container       | Docker                    |
| Container Registry      | GitHub Container Registry |
| Database                | MongoDB Atlas             |
| CI/CD                   | GitHub Actions            |
| Maps                    | Mappls                    |
| Real-Time Communication | Socket.IO                 |

### Production Frontend

https://veyra-roadside-assistance.vercel.app/

### Production Backend

https://veyra-backend-ghcr.onrender.com/api

---

# 📈 Engineering Highlights

Veyra demonstrates practical experience with:

* Full-stack MERN development
* REST API design
* JWT authentication
* Role-based workflows
* MongoDB data modeling
* Geolocation-based search
* Map API integration
* Real-time communication
* Socket.IO
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
* 📊 Advanced analytics
* 🔔 Push notifications
* 🗺️ Live route and ETA optimization
* 📞 Emergency calling integration
* 🧾 Digital service invoices
* 📚 Service history
* ☁️ Further cloud infrastructure scaling

---

# 📊 Project Status

**Status: 🚀 Deployed & Active Development**

Veyra is currently deployed with:

* React frontend on Vercel
* Containerized Node.js backend on Render
* MongoDB Atlas database
* Mappls integration
* Socket.IO real-time communication
* GitHub Actions CI/CD
* Docker + GHCR

---

# 👩‍💻 Author

## Komal Nimje

**Software Engineer | Full Stack Developer | AI/GenAI | DevOps**

Building practical applications across:

`React` · `Node.js` · `MongoDB` · `Python` · `GenAI` · `Docker` · `DevOps`

---

## ⭐ Support

If you found Veyra interesting, consider giving the repository a ⭐.

**GitHub:**
https://github.com/GitWithKomal/Veyra-Roadside-Assistance

---

## 📄 License

This project is developed for portfolio, learning, and demonstration purposes.
