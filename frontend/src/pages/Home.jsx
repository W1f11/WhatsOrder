import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchRestaurants, fetchRestaurantImage } from "../api/restaurant";

function Home() {
	const navigate = useNavigate();
	const [restaurants, setRestaurants] = useState([]);
	const [images, setImages] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;

		async function loadRestaurants() {
			try {
				const reps = await fetchRestaurants();

				// Charger les images Unsplash pour chaque resto
				const imagesMap = {};
				for (let r of reps) {
					try {
						const img = await fetchRestaurantImage(r.restaurantName);
						imagesMap[r.restaurantID] = img;
					} catch  {
						// Use an inline SVG data URL as a fallback to avoid external DNS failures
						imagesMap[r.restaurantID] = `data:image/svg+xml;utf8,` +
							encodeURIComponent(`
							<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
							  <rect width='100%' height='100%' fill='%23efefef' />
							  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial, Helvetica, sans-serif' font-size='20'>No Image</text>
							</svg>
						`);
					}
				}

				if (!mounted) return;
				setRestaurants(reps);
				setImages(imagesMap);
			} catch (err) {
				setError(err.message || "Erreur réseau");
			} finally {
				if (mounted) setLoading(false);
			}
		}
		loadRestaurants();

		return () => {
			mounted = false;
		};
	}, []);

	if (loading) return <p>Chargement...</p>;
	if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

	return (
		<div>
			<h1 id="restaurants-container">Restaurants</h1>
			<div className="restaurants-container">
				{restaurants.map((r) => (
					<div className="restaurant-card" key={r.restaurantID}>
						<img
							src={images[r.restaurantID]}
							alt={r.restaurantName}
							style={{
								width: "100%",
								height: "200px",
								objectFit: "cover",
								borderRadius: "8px",
								marginTop: "10px",
							}}
						/>

						<Link
							to={`/restaurant/${r.restaurantID}`}
							style={{ display: "block", marginTop: "10px", fontWeight: "bold", fontSize: "18px", color: "#2c3e50" }}
						>
							{r.restaurantName}

							
						</Link>

						<p>{r.address}</p>
						<button className="btn" onClick={() => navigate('/reservation/new')}>Réserver</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
