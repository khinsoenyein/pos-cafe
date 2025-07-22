# Laravel 12 + React POS & Inventory Management System

This is a starter kit project built with **Laravel 12** and **React (with Inertia.js)** for a **Point-of-Sale (POS) and Inventory Management System**, supporting multiple shops and products.

---

## 🚀 Features

* Laravel 12 + React (with TypeScript, TailwindCSS, ShadCN UI)
* Inertia.js SPA
* Manage multiple shops
* Products with images
* Shop-specific product prices
* Ingredients
* Shop-specific ingredient stock leavel
* Inventory management
* Reusable and responsive UI components
* Dialogs for Add/Edit actions
* Server-side validation + error display
* Toast notifications via `sonner`

---

## 🛠 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/khinsoenyein/pos-cafe.git
cd pos-cafe
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install JS dependencies

```bash
npm install
```

### 4. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and configure your DB credentials.

### 5. Run migrations

```bash
php artisan migrate
```

### 6. Start development servers

```bash
php artisan serve
npm run dev
```

Open your browser to: `http://localhost:8000`

---

## 📁 Project Structure

* `app/Models/` – Laravel models
* `app/Http/Controllers/` – Laravel controllers
* `resources/js/Pages/` – React pages via Inertia.js
* `resources/js/components/` – Shared UI components (e.g. buttons, dialogs)
* `resources/views/` – Blade entry points
* `storage/app/public/` – Uploaded images (linked via symlink)

---

## 📦 Key Packages

* [Laravel 12](https://laravel.com/)
* [React](https://reactjs.org/)
* [Inertia.js](https://inertiajs.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [ShadCN UI](https://ui.shadcn.dev/)
* [Sonner](https://sonner.emilkowal.ski/) – Toast notifications

---

## 🖼 Image Uploads

* Product images are uploaded via `<input type="file">`
* Stored in `storage/app/public/products`
* Symlink with: `php artisan storage:link`
* Only image name is stored in DB

---

## 📝 Notes

* Use `formatNumber()` for price display
* Use `formatDate()` (or dayjs) for timestamp formatting
* Shop-product assignments use a pivot table `product_shop`

---

## 🤝 Contributing

Feel free to contribute with suggestions!

---
