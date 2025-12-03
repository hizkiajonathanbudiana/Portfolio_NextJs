# HIZKIA — Brutalist Portfolio Architecture

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

## ⚡ Executive Summary

**Portfolio-Brutalism** is a high-performance, database-driven web application tailored for interaction designers. It rejects the traditional "Static Site" approach in favor of a **"Database-First" Architecture**, enabling real-time content management without code deployment.

The system features a bespoke **CMS (Content Management System)** built directly into the application, secured by Role-Based Access Control (RBAC), and powered by a bleeding-edge stack (Next.js 16 + React 19).

## 🚀 Key Capabilities

### 🎨 Frontend Experience
* **Digital Brutalism Aesthetic:** Raw data exposure, visible structural grids, and monochromatic contrast.
* **Immersive 3D Hero:** Integrated Three.js (`@react-three/fiber`) scene controlled via CMS parameters.
* **ISR (Incremental Static Regeneration):** Ultra-fast page loads with background data revalidation.
* **Adaptive Layout:** Fluid grid system designed with Tailwind v4.

### 🛠 CMS Dashboard (Admin Panel)
* **Singleton Content Managers:** Dedicated editors for unique pages (Home, About, CV, Settings).
* **Collection Managers:** Full CRUD capabilities for Portfolio Projects.
* **Global Configuration:** Dynamic control over SEO Metadata (`<title>`, OpenGraph) and Navigation Links.
* **System Integrity:**
    * **Backup Engine:** One-click JSON database dump for disaster recovery.
    * **Showcase Mode:** Sandbox environment for guest visitors (Write operations blocked).

## 🛠 Technology Stack

| Category | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `16.0.6` | App Router Architecture |
| **UI Engine** | React | `19.2.0` | Concurrent features, Server Components |
| **Styling** | Tailwind CSS | `v4.0` | Next-gen utility engine |
| **3D Graphics** | Three.js / R3F | `0.181` | WebGL abstraction layer |
| **Database** | MongoDB | `9.0` | NoSQL Document Store (Mongoose ODM) |
| **Auth** | NextAuth.js | `4.24` | Middleware-based session management |
| **Storage** | Cloudinary | *API* | Optimized asset delivery network |

## ⚙️ Installation & Deployment

### 1. Prerequisites
Ensure you have Node.js 18+ installed.

### 2. Clone & Install
```bash
git clone https://github.com/hizkiajonathanbudiana/Portfolio_NextJs.git
cd Portfolio_NextJs
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```bash
# --- DATABASE ---
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio_brutalism

# --- AUTHENTICATION ---
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# --- ASSETS (CLOUDINARY) ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

```

### 4. Running Local Development
```bash
npm run dev
```

Public Site: http://localhost:3000  
CMS Login: http://localhost:3000/cms/login

## 📂 Architecture Overview

```
├── app/
│   ├── api/            # Serverless Functions (REST Endpoints)
│   ├── cms/            # Protected Admin Routes (Layout & Dashboard)
│   ├── (public)/       # Public Facing Routes (SSR/ISR)
│   ├── layout.js       # Root Layout (Metadata Injection & Providers)
│   └── sitemap.js      # Dynamic XML Sitemap Generator
├── components/         # Atomic UI Components
├── lib/
│   ├── data.js         # Server-Side Data Fetching Layer (Cached)
│   └── mongodb.js      # Database Connection Singleton
├── models/             # Mongoose Schemas (Singletons & Collections)
└── public/             # Static Assets
```

---

# Concept Design & Architecture Document

## 1. Design Philosophy: "System Over Decoration"

The visual language of this project adheres to the principles of **Digital Brutalism**. Instead of hiding the underlying structure with decorative elements, gradients, or shadows, this system exposes it.

### Core Pillars:
1. **Honesty of Material:**
    * The "Material" of the web is data.
    * The CMS Dashboard is not hidden behind generic UI; it is stylized to look like a terminal or system diagnostic tool.
    * Loading states, database coordinates, and system status are displayed prominently as part of the aesthetic.

2. **Functionality as Aesthetic:**
    * High-contrast typography ensures maximum readability.
    * Strict borders define content areas, mimicking architectural blueprints.
    * Interactions are sharp and instant.

---

## 2. Technical Architecture Strategy

### A. The "Database as Source of Truth" Pattern
Unlike Static Site Generators (SSG) where content is locked in code, or Headless CMS setups that require third-party subscriptions, this project uses a **Self-Hosted Database Architecture**.

* Every piece of text—from the Navbar Logo (`siteName`) to the footer credits—is fetched dynamically from MongoDB.
* The site owner has full control via the CMS without redeploying code.

### B. Data Modeling: Singleton vs. Collection

| Pattern | Use Case | Model Example | Behavior |
| :--- | :--- | :--- | :--- |
| **Singleton** | Unique Pages | `Home`, `About`, `GlobalSettings`, `Resume` | Always one document via `upsert` logic. |
| **Collection** | Repeatable Items | `Project` | Standard CRUD logic. |

### C. The CMS Ecosystem

* Shares the same component library as the public site.
* Dark technical theme for backend.
* Middleware validates session against `ADMIN_EMAIL`.
* Showcase Mode blocks write operations and returns `401`.

---

## 3. SEO & Discovery Engineering

1. Dynamic Metadata via `app/layout.js` querying `GlobalSettings` and revalidating every 60s.
2. Dynamic XML sitemap via `app/sitemap.js` based on routes and project slugs.

---

## 4. Future Scalability Roadmap

* Analytics integration with MongoDB aggregation.
* Multi-tenancy support.
* Theme Engine based on database-driven CSS.

---

## 📄 License

MIT License © 2025 Hizkia Weize.