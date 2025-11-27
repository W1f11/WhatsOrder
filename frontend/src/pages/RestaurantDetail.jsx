import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMenuByRestaurant } from "../api/restaurant";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import Navbar from "../components/Navbar";



function RestaurantDetail({ onCartClick }) {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // ✅ page actuelle
  const itemsPerPage = 10; // ✅ 10 plats par page

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMenu() {
      try {
        const restaurantMenu = await fetchMenuByRestaurant(id);
        setMenu(restaurantMenu);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [id]);

  if (loading) return <p>Chargement du menu...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  // ✅ Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenu = menu.slice(indexOfFirstItem, indexOfLastItem); //Extraction des éléments de la page
  const totalPages = Math.ceil(menu.length / itemsPerPage);//arrondit toujours à l’entier supérieur.

  return (
    <div className="menu">
      <div>
      <Navbar onCartClick={onCartClick} />
      <h1 style={{  marginTop: "80px", color: "#5c8a7d", fontSize: "32px", fontWeight: "bold" }}>Menu du restaurant</h1>
      {/* rest of your menu */}
    </div>

      {/* ✅ Bouton retour */}
      <button
        className="btn-back"
        onClick={() => navigate("/")}
        style={{
          padding: "7px 10px",
          marginBottom: "20px",
          backgroundColor: "#568F87",
          position: "fixed",
          marginTop: "-140px",
          marginLeft: "25px",
          color: "white",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
        }}
      >
        ⬅
      </button>

      {/* ✅ Liste des plats paginés */}
      <div className="menu-container" id="menu-container">
        {currentMenu.map((item) => (
          <div className="menu-card" key={item.id}>
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price} €</p>
            {item.dsc && <p className="description">{item.dsc}</p>}
            <button className="btn" onClick={() => dispatch(addToCart(item))}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
        <button
          className="btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          className="btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant ➡
        </button>
      </div>
    </div>
  );
}

export default RestaurantDetail;
