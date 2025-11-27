const FAKE_RESTAURANT_URL =
  "https://cors-anywhere.herokuapp.com/https://fakerestaurantapi.runasp.net/api/Restaurant";

const UNSPLASH_ACCESS_KEY = "WahZaw7_w7Uk7L-Agpthb1nUXUyeKa9jp6wY_T0aE4g";

export const fetchRestaurants = async () => {
  const response = await fetch(FAKE_RESTAURANT_URL);
  if (!response.ok) throw new Error("Erreur lors de la récupération des restaurants");

  const raw = await response.json();

  // The remote API may return different shapes. Normalize to a consistent array of
  // { restaurantID: Number, restaurantName: string, address: string }
  let items = [];
  if (Array.isArray(raw)) items = raw;
  else if (Array.isArray(raw.data)) items = raw.data;
  else if (Array.isArray(raw.restaurants)) items = raw.restaurants;
  else if (raw && typeof raw === 'object') items = [raw];

  const normalized = items
    .map((it) => {
      if (!it || typeof it !== 'object') return null;
      const id = it.restaurantID ?? it.restaurantId ?? it.id ?? it.ID ?? it.Id ?? null;
      const name = it.restaurantName ?? it.name ?? it.title ?? it.restaurant ?? "Restaurant";
      const address = it.address ?? it.location ?? it.addr ?? it.city ?? "";
      const parsedId = id == null ? null : Number(id);
      return {
        restaurantID: Number.isNaN(parsedId) ? null : parsedId,
        restaurantName: name,
        address,
        // keep original for debugging if needed
        _raw: it,
      };
    })
    .filter(Boolean)
    .filter((r) => r.restaurantID !== null);

  return normalized;
};

// 👇 Nouveau menu dynamique selon restaurantId
export const fetchMenuByRestaurant = async (restaurantId) => {
  

  if (restaurantId >= 4 && restaurantId <= 6) ;
  if (restaurantId >= 7 && restaurantId <= 9) ;
  if (restaurantId >= 10) ;

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
