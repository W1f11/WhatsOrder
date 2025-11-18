import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../features/cart/cartSlice";
import { useMemo } from "react";

function Cart() {
    const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);


  // Calcul automatique du total 

  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }, [items]);

  //Generer message WhatsApp

  let message = ""; // on commence avec un message vide

for (let i = 0; i < items.length; i++) {
  let item = items[i]; // on prend chaque produit
  let line = item.name + " x" + item.quantity + " = " + (item.price * item.quantity) + " DH";
  message = message + line + "\n"; // on ajoute la ligne au message
}

console.log(message);
const whatsappUrl = `https://wa.me/212600000000?text=Commande:%0A${encodeURIComponent(
    message
  )}%0ATotal: ${total} DH`;

  return (
    <div>
        <h1>Mon Panier</h1>
        {items.length === 0 ? (
            <p>Votre panier est vide</p>
        ) : ( 
            <>
            <div>
                {items.map((item) => (
                    <div key={item.id}>
                        <div>
                            <h2>{item.name}</h2>
                            <p>{item.price} DH </p>

                            <div>
                                <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1}))} disabled={item.quantity === 1}> - </button>

                                <span>{item.quantity}</span>
                                <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1}))}> + </button>
                            </div>
                        </div>

                        <button onClick={() => dispatch(removeFromCart(item.id))}>Supprimer</button>
                    </div>
                ))}
            </div>

            <div>Total : {total} DH </div>

            <button onClick={() => window.open(whatsappUrl, "_blank")}>Commander via WhatsApp</button>

            <button onClick={() => dispatch(clearCart())}> Vider le panier</button>
            
            
            </>
        )}
    </div>
  );

}
export default Cart;