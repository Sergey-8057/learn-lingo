# LearnLingo

## 📚 Project Description

**LearnLingo** is a web application for a company that offers online language learning services with professional teachers.

The application consists of three main pages:

* **Home** – presents the company’s advantages and encourages users to start using the service.
* **Teachers** – displays a list of available language teachers with detailed information and pagination.
* **Favorites** – a private page where authorized users can view teachers they have added to their favorites.

---

## 🚀 Features

* User registration and authentication (Firebase Auth)
* Teachers list with detailed teacher cards
* Pagination with **Load more** functionality
* Add / remove teachers from **Favorites**
* Protected routes for authorized users
* Modal windows
* Book a trial lesson
* Data storage using **Firebase Realtime Database**

---

## 🛠 Tech Stack

* **Next.js 13** (App Router)
* **TypeScript**
* **React 19**
* **Firebase** (Authentication & Realtime Database)
* **CSS Modules**
* **React Context API**
* **clsx**
* **react-hot-toast**
* **react-hook-form + yup** (form validation)

---

## 📦 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/learn-lingo.git
cd learn-lingo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file in the project root and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the project locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

The project is deployed using **GitHub Pages**.

🔗 **Live Demo:** *link will be added after deployment*

---

## 🖼 Screenshots

*Screenshots will be added here*

---

## 👤 Author

**Serhii Shevchenko**
Junior Frontend Developer

---

## 📄 License

This project is created for educational purposes.
