import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './Login.tsx'
import Signup from './Signup.tsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import AuthRoute from './AuthRoute.tsx'


const firebaseConfig = {
  apiKey: "AIzaSyBKGyqYJZ98u8lBCrdGF5cXAObq66qYLEs",
  authDomain: "project-5a41c.firebaseapp.com",
  projectId: "project-5a41c",
  storageBucket: "project-5a41c.firebasestorage.app",
  messagingSenderId: "117040046097",
  appId: "1:117040046097:web:dc47ead025668987ef91b0",
  measurementId: "G-R22X4P5NMB"
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute><App /></AuthRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
)
