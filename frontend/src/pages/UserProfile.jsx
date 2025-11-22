import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';

/**
 * Composant principal du profil utilisateur
 */
export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return <div className="p-8">Not logged in</div>;
  }

  // Fonction de déconnexion
  const doLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div>
      {isManager(user) ? (
        <DashboardManager />
      ) : (
        <div style={{ padding: '20px' }}>
          <h2>Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div style={{ marginTop: '12px' }}>
            <button 
              onClick={doLogout} 
              style={{ padding: '8px 12px', background: '#000', color: '#fff', borderRadius: 6 }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Vérifie si l'utilisateur est un manager
 */
function isManager(user) {
  if (!user) return false;
  if (Array.isArray(user.roles)) return user.roles.includes('manager');
  if (typeof user.role === 'string') return user.role === 'manager';
  if (user.email) return user.email === 'manager@gmail.com';
  return false;
}

/**
 * Dashboard spécifique aux managers
 */
function DashboardManager() {
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalReservationsToday: 0,
    totalOrders: 0,
    totalClients: 0,
  });

  // Couleurs utilisées pour le dashboard
  const colors = {
    background: '#FFDCDC',
    text: '#568F87',
  };

  // Récupération des données via l'API
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const api = await import('../api/axios').then(m => m.default);

        const settled = await Promise.allSettled([
          api.get('/api/reservations'),
          api.get('/api/users'),
          api.get('/api/stats')
        ]);

        if (!mounted) return;

        const getSettledValue = (index) => {
          const r = settled[index];
          if (!r) return null;
          if (r.status === 'fulfilled') return r.value;
          console.warn('Manager data: request failed', index, r.reason);
          return null;
        };

        const usersRes = getSettledValue(1);
        const statsRes = getSettledValue(2);

        const normalize = (r) => r?.data ?? r;

        // Mise à jour de la liste des utilisateurs
        if (usersRes) {
          setUsers(Array.isArray(normalize(usersRes)) ? normalize(usersRes) : (normalize(usersRes).data ?? []));
        } else {
          setUsers([]);
        }

        // Mise à jour des statistiques
        if (statsRes) {
          setStats(typeof normalize(statsRes) === 'object' ? normalize(statsRes) : {});
        } else {
          setStats({ totalReservationsToday: 0, totalOrders: 0, totalClients: 0 });
        }
      } catch (err) {
        console.error('Failed loading manager data', err);
        if (!mounted) return;
        setReservations([]);
        setUsers([]);
        setStats({ totalReservationsToday: 0, totalOrders: 0, totalClients: 0 });
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        backgroundColor: colors.background,
        color: colors.text,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Avatar */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: colors.text,
          color: colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}>
          M
        </div>

        {/* Menu de navigation */}
        <button style={buttonStyle(activeTab === 'reservations', colors)} onClick={() => setActiveTab('reservations')}>
          Toutes les réservations
        </button>
        <button style={buttonStyle(activeTab === 'users', colors)} onClick={() => setActiveTab('users')}>
          Liste des clients
        </button>
        <button style={buttonStyle(activeTab === 'stats', colors)} onClick={() => setActiveTab('stats')}>
          Statistiques
        </button>
      </aside>

      {/* Contenu principal */}
      <main style={{ flex: 1, padding: '20px' }}>
        {activeTab === 'reservations' && (
          <>
            <h2 style={{ color: colors.text }}>📋 Toutes les réservations</h2>
            <table border="1" width="100%" cellPadding="8">
              <thead>
                <tr style={{ backgroundColor: colors.background }}>
                  <th>Nom du client</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id}>
                    <td>{res.clientName}</td>
                    <td>{res.date}</td>
                    <td>{res.time}</td>
                    <td>{res.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <h2 style={{ color: colors.text }}>👥 Liste des clients</h2>
            <table border="1" width="100%" cellPadding="8">
              <thead>
                <tr style={{ backgroundColor: colors.background }}>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <h2 style={{ color: colors.text }}>📊 Statistiques</h2>
            <p>Total réservations aujourd’hui : <b>{stats.totalReservationsToday}</b></p>
            <p>Total des commandes : <b>{stats.totalOrders}</b></p>
            <p>Total des clients : <b>{stats.totalClients}</b></p>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * Style pour les boutons du sidebar
 */
function buttonStyle(isActive, colors) {
  return {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: isActive ? colors.text : colors.background,
    color: isActive ? colors.background : colors.text,
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold',
  };
}
