# 🚀 LeadGen CRM - Lead Generation Tool

A modern Lead Management CRM system built with React, Node.js, Express, and MySQL.

## 📌 Features

### 🔐 Authentication
- User Login
- JWT Authentication
- Role based access

### 🔍 Lead Generation
- Google Business Search API Integration
- Search businesses by keyword and city
- Save leads
- Duplicate lead prevention

### 📋 Lead Management
- Saved Leads DataTable
- Lead Status Tracking

Statuses:
- New
- Contacted
- Qualified
- Proposal
- Won
- Lost

### 📝 CRM Features
- Add Notes
- Follow-up Date
- Today Followups
- Search Saved Leads
- Export Leads CSV

### 📊 Analytics
- Total Leads Count
- Status Wise Lead Reports
- Conversion Rate

### ⚙️ Settings
- Profile Settings
- CRM Configuration

### 📱 Responsive Design
- Mobile Responsive Layout
- Hamburger Sidebar Navigation

---

## 🛠️ Tech Stack

### Frontend
- React JS
- Vite
- Tailwind CSS
- PrimeReact DataTable
- React Icons
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL (Supabase)
- JWT
- bcrypt

## Database
-  PostgreSQL (Supabase)

### APIs
- Google Places API

## Deployment
- Render
- Vercel

## Version Control
- Git
- GitHub
---

## 📂 Project Structure
lead_generation_tool/

├── client/
│ ├── src/
│ └── package.json
│
└── server/
├── routes/
├── controllers/
├── server.js
├── db.js
└── package.json

---

## ⚙️ Installation

### Frontend

```bash
cd client

npm install

npm run dev


cd server

npm install

npm start


🔑 Environment Variables

Create .env file inside server:

PORT=5000

GOOGLE_API_KEY=your_google_api_key

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=leadcrm


👨‍💻 Developer

Moorthi Web Studio

© 2026
