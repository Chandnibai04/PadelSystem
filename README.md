# 🎾 Padel Court Booking & Management System

An enterprise-grade, full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to streamline the entire reservation lifecycle for sports facilities. It features dedicated, role-secured portals for regular users, on-site counter staff, and system administrators, coupled with real-time scheduling logic and secure payment processing.

---

## 🚀 Live Demo & Links

* **Frontend App (Vercel):** [right now few issue going on the code producion side ]
* **Backend API (Vercel):** (https://padel-backend-tau.vercel.app/)

---

## 🛠️ Tech Stack & Architecture

### Frontend
* **React.js** (Component-driven UI architecture)
* **React Router DOM** (Client-side routing & protected route guards)
* **Tailwind CSS** (Responsive, modern utility-first styling)
* **Date-fns** (Advanced date and time manipulation)

### Backend
* **Node.js** & **Express.js** (RESTful API architecture)
* **MongoDB & Mongoose** (NoSQL database modeling with atomic transaction checks)
* **JSON Web Tokens (JWT)** & **Bcryptjs** (Secure authentication and password hashing)
* **Stripe API** (Secure online payment gateway integration)
* **Nodemailer** (Asynchronous, template-based transactional email automation)

---

## ⚙️ Key Modules & System Features

1. **Client Booking Portal:**
   * Live court availability checking and dynamic pricing calculator.
   * Seamless multi-step booking form with real-time slot validation.
   * Instant digital receipt generation with built-in printing support.

2. **Counter / Front-Desk Portal (POS & Walk-ins):**
   * A specialized, fast-paced interface built for on-site staff to handle walk-in reservations, manage daily schedules, and process immediate cash/offline settlements.

3. **Admin Dashboard:**
   * Centralized management panel for tracking system-wide revenue, managing court listings, reviewing booking logs, and maintaining system data.

4. **Security & Integrations:**
   * Robust CORS configuration and global error-handling middleware.
   * Automated email receipts and booking confirmations dispatched instantly via Nodemailer.

---

## 📂 Project Structure

```text
padel-system/
├── padel-Backend-main/         # Backend Express Application
│   ├── src/
│   │   ├── controllers/        # Business logic controllers
│   │   ├── models/             # Mongoose schemas (User, Booking, Court)
│   │   ├── routes/             # API routing endpoints
│   │   └── index.js            # Server entry point
│   ├── package.json
│   └── .env.example
│
└── src/                        # Frontend React Application
    ├── components/             # Reusable UI components
    ├── pages/                  # Views (Booking, Payment, Receipt, Admin, Counter)
    └── App.jsx                 # Main application routing


1. Clone the Repository
Bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
2. Backend Setup
Bash
cd padel-Backend-main
npm install
Create a .env file inside the backend folder and add your environment variables:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
Start the backend development server:

Bash
npm run dev
3. Frontend Setup
Open a new terminal window, navigate to the root frontend directory, and run:

Bash
npm install
npm run dev
