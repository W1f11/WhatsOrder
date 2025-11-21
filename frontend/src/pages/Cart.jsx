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
const whatsappUrl = `https://wa.me/212699425135?text=${encodeURIComponent(
    `Commande:\n${message}\nTotal: ${total} DH`
  )}`;

  return (
    <div>
        <h1>Mon Panier</h1>
        {items.length === 0 ? (
            <p>Votre panier est vide</p>
        ) : ( 
            <>
            <div>
                {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-2 border-b">
                      {(() => {
                        const imageSrc =  item.img ;
                        if (imageSrc) {
                          return (
                            <img
                              src={imageSrc}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          );
                        }
                        return (
                          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-500">No image</div>
                        );
                      })()}

                      <div className="flex-1">
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-sm text-gray-600">{item.price} DH </p>

                        <div className="mt-2">
                          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1}))} disabled={item.quantity === 1} className="px-2 py-1 border rounded"> - </button>

                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1}))} className="px-2 py-1 border rounded"> + </button>
                        </div>
                      </div>

                      <div>
                        <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-600">Supprimer</button>
                      </div>
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