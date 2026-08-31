# BlogSphere - Modern Full-Stack Blog Platform with Comments

A modern blogging platform built with **Node.js, Express, Prisma ORM, SQLite, and React + Tailwind CSS**.

## ✨ Key Features

- 🔐 **User Registration, Login & Authentication**: Secure JWT-based auth with bcryptjs password encryption.
- 📝 **Full Blog Post CRUD**: Create, read, edit, and delete articles with custom markdown formatting, categories, tags, and cover images.
- 💬 **Interactive Comments**: Engage in discussions, leave feedback, and delete/moderate comments.
- ❤️ **Post Like & Reaction System**: Real-time like toggle with animated visual feedback.
- 🔍 **Search & Category Filtering**: Discover posts by keyword, tags, category pills, or sorting (Latest, Top Liked, Most Read).
- 📊 **Author Dashboard**: View personal article metrics (views, likes, comments) and manage posts.
- ⚡ **Zero-Config Database**: Self-contained SQLite database managed via Prisma ORM with realistic seed data pre-populated.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies & Seed Database
```bash
# In client folder:
cd client
npm install

# In server folder:
cd ../server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 2. Run the Application
From the root directory:
```bash
node start.js
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 👤 Sample Demo Accounts

| Name | Email / Username | Password | Role |
|------|------------------|----------|------|
| Sarah Jenkins | `sarah@example.com` / `sarahj` | `password123` | Author / Admin |
| Alex Rivera | `alex@example.com` / `alexr` | `password123` | Author |
| Demo Explorer | `demo@blog.com` / `demouser` | `password123` | Member |

*(Or click the 1-Click Demo Login buttons directly on the Sign In page!)*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios
- **Backend**: Express.js, JSON Web Tokens (JWT), bcryptjs, Morgan, CORS
- **Database & ORM**: SQLite, Prisma Client ORM

Live Demo Link : https://blog-platform-xvi2.onrender.com
