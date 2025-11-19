const FAKE_RESTAURANT_URL =
  "https://cors-anywhere.herokuapp.com/https://fakerestaurantapi.runasp.net/api/Restaurant";

const UNSPLASH_ACCESS_KEY = "WahZaw7_w7Uk7L-Agpthb1nUXUyeKa9jp6wY_T0aE4g";

export const fetchRestaurants = async () => {
  const response = await fetch(FAKE_RESTAURANT_URL);
  if (!response.ok) throw new Error("Erreur lors de la récupération des restaurants");
  return await response.json();
};

// 👇 Nouveau menu dynamique selon restaurantId
export const fetchMenuByRestaurant = async (restaurantId) => {
  let category = "burgers";

  if (restaurantId >= 4 && restaurantId <= 6) category = "pizzas";
  if (restaurantId >= 7 && restaurantId <= 9) category = "desserts";
  if (restaurantId >= 10) category = "fruits";

  const response = await fetch(
    `https://free-food-menus-api-two.vercel.app/burgers`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du menu du restaurant");
  }

  return await response.json();
};

// Image Unsplash
export const fetchRestaurantImage = async (restaurantName) => {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      restaurantName + " restaurant"
    )}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'image du restaurant");
  }

  const data = await response.json();
  if (data.results.length > 0) {
    return data.results[0].urls.small;
  } else {
    return "https://via.placeholder.com/400x300?text=No+Image";
  }
};
