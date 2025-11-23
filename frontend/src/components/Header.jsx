import React from "react";
import { useSelector } from "react-redux";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Header = ({ onCartClick }) => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof onCartClick === "function") return onCartClick();
    return navigate("/cart");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#FFDCDC] shadow-md flex justify-between items-center px-6 py-3 z-50">
      <div className="cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-12"
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
            <a href="/restaurant/26" className="nav-link">Menu</a>
          </li>
          <li>
            <button className="nav-link cart-link" onClick={handleClick}>
              <FontAwesomeIcon icon={faCartShopping} size="lg" />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </nav>
  );
};

export default Header;