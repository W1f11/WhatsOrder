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
import SpecialMenu from   "./pages/SpecialMenu";
import About from './pages/About';


function App() {
  const location = useLocation();
  const [isCartOpen, setCartOpen] = useState(false);

  const noHeroFooterPages = ['/profile', '/login', '/register', '/checkout'];
  const showHeroFooter = !noHeroFooterPages.includes(location.pathname);

  return (
    <>
      {location.pathname === '/' && (
        <Header onCartClick={() => setCartOpen((s) => !s)} />
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />

      {showHeroFooter && <Hero />}

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<MenuList />} />
          <Route path="/menu/:id" element={<MenuItemDetail />} />
          <Route
            path="/restaurant/:id"
            element={
              <RestaurantDetail onCartClick={() => setCartOpen((s) => !s)} />
            }
          />
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

      {/* 👉 SpecialMenu s'affiche uniquement sur la Home */}
      {location.pathname === '/' && <SpecialMenu />}
      {location.pathname === '/' && <About />}

      {showHeroFooter && <Footer />}
    </>
  );
}

export default App;