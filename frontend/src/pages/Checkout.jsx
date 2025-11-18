import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import api from "../api/axios";
import { useState } from "react";

export default function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const restaurantPhone = "0699425135"; // Remplace par le numéro réel

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Le panier est vide.");

    setLoading(true);

    // Calcul du total
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Préparer payload pour backend
    const payload = {
      restaurant_id: 1, // Remplacer par l’id réel du restaurant
      items: cartItems.map((i) => ({
        menu_item_id: i.id,
        quantity: i.quantity,
      })),
      note: "",
    };

    try {
      // Envoyer la commande au backend
      await api.post("/orders", payload);

      // Générer message WhatsApp
      let message = "";
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        message += item.name + " x" + item.quantity + " = " + (item.price * item.quantity) + " DH\n";
      }

      // Ajouter le total à la fin
      message += "Total: " + total + " DH";

      // Créer le lien WhatsApp
      const url = "https://wa.me/" + restaurantPhone + "?text=" + encodeURIComponent(message);

      // Ouvrir WhatsApp
      window.open(url, "_blank");

      // Vider le panier
      dispatch(clearCart());

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Checkout</h1>

      {cartItems.length === 0 && <p>Votre panier est vide.</p>}

      {cartItems.length > 0 && (
        <>
          <ul className="mb-4">
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} x{item.quantity} = {item.price * item.quantity} DH
              </li>
            ))}
          </ul>

          <p className="font-bold mb-4">
            Total: {cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)} DH
          </p>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Envoi..." : "Commander via WhatsApp"}
          </button>

          {success && (
            <p className="mt-4 text-green-600 font-bold">
              Commande envoyée sur WhatsApp ✅
            </p>
          )}
        </>
      )}
    </div>
  );
}
