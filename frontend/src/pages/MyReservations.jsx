import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyReservations, cancelReservation } from "../features/reservation/reservationSlice";

export default function MyReservations() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.reservation);
  const [cancelling, setCancelling] = useState(null); // pour gérer l'état du bouton

  useEffect(() => {
    dispatch(fetchMyReservations());
  }, [dispatch]);

  const handleCancel = async (id) => {
    setCancelling(id);
    await dispatch(cancelReservation(id));
    setCancelling(null);
  };

  if (loading) return <p className="loading">Chargement...</p>;

  return (
    <div className="reservations-container">
      <h1 className="title">Mes Réservations</h1>

      {items.length === 0 ? (
        <p className="no-reservations">Vous n’avez aucune réservation.</p>
      ) : (
        <ul className="reservations-list">
          {items.map((res) => (
            <li key={res.id} className="reservation-card">
              <div className="reservation-info">
                <p><strong>Date :</strong> {new Date(res.start_time).toLocaleString()}</p>
                <p><strong>Statut :</strong> <span className={`status ${res.status}`}>{res.status}</span></p>
              </div>
              {res.status === "active" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(res.id)}
                  disabled={cancelling === res.id}
                >
                  {cancelling === res.id ? "Annulation..." : "Annuler"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
