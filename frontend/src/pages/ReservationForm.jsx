import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReservation } from "../features/reservation/reservationSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchRestaurants } from "../api/restaurant";


export default function ReservationForm({ restaurantId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration] = useState(2); // durée par défaut 2h
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [restaurantInput, setRestaurantInput] = useState(restaurantId || "");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [restaurantsError, setRestaurantsError] = useState("");

  // Resolve restaurant id from props, query string or location.state
  const resolvedRestaurantId = useMemo(() => {
    if (restaurantId) return restaurantId;
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get("restaurant_id") || params.get("restaurant");
      if (q) return Number(q);
    } catch {
      // ignore
    }
    if (location.state && (location.state.restaurantId || location.state.restaurant)) {
      return location.state.restaurantId || location.state.restaurant;
    }
    return null;
  }, [restaurantId, location.search, location.state]);

  // If no restaurant resolved, fetch restaurant list to let user choose
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (resolvedRestaurantId) return;
      setRestaurantsLoading(true);
      try {
        const reps = await fetchRestaurants();
        if (!mounted) return;
        setRestaurants(reps || []);
        setRestaurantsError("");
      } catch (err) {
        if (!mounted) return;
        setRestaurantsError(err.message || "Erreur lors du chargement des restaurants");
      } finally {
        if (mounted) setRestaurantsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [resolvedRestaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Vous devez être connecté pour réserver.");
      return;
    }

    // allow using the resolved restaurant id or a typed-in fallback
    const finalRestaurantId = resolvedRestaurantId || (Number(restaurantInput) || null);
    if (!finalRestaurantId) {
      setError("Impossible de déterminer le restaurant pour la réservation. Entrez l'ID du restaurant.");
      return;
    }

    const startTime = new Date(`${date}T${time}`);
    if (startTime <= new Date()) {
      setError("Veuillez choisir une date/heure future");
      return;
    }

    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    const payload = {
      restaurant_id: finalRestaurantId,
      user_id: user.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    };

    console.debug("Creating reservation with payload:", payload);

    const resultAction = await dispatch(
      createReservation({
        ...payload,
      })
    );

    if (createReservation.fulfilled.match(resultAction)) {
      setSuccess("Réservation réussie !");
      navigate("/my-reservations");
    } else {
      setError(resultAction.payload?.message || "Erreur création réservation");
    }
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Nouvelle réservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!resolvedRestaurantId && (
          <div className="space-y-2">
            <p className="text-yellow-600">Sélectionnez un restaurant pour réserver :</p>
            {restaurantsLoading ? (
              <p>Chargement des restaurants...</p>
            ) : restaurantsError ? (
              <p className="text-red-600">Erreur: {restaurantsError}</p>
            ) : (
              <div>
                <label>Restaurant</label>
                <select
                  value={restaurantInput}
                  onChange={(e) => setRestaurantInput(e.target.value)}
                  className="border p-2 w-full"
                >
                  <option value="">-- Choisir --</option>
                  {restaurants.map((r) => (
                    <option key={r.restaurantID} value={r.restaurantID}>
                      {r.restaurantName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Heure</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Réserver</button>
      </form>
    </div>
  );
}
