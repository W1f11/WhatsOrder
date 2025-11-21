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
		if (id) dispatch(fetchMenuItem(id));
	}, [id, dispatch]);

	if (loading || !selectedItem) return <p>Chargement...</p>;

	const imgSrc = selectedItem.image_url || selectedItem.img || selectedItem.image || selectedItem.imageUrl || null;

	return (
		<div className="p-6">
			{imgSrc && <img src={imgSrc} className="rounded mb-4" alt={selectedItem.name} />}

			<h1 className="text-2xl font-bold">{selectedItem.name}</h1>
			{selectedItem.description && <p className="mt-2">{selectedItem.description}</p>}

			<p className="text-xl font-bold mt-4">{selectedItem.price} DH</p>

			<button className="mt-4 px-3 py-2 bg-blue-600 text-white rounded" onClick={() => dispatch(addToCart({
				id: selectedItem.id,
				name: selectedItem.name,
				price: selectedItem.price,
				quantity: 1,
				image_url: imgSrc,
			}))}>
				Ajouter au panier
			</button>
		</div>
	);
}

