# 📱 WhatsApp Web-like Real-Time Chat

A full-stack chat application inspired by **WhatsApp Web**, featuring:

- **Real-time messaging** with [Socket.IO](https://socket.io)
- **MongoDB** message storage
- **REST API** for message history
- **Vercel** deployment for the frontend
- **Render** deployment for the backend
- Clean WhatsApp-style UI built with **React + TailwindCSS**
- Grouped messages by date with delivery/read indicators

---

## 🚀 Features

- **Real-time** inbound & outbound messages via WebSockets
- **Persistent** message storage in MongoDB
- **Date-based grouping** of chat history
- **Mobile responsive** WhatsApp-like interface
- **Message status indicators** (Sent ✅, Delivered ✅✅, Read ✅✅ in blue)
- **Separate** backend and frontend deployments

---

## 📂 Project Structure

root/
├── backend/ # Express + MongoDB + Socket.IO
├── frontend/ # React + Vite + TailwindCSS
├── README.md

yaml
Copy
Edit

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Zustand (state management)
- Axios
- Socket.IO client

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.IO
- CORS

---

## ⚙️ Installation

**1️⃣ Backend Setup:**
```bash
-cd backend
-npm install
-Create .env in backend/:

Env file(For bckend)


PORT=5000
MONGO_URI=your_mongodb_uri
CLIENT_URL=https://your-frontend.vercel.app
Run locally:



```bash
npm start
2️⃣ Frontend Setup
cd frontend
npm install
Create .env in frontend/:

env
VITE_API_BASE_URL=https://your-backend.onrender.com
Run locally:

```bash

npm run dev
🌐 Deployment
Frontend (Vercel)
Push your frontend code to GitHub.

Connect the repo to Vercel.

Add Environment Variable:

VITE_API_BASE_URL=https://your-backend.onrender.com

Deploy.
Backend (Render)
Push your backend code to GitHub.

Create a new Web Service on Render.

Add Environment Variables:

MONGO_URI=your_mongodb_uri
CLIENT_URL=https://your-frontend.vercel.app
Deploy.

🔗 Live Demo
Frontend: https://your-frontend.vercel.app
Backend: https://your-backend.onrender.com

📜 License
MIT License © 2025

📊 Architecture Diagram

 ┌───────────────────┐       WebSocket + REST       ┌───────────────────┐
 │   Frontend (Vercel)│  <----------------------->  │ Backend (Render)  │
 │ React + Tailwind   │                             │ Node + Express    │
 └───────────────────┘                             └───────────────────┘
             ▲                                               │
             │                                               │
             │                MongoDB Atlas                  │
             └----------------------------------------------->│
Flow:

Frontend fetches chat history from Backend via REST API.

Messages are sent via WebSocket for real-time updates.

Backend stores messages in MongoDB.

Incoming messages are broadcast to relevant users instantly.

