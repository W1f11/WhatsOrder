import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import MenuList from "./pages/MenuList";
import MenuItemDetail from "./pages/MenuItemDetail";
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from "./pages/Checkout";
import ReservationForm from "./pages/ReservationForm";
import MyReservations from "./pages/MyReservations";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CartSidebar from "./pages/CartSidebar"; // <-- NOUVEAU


function App() {
  const location = useLocation();
    const [isCartOpen, setCartOpen] = useState(false);


  return (
    <>
      {/* Header affiché uniquement sur la page Home */}
      {location.pathname === '/' && <Header onCartClick={() => setCartOpen((s) => !s)} />}
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <Hero />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/menu" element={<MenuList />} />
          <Route path="/menu/:id" element={<MenuItemDetail />} />

          <Route path="/restaurant/:id" element={<RestaurantDetail onCartClick={() => setCartOpen((s) => !s)} />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/reservation/new"
            element={
              <ProtectedRoute>
                <ReservationForm />
              </ProtectedRoute>
            }
          />

          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Footer affiché sur toutes les pages */}
      <Footer />
    </>
  );
}

export default App;
