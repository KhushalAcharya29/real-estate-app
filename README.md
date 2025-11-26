# 🏡 RealEstate Pro

A full-stack real estate platform where users can register as **Agents** or **Clients** to list, explore, and manage properties — built using **React + Node.js + TypeScript + MongoDB**.

---

## 🚀 Live Demo

**Frontend:** [https://real-estate-app-frontend.onrender.com](https://real-estate-app-1-gbzy.onrender.com/)
**Backend API:** [https://real-estate-app-dopm.onrender.com](https://real-estate-app-dopm.onrender.com/api/v1)

---

## 🧬 Tech Stack

**Frontend**

* React + TypeScript (Vite)
* Redux Toolkit Query
* TailwindCSS + Framer Motion
* Leaflet (Map Integration)

**Backend**

* Node.js + Express + TypeScript
* MongoDB (Mongoose)
* JWT Auth (Access + Refresh tokens)
* Helmet + CORS + Rate Limiting

**Hosting**

* Render (Frontend + Backend)
* MongoDB Atlas (Database)

---

## 💡 Features

✅ User authentication (Login, Register, Role-based access)
✅ Agent dashboard to manage properties
✅ Client dashboard to view & express interest
✅ Real-time location detection with OpenStreetMap
✅ Secure API with validation & error handling
✅ Modern UI animations and AI-powered intro video
✅ Fully deployed and production-ready

---

## ⚙️ Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/KhushalAcharya29/real-estate-app.git
cd real-estate-app
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:5173
```

Run locally:

```bash
npm run dev
```

Backend runs on: **[http://localhost:5000](http://localhost:5000)**

---

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env` file inside `/frontend`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Run frontend:

```bash
npm run dev
```

Frontend runs on: **[http://localhost:5173](http://localhost:5173)**

---

## 🧠 Developer Info

**Author:** Khushal Acharya
**Role:** Full-Stack Developer
**LinkedIn:** [linkedin.com/in/KhushalAcharya29](https://linkedin.com/in/KhushalAcharya29)
**GitHub:** [github.com/KhushalAcharya29](https://github.com/KhushalAcharya29)

---

## 📦 Deliverables Summary

✅ GitHub Repository — [RealEstate App Repo](https://github.com/KhushalAcharya29/real-estate-app)
✅ Hosted Live Demo — Render (frontend + backend)
✅ Setup Instructions — Provided in this README

---

## 🏁 Notes

This project demonstrates:

* Clean code structure
* Secure production-level configuration
* Real-world deployment experience

The app is fully functional and deployable out-of-the-box.

---

✨ *"A project that combines design thinking, automation, and scalability — RealEstate Pro."* ✨
