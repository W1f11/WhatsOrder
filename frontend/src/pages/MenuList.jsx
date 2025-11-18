import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { fetchMenu } from "../features/menu/menuThunks";
import { Link } from "react-router-dom";

export default function MenuList() {

    const dispatch = useDispatch();
    const { items, loading, categories } = useSelector(state => state.menu);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    if (loading) return <p>Chargement...</p>

    const filteredItems = selectedCategory === "all" ? items : items.filter(i => i.categories === selectedCategory);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Menu</h1>


            <select className="border p-2 mb-4" onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">Toutes les categories</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

             
            {/*Liste des plats*/}
            <div>
                {filteredItems.map((item => (
                    <div key={item.id}>
                        <img src={item.image_url} alt="" />
                        <h2>{item.name}</h2>
                        <p>{item.price} DH</p>
                        <link to={"/menu" + item.id}>Voir détail</link>
                    </div>
                )))}
            </div>

        </div>
    );
}