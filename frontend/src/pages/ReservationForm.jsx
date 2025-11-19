import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReservation } from "../features/reservation/reservationSlice";
import { useNavigate } from "react-router-dom";

export default function ReservationForm({ restaurantId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration] = useState(2); // durée par défaut 2h
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Vous devez être connecté pour réserver.");
      return;
    }

    const startTime = new Date(`${date}T${time}`);
    if (startTime <= new Date()) {
      setError("Veuillez choisir une date/heure future");
      return;
    }

    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    const resultAction = await dispatch(
      createReservation({
        restaurant_id: restaurantId,
        user_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
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
