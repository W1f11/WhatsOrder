import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMenuItem } from "../features/menu/menuThunks";
import { addToCart } from "../features/cart/cartSlice";


export default function MenuItemDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedItem, loading } = useSelector(state => state.menu);

    useEffect(() => {
        dispatch(fetchMenuItem(id));
    }, [id]);

     if (loading || !selectedItem) return <p>Chargement...</p>;

    return (
        <div className="p-6">
            <img src={selectedItem.image_url} className="rounded mb-4" />

            <h1 className="">{selectedItem.name}</h1>
            <p className="mt-2">{selectedItem.description}</p>

            <p className="text-xl font-bold mt-4">{selectedItem.price} DH</p>

            <button className="" onClick={() => dispatch(addToCart({
                id: selectedItem.id, name: selectedItem.name, price: selectedItem.price, quantity: 1,
            }))}>
                Ajouter au panier
            </button>
        </div>
    );
}
