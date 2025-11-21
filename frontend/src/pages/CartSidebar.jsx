import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../features/cart/cartSlice";

export default function CartSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let message = "";
  items.forEach((item) => {
    message += `${item.name} x${item.quantity} = ${item.price * item.quantity} DH\n`;
  });

  const whatsappUrl = `https://wa.me/212699425135?text=${encodeURIComponent(
    `Commande:\n${message}\nTotal: ${total} DH`
  )}`;

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "overlay-visible" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <h1 style={{  marginTop: "80px", color: "#5c8a7d", fontSize: "25px", fontWeight: "bold" }}>Mon Panier</h1>

        {items.length === 0 ? (
          <p >Votre panier est vide.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <h2>{item.name}</h2>
                    <p className="price">{item.price} DH</p>

                    <div className="quantity-controls">
                      <button
                        disabled={item.quantity === 1}
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="remove-btn"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">Total : {total} DH</div>

            <button
              onClick={() => window.open(whatsappUrl, "_blank")}
              className="btn-whatsapp"
            >
              Commander via WhatsApp
            </button>

            <button
              onClick={() => dispatch(clearCart())}
              className="btn-clear"
            >
              Vider le panier
            </button>
          </>
        )}
      </div>
    </>
  );
}
