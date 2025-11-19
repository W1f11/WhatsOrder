import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MenuList from "./pages/MenuList";
import MenuItemDetail from "./pages/MenuItemDetail";
import Login from './pages/Login'
import Register from './pages/Register'
import UserProfile from './pages/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import RestaurantDetail from './pages/RestaurantDetail'
import Cart from './pages/Cart'
import Checkout from "./pages/Checkout";
import ReservationForm from "./pages/ReservationForm";
import MyReservations from "./pages/MyReservations";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu" element={<MenuList />} />
        <Route path="/menu/:id" element={<MenuItemDetail />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path='/cart' element={<Cart/>}></Route>
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
  )
}

export default App
