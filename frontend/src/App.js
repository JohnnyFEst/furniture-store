import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FurnitureList from './components/Furniture/FurnitureList';
import FurnitureDetail from './components/Furniture/FurnitureDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import ShoppingCart from './components/Cart/ShoppingCart';
import Navbar from './components/Navbar';
import { AuthProvider } from './hooks/useAuth';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/furniture" element={<FurnitureList />} />
            <Route path="/furniture/:id" element={<FurnitureDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<ShoppingCart />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;