import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../features/menu/menuThunks";
import { Link } from "react-router-dom";

export default function MenuList() {
  const dispatch = useDispatch();
  const { items = [], loading = false, categories = [] } = useSelector((state) => state.menu || {});
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  if (loading) return <p>Chargement...</p>;

  const filteredItems = selectedCategory === "all" ? items : items.filter((i) => i.categories === selectedCategory);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>

      <select
        className="border p-2 mb-4"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">Toutes les catégories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const img = item.image_url || item.img || item.image || item.imageUrl || null;
          return (
            <div key={item.id} className="border rounded p-3">
              {img && <img src={img} alt={item.name} className="w-full h-40 object-cover rounded mb-2" />}
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.price} DH</p>
              <Link to={`/menu/${item.id}`} className="text-blue-600 mt-2 inline-block">
                Voir détail
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
