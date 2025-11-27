import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import api from "../api/axios";
import { useState, useMemo } from "react";

export default function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Calculer le total des articles du panier
  const total = useMemo(() => {
    return cartItems.reduce((sum, i) => {
      const price = Number(i.price) || 0;
      const quantity = Number(i.quantity) || 1;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const restaurantPhone = "+212699425135"; // Numéro réel du restaurant

  // Fonction pour envoyer la commande
  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Le panier est vide.");

    setLoading(true);

    // Préparer les données pour le backend
    const payload = {
      restaurant_id: 1, // ID du restaurant réel
      items: cartItems.map((i) => ({
        menu_item_id: i.id,
        quantity: Number(i.quantity) || 1,
      })),
      note: "",
    };

    try {
      // Envoyer la commande au backend
      await api.post("/orders", payload);

      // Générer le message WhatsApp
      let message = "Votre commande a été enregistrée \n\n";
      cartItems.forEach((item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        message += `${item.name} x${quantity} = ${price * quantity} €\n`;
      });
      message += `Total: ${total} €`;

      //  Créer le lien WhatsApp
      const url = `https://wa.me/${restaurantPhone}?text=${encodeURIComponent(message)}`;

      //  Ouvrir WhatsApp
      window.open(url, "_blank");

      //  Vider le panier
      dispatch(clearCart());
      setSuccess(true);

    } catch (err) {
      console.error("Erreur lors de l'envoi de la commande :", err);
      alert("Erreur lors de l'enregistrement de la commande");
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
            {cartItems.map((item) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              return (
                <li key={item.id}>
                  {item.name} x{quantity} = {price * quantity} €
                </li>
              );
            })}
          </ul>

          <p className="font-bold mb-4">
            Total: {total} €
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
