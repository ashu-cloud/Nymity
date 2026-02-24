
# 🤫 Nymity - Production-Grade Anonymous Messaging

> An advanced, real-time SaaS platform that empowers users to receive unfiltered, encrypted anonymous feedback via unique public profile links.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pusher](https://img.shields.io/badge/Pusher-Real--Time-violet?style=for-the-badge)

## 🌐 Live Demo

**Experience the platform live:** [nymity.vercel.app](https://your-deployment-link-goes-here.com) *(Replace with your actual Vercel/live link)*

*Tip: Create a test account or use the Google/GitHub OAuth login to generate your own secret link and test the real-time dashboard!*

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [System Architecture & Performance](#-system-architecture--performance)
- [Tech Stack](#-tech-stack)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Environment Variables Guide](#-environment-variables-guide)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About the Project

**Nymity** solves the problem of constrained communication by providing a secure, beautifully designed space for honest feedback. Whether for content creators, professionals seeking peer reviews, or friends, Nymity generates unique, shareable links that act as a secure dropbox for anonymous messages. 

Built with scalability and modern UX in mind, this project goes beyond a basic CRUD app by implementing real-time WebSocket synchronization, intelligent client-side caching, and robust OAuth flows.

---

## ✨ Key Features

* **Event-Driven Real-Time Dashboard:** Powered by **Pusher**, incoming messages instantly bypass the network polling lifecycle and are injected directly into the user's view with zero latency.
* **Multi-Provider Authentication:** Secure onboarding utilizing **NextAuth.js**. Supports seamless OAuth integration (Google & GitHub) alongside traditional, bcrypt-hashed credential logins.
* **Optimistic UI:** Settings toggles (e.g., disabling message reception) and message deletions execute instantly on the client side while asynchronously syncing with the database, ensuring a frictionless user experience.
* **Glassmorphism UI:** A highly responsive, modern dark-mode interface built purely with Tailwind CSS, featuring custom mesh gradients and smooth state transitions.

---

## ⚡ System Architecture & Performance

To ensure the application remains performant even under heavy load, several senior-level architectural patterns were implemented:

1. **Stale-While-Revalidate (SWR):** Raw `useEffect` and `axios` fetching was replaced with Vercel's SWR. This provides automatic caching, background refetching, and eliminates loading spinners when navigating between the profile and dashboard.
2. **Frontend Array Chunking:** Rendering hundreds of message cards simultaneously causes severe DOM bloat and main-thread freezing. Nymity implements a strict pagination system, rendering messages in chunks of 12 with a "Load More" intersection pattern.
3. **Atomic Database Operations:** The backend utilizes MongoDB's `$push` atomic operators instead of full-document saves, dramatically reducing network payload size and bypassing legacy document validation errors.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **State & Caching:** SWR (Stale-While-Revalidate)
* **Forms & Validation:** React Hook Form, Zod

### Backend & Database
* **API:** Next.js Serverless Route Handlers
* **Database:** MongoDB
* **ORM/ODM:** Mongoose
* **Authentication:** NextAuth.js v4, bcryptjs
* **Real-Time:** Pusher Channels

---

## 🏃 Getting Started (Local Setup)

Follow these steps to get a local development environment up and running.

### 1. Prerequisites
* Node.js (v18.17.0 or higher)
* NPM or Yarn
* Git

### 2. Installation
Clone the repository and install the dependencies:

```bash
git clone [https://github.com/your-username/nymity.git](https://github.com/your-username/nymity.git)
cd nymity
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory. You must populate it with the keys outlined in the **Environment Variables Guide** below.

### 4. Run the Application

Start the Next.js development server:

```bash
npm run dev

```

Navigate to `http://localhost:3000` to view the application.

---

## 🔐 Environment Variables Guide

Your `.env` file should look exactly like this:

```env
# MONGODB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nymity

# NEXTAUTH
NEXTAUTH_SECRET=your_super_secret_string_here
NEXTAUTH_URL=http://localhost:3000

# OAUTH PROVIDERS
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret

# PUSHER (REAL-TIME)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret

```

### Where to find these keys:

* **MONGODB_URI:** Sign up for [MongoDB Atlas](https://www.mongodb.com/atlas/database), create a free M0 cluster, configure a database user, and retrieve the connection string.
* **NEXTAUTH_SECRET:** Run `openssl rand -base64 32` in your terminal to generate a secure random string.
* **GOOGLE OAUTH:** Navigate to the [Google Cloud Console](https://console.cloud.google.com/). Create a project > APIs & Services > Credentials. Create an OAuth Client ID. Set the Authorized Redirect URI to `http://localhost:3000/api/auth/callback/google`.
* **GITHUB OAUTH:** Navigate to your GitHub Settings > Developer Settings > OAuth Apps. Create a new app and set the Authorization Callback URL to `http://localhost:3000/api/auth/callback/github`.
* **PUSHER:** Create an account at [Pusher.com](https://pusher.com/). Create a new Channels app and navigate to "App Keys" to retrieve your cluster, key, app ID, and secret.

---

## 📁 Project Structure

```text
nymity/
├── src/
│   ├── app/                 # Next.js App Router (Pages & API Routes)
│   │   ├── (app)/           # Protected routes (Dashboard)
│   │   ├── (auth)/          # Authentication routes (Sign-in, Sign-up)
│   │   ├── api/             # Serverless backend routes (Messages, Auth, Pusher)
│   │   └── u/[username]/    # Public profile dynamic route
│   ├── components/          # Reusable React components (UI, Forms, Cards)
│   ├── lib/                 # Utility configurations (MongoDB, Pusher Client/Server)
│   ├── model/               # Mongoose Database Schemas (User, Message)
│   ├── schemas/             # Zod validation schemas
│   └── types/               # TypeScript interfaces and type definitions
├── public/                  # Static assets
├── .env                     # Environment variables (Ignored by Git)
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Project dependencies and scripts

```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

```

```
