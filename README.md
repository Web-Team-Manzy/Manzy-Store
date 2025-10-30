# Manzy Store

## Introduction

**Manzy Store** is a website specializing in selling clothing and fashion accessories, designed to provide customers with convenience and the best online shopping experience.

## About Us

Welcome to our online clothing store! We believe fashion should be both stylish and affordable. Whether you’re looking for casual wear, office attire, or a special outfit for an event, we offer a wide variety of options to suit your needs.

Our mission is to provide high-quality clothing at prices that won’t break the bank. We take pride in offering the latest trends in fashion to help you stay ahead.

## Team

- 21120515 - Tran Phuoc Nhan
- 22120203 - Do Tien Manh
- 22120216 - Bui Tan Thanh Nam
- 22120217 - Hoang Le Nam

## Score Sheet

https://drive.google.com/file/d/1eedIMLROy3VSwIEVejKNUk6AvbDj5Ma5/view?usp=sharing

## Project Summary

This repository contains a multi-service e-commerce project developed as a course assignment. It includes:

- `fe/` - public storefront (React + Vite)
- `admin/` - admin panel (React + Vite)
- `be/` - main backend API (Node.js + Express + MongoDB)
- `payment_system/` - payment & reconciliation microservice

---

## Table of Contents

- Features
- Tech stack
- Project structure
- Prerequisites
- Installation & Run (per component)
- Environment variables
- Development notes
- Database & Migrations
- Tests
- Deployment
- Contributing
- Known issues & Next steps
- Contact

## Features

- Customer-facing features: browse products, search, add to cart, checkout, order tracking, profile management.
- Admin features: product management, category management, order management, transactions, statistics, and user management.
- Separate payment service for transaction processing and reconciliation.
- JWT authentication, image upload (Cloudinary), email notifications (SMTP/email service).

## Tech stack

- Frontend (Public): React, Vite, Tailwind CSS
- Frontend (Admin): React, Vite, Tailwind CSS
- Backend API: Node.js, Express
- Database: MongoDB (Mongoose)
- Authentication: JWT
- Payment: internal payment microservice

## Project structure (overview)

At the repository root you will find four sub-projects:

- `fe/` — Public client (React)
- `admin/` — Admin panel (React)
- `be/` — Backend API server (Express + Mongoose)
- `payment_system/` — Payment & reconciliation service

Each sub-project contains its own `package.json` and run/build scripts.

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image uploads)

## Installation & Run

Run each service in its own terminal. Example PowerShell steps below (adjust if you use different scripts):

```powershell
# Public storefront
cd .\fe
npm install
npm run dev

# Admin panel
cd ..\admin
npm install
npm run dev

# Backend API
cd ..\be
npm install
# Check package.json for the correct script (start or dev)
npm start

# Payment service
cd ..\payment_system
npm install
npm start
```

Note: Verify each `package.json` for exact script names (`dev`, `start`, `build`).

## Environment variables (examples)

Create `.env` (or `.env.development`) in each sub-project. Example variables commonly required:

- For `be/` (backend) - `.env`:

```text
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/manzy
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud
CLOUD_API_KEY=...
CLOUD_API_SECRET=...
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email
SMTP_PASS=yourpassword

# Payment integration keys if any
PAYMENT_API_KEY=...
```

- For `payment_system/` - `.env`:

```text
PORT=7000
MONGODB_URI=...
JWT_SECRET=...
# other payment-specific config
```

- For `fe/` and `admin/` (frontend) - `.env.development` or `.env`:

```text
VITE_API_URL=https://localhost:5000/api
VITE_CLOUDINARY_NAME=...
```

Note: Vite exposes variables prefixed with `VITE_` to client-side code.

## Development notes

- SSL keys are included in `sslkeys/` (`cert.pem`, `key.pem`) and can be used for local HTTPS.
- Run services in parallel on different ports (e.g. backend 5000, payment 7000, Vite dev servers 5173/5174).
- Update API base URLs in `fe/customize/axios.js` and `admin/customize/axios.js` if needed.

## Database & Migrations

- The project uses Mongoose for MongoDB; schemas are in `be/src/app/models/`.
- There is no formal migration system; consider adding seeders or a migration tool for production.

## Tests

- There are currently no automated tests included. It is recommended to add unit/integration tests for backend and payment services.

## Deployment

- Frontend: run `npm run build` in `fe/` and `admin/` and deploy static assets to Vercel, Netlify, Render, or a static hosting service.
- Backend & Payment services: deploy `be/` and `payment_system/` to a cloud provider (Heroku, Render, DigitalOcean, AWS, etc.). Ensure environment variables and secrets are configured.

## Contributing

- Fork the repository and create a feature branch (e.g. `feature/your-change`).
- Open a pull request with a clear description of changes.
- Follow the ESLint configuration included in each project.

## Known issues & Next improvements

- Add test coverage for backend services.
- Add database seeders/fixtures for easy local setup.
- Add CI (lint/test/build) for automated checks on push.

## Contact

- Email: support@manzystore.com
- Demo site: https://manzy-store-38lv.onrender.com

---

If you want me to expand any section (for example: list main API endpoints from the backend code, extract actual `.env` keys used by the codebase, or provide step-by-step deploy instructions for a specific platform), tell me which part to focus on and I will update the README accordingly.
