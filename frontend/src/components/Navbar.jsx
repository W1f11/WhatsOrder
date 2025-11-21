import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"; // <- correct import
import { useNavigate } from "react-router-dom";

function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#FFDCDC] shadow-md flex justify-between items-center px-6 py-3 z-50">
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        MyRestaurant
      </div>

      <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
        <FontAwesomeIcon icon={faCartShopping} size="lg" /> {/* <- use imported icon */}
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#568F87] text-white text-xs font-bold rounded-full px-2">
            {cartItems.length}
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
