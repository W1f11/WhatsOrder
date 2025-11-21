import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyReservations, cancelReservation } from "../features/reservation/reservationSlice";


export default function MyReservations() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.reservation);

  useEffect(() => {
    dispatch(fetchMyReservations());
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes Réservations</h1>

      {items.length === 0 && <p>Vous n’avez aucune réservation.</p>}

      <ul className="space-y-4">
        {items.map((res) => (
          <li key={res.id} className="border p-4 rounded flex justify-between">
            <div>
              <p>
                <strong>Date :</strong> {new Date(res.start_time).toLocaleString()}
              </p>
              <p>
                <strong>Statut :</strong> {res.status}
              </p>
            </div>
            {res.status === "active" && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => dispatch(cancelReservation(res.id))}
              >
                Annuler
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
