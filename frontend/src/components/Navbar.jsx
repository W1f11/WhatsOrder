import React from "react";
import Logo from "../assets/Fauget.png";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Navbar({ onCartClick }) {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const handleClick = () => {
    if (typeof onCartClick === "function") return onCartClick();
    return navigate("/cart");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#FFDCDC] shadow-md flex justify-between items-center px-6 py-3 z-50">

      {/* Logo */}
      <div className="cursor-pointer" onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo" className="h-12" />
      </div>

      {/* Center Links */}
      <ul className="flex gap-6 text-[18px] font-semibold">
        <li>
          <a href="/" className="nav-link">Accueil</a>
        </li>
        <li>
          <a href="#restaurants-container" className="nav-link">Restaurant</a>
        </li>
        <li>
          <a href="/" className="nav-link">Menu</a>
        </li>
        {/* Cart Icon */}
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
  );
}

export default Navbar;
