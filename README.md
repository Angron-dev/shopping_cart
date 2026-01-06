# Laravel + React (Inertia) Shop – Recruitment Project

This repository contains a **recruitment / technical assignment project** built with **Laravel (backend)** and **React + TypeScript (frontend)** using **Inertia.js**.

The goal of this project is to demonstrate:

* clean backend architecture
* transactional business logic
* proper frontend state handling
* secure authentication flows
* meaningful automated tests

---


## 🧰 Tech Stack

### Backend

* PHP 8.2+
* Laravel 10+
* SQLite / MySQL
* Eloquent ORM
* PHPUnit (Feature & Unit tests)
* Mail notifications

### Frontend

* React
* TypeScript
* Inertia.js
* Tailwind CSS
* Vite

---

## 📦 Implemented Features

* 📋 Product listing endpoint (read-only)
* 🛒 Client-side cart stored in `sessionStorage`
* 🔢 Quantity control with stock validation
* 💳 Purchase process using database transactions
* 📉 Automatic stock decrement with row locking
* ✉️ Email notification when product stock is low
* 🔐 Secure logout using POST + CSRF protection
* 🧪 Backend feature tests covering critical flows

---

## 🚀 Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-repo/shopping_cart.git
cd shop
```

---

### 2️⃣ Backend setup (Laravel)

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure database in `.env` (example using SQLite):

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

```bash
touch database/database.sqlite
php artisan migrate
php artisan db:seed
```

---

### 3️⃣ Frontend setup (React)

```bash
npm install
npm run dev
```

---

### 4️⃣ Run the application

```bash
php artisan serve
```

Application URL:

```
http://127.0.0.1:8000
```

---

## 🧪 Testing Strategy

Backend tests focus on **business-critical flows** rather than trivial getters.

### Run all tests

```bash
php artisan test
```

### Covered scenarios

* product listing endpoint
* purchase request validation
* database transaction integrity
* stock decrement logic
* insufficient stock handling
* low-stock email notifications
* HTTP method restrictions

Feature tests are preferred for controller behavior to ensure realistic request–response coverage.

---

## 🧠 Architectural Notes

* Controllers are kept thin and focused on HTTP concerns
* Business logic can be extracted into Service classes if the domain grows
* Database operations are wrapped in transactions
* Concurrency is handled using row-level locks (`lockForUpdate`)
* Frontend components are fully typed using TypeScript

---

## 📁 Project Structure

```
app/
 ├── Http/Controllers
 ├── Models
 ├── Mail
 ├── Repository
resources/
 ├── js/
 │   ├── Components
 │   ├── Pages
 │   └── app.tsx
tests/
 ├── Feature
 └── Unit
```

---

## 👤 Author

WK

Built with **Laravel + React + TypeScript**
