import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReservation } from "../features/reservation/reservationSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchRestaurants } from "../api/restaurant";

export default function ReservationForm({ restaurantId, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration] = useState(2);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [restaurantInput, setRestaurantInput] = useState(restaurantId || "");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [restaurantsError, setRestaurantsError] = useState("");

  const resolvedRestaurantId = useMemo(() => {
    if (restaurantId) return restaurantId;
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get("restaurant_id") || params.get("restaurant");
      if (q) return Number(q);
    } catch {
      console.log("Erreur")
    }
    if (location.state && (location.state.restaurantId || location.state.restaurant)) {
      return location.state.restaurantId || location.state.restaurant;
    }
    return null;
  }, [restaurantId, location.search, location.state]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (resolvedRestaurantId) return;
      setRestaurantsLoading(true);
      try {
        const reps = await fetchRestaurants();
        if (!mounted) return;
        setRestaurants(reps || []);
        if ((!restaurantInput || restaurantInput === "") && Array.isArray(reps) && reps.length > 0) {
          setRestaurantInput(reps[0].restaurantID);
        }
        setRestaurantsError("");
      } catch (err) {
        if (!mounted) return;
        setRestaurantsError(err.message || "Erreur lors du chargement des restaurants");
      } finally {
        if (mounted) setRestaurantsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [resolvedRestaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Vous devez être connecté pour réserver.");
      return;
    }

    const finalRestaurantId = resolvedRestaurantId || (Number(restaurantInput) || null);
    if (!finalRestaurantId) {
      setError("Impossible de déterminer le restaurant pour la réservation.");
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

    const resultAction = await dispatch(createReservation({ ...payload }));

    if (createReservation.fulfilled.match(resultAction)) {
      setSuccess("Réservation réussie !");
      navigate("/my-reservations");
      onClose?.(); // ferme le modal si nécessaire
    } else {
      setError(resultAction.payload?.message || "Erreur création réservation");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <h2>Nouvelle réservation</h2>
        <form onSubmit={handleSubmit}>
          {!resolvedRestaurantId && (
            <div>
              <p>Sélectionnez un restaurant :</p>
              {restaurantsLoading ? (
                <p>Chargement...</p>
              ) : restaurantsError ? (
                <p style={{ color: "red" }}>Erreur: {restaurantsError}</p>
              ) : (
                <select
                  value={restaurantInput}
                  onChange={(e) => setRestaurantInput(e.target.value)}
                  required
                >
                  <option value="">-- Choisir --</option>
                  {restaurants.map((r) => (
                    <option key={r.restaurantID} value={r.restaurantID}>
                      {r.restaurantName}
                    </option>
                  ))}
                </select>
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
            />
          </div>
          <div>
            <label>Heure</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit">Réserver</button>
        </form>
      </div>
    </div>
  );
}
