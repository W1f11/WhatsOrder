import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';


export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <div className="p-8">Not logged in</div>;
  }

  
  const doLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="">
      {/* If the user is a manager, render the manager dashboard */}
      {isManager(user) ? (
        <DashboardManager />
      ) : (
        <>
          <h2 className="">Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div className="">
            <button onClick={doLogout} className="">Logout</button>
          </div>
        </>
      )}
    </div>
  );
}

// Helper to detect manager role. Checks several common shapes: `roles` array, `role` string, or email fallback.
function isManager(user) {
  if (!user) return false;
  if (Array.isArray(user.roles)) return user.roles.includes('manager');
  if (typeof user.role === 'string') return user.role === 'manager';
  if (user.email) return user.email === 'manager@gmail.com';
  return false;
}

// Dashboard component for managers
function DashboardManager() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [clients, setClients] = useState([]);

  const [stats, setStats] = useState({
    totalToday: 0,
    occupancyRate: 0,
    cancelled: 0,
    confirmed: 0,
  });

  // Charger données backend
  useEffect(() => {
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(() => setReservations([]));

    fetch('/api/tables')
      .then(res => res.json())
      .then(data => setTables(data))
      .catch(() => setTables([]));

    fetch('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(() => setClients([]));

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  // Actions sur réservation
  const updateStatus = (id, newStatus) => {
    fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(() => {
        setReservations(prev =>
          prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
      })
      .catch(() => {});
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Manager</h1>

      {/* ===================== 1️⃣ LISTE DES RÉSERVATIONS ===================== */}
      <section>
        <h2>📋 Toutes les réservations</h2>
        <table border="1" width="100%" cellPadding="8">
          <thead>
            <tr>
              <th>Nom du client</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map(res => (
              <tr key={res.id}>
                <td>{res.clientName}</td>
                <td>{res.date}</td>
                <td>{res.time}</td>
                <td>{res.status}</td>
                <td>
                  <button onClick={() => updateStatus(res.id, 'confirmed')}>
                    Confirmer
                  </button>
                  <button onClick={() => updateStatus(res.id, 'cancelled')}>
                    Annuler
                  </button>
                  <button onClick={() => updateStatus(res.id, 'pending')}>
                    En attente
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr />

      {/* ===================== 2️⃣ GESTION DES TABLES ===================== */}
      <section>
        <h2>🍽️ Gestion des tables</h2>
        <ul>
          {tables.map((table, index) => (
            <li key={index}>
              Table {table.number} — {table.isOccupied ? 'Occupée' : 'Libre'}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* ===================== 3️⃣ LISTE DES CLIENTS ===================== */}
      <section>
        <h2>👥 Liste des clients</h2>
        <ul>
          {clients.map(client => (
            <li key={client.id}>
              {client.name} — {client.phone}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* ===================== 4️⃣ STATISTIQUES ===================== */}
      <section>
        <h2>📊 Statistiques</h2>
        <p>
          Total réservations aujourd’hui : <b>{stats.totalToday}</b>
        </p>
        <p>
          Taux d’occupation : <b>{stats.occupancyRate}%</b>
        </p>
        <p>
          Confirmées : <b>{stats.confirmed}</b>
        </p>
        <p>
          Annulées : <b>{stats.cancelled}</b>
        </p>
      </section>
    </div>
  );
}