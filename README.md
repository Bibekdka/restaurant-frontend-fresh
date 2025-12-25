# Restaurant Frontend - Fine Dining App

A modern restaurant web application built with React and Vite, featuring user authentication, menu browsing, and review system.

## 🚀 Features

- **User Authentication:** Firebase-based login and signup
- **Dynamic Menu:** Browse restaurant menu with real-time data
- **Review System:** Users can add and view reviews
- **Admin Dashboard:** Manage products, orders, and users
- **Responsive Design:** Mobile-friendly interface
- **Image Upload:** Cloudinary integration for image management

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Authentication:** Firebase Auth
- **Backend API:** Node.js/Express (deployed on Render)
- **Database:** MongoDB
- **Image Storage:** Cloudinary
- **Deployment:** Netlify

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-frontend-stable
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=https://bckend12345.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🚀 Deployment

This project is configured for Netlify deployment. The `netlify.toml` file contains the build configuration.

### Environment Variables (Netlify)

Make sure to set the following environment variables in your Netlify dashboard:
- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`

## 📁 Project Structure

```
restaurant-frontend-stable/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utility libraries (API, Firebase)
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/            # Static assets
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
├── netlify.toml       # Netlify deployment config
└── package.json       # Dependencies and scripts
```

## 🔗 Related Repositories

- **Backend Repository:** [bckend12345](https://github.com/Bibekdka/bckend12345)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 Live Demo

- **Frontend:** [https://risingsunmkm.netlify.app/](https://risingsunmkm.netlify.app/)
- **Backend API:** [https://bckend12345.onrender.com](https://bckend12345.onrender.com)

## 📄 License

This project is for educational and portfolio purposes.

---

**Note:** This repository contains only the frontend code. The backend has been separated into its own repository for better maintainability and deployment flexibility.
