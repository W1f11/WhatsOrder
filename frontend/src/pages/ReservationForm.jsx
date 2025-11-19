import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReservation } from "../features/reservation/reservationSlice";
import { useNavigate } from "react-router-dom";

export default function ReservationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);

  const [successMessage, setSuccessMessage] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration] = useState(2); // 2h par défaut
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reservationDate = new Date(`${date}T${time}`);

    if (reservationDate <= new Date()) {
      setError("Veuillez choisir une date/heure future");
      return;
    }

    setError("");

    const resultAction = await dispatch(
      createReservation({
        start_time: reservationDate.toISOString(),
        end_time: new Date(reservationDate.getTime() + duration * 60 * 60 * 1000).toISOString(),
      })
    );

    if (createReservation.fulfilled.match(resultAction)) {
      // If user is authenticated, redirect to their reservations
      if (user) {
        navigate("/my-reservations");
      } else {
        // Show a local confirmation for guest users
        setSuccessMessage("Votre réservation a été créée avec succès. Vous recevrez une confirmation par email si renseigné.");
      }
    } else {
      // show backend error if any
      const payload = resultAction.payload || resultAction.error;
      setError(typeof payload === 'string' ? payload : JSON.stringify(payload));
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nouvelle réservation</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Heure</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Réserver
        </button>
      </form>
    </div>
  );
}
