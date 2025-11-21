import React from "react";
import { useSelector } from "react-redux";

const Header = ({ onCartClick }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="header">
      <div className="logo">
        <img
          src="/images/logo.png"
          alt="Logo"
        />
      </div>

      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <a href="/" className="nav-link">Accueil</a>
          </li>
          <li>
            <a href="#restaurants-container" className="nav-link">Restaurant</a>
          </li>
          <li>
            <a href="/" className="nav-link">Menu</a>
          </li>
          <li>
            <button className="nav-link cart-link" onClick={onCartClick}>
              <i className="fas fa-shopping-cart"></i>
              {totalQty > 0 && (
                <span className="cart-badge">{totalQty}</span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;