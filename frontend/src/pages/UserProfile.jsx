import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";

// Enregistrement des éléments ChartJS nécessaires pour Bar et Pie
ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function UserProfile() {
  // STATE DU COMPOSANT
  const [activeTab, setActiveTab] = useState("users"); // Onglet actif
  const [users, setUsers] = useState([]); 
  const [reservations, setReservations] = useState([]); 
  const [stats, setStats] = useState({ totalReservationsToday: 0, totalOrders: 0, totalClients: 6 }); // Statistiques globales
  const [loadErrors, setLoadErrors] = useState([]); 



  // Édition d'un utilisateur
  const handleEditUser = (user) => {
    console.log("Éditer l'utilisateur:", user);
    // Ici tu peux ouvrir un modal ou naviguer vers une page d'édition
  };

  // Suppression d'un utilisateur
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirmed) return;

    try {
      const api = await import("../api/axios").then(m => m.default);
      await api.delete(`/api/users/${userId}`, { withCredentials: true });
      setUsers(users.filter(u => u.id !== userId));
      console.log("Utilisateur supprimé :", userId);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Impossible de supprimer l'utilisateur. Vérifiez le serveur et les CORS.");
    }
  };

  // RÉCUPÉRATION DES DONNÉES 
  useEffect(() => {
    let mounted = true;

    (async () => {
      const api = await import("../api/axios").then((m) => m.default);

      // On lance toutes les requêtes en parallèle
      const settled = await Promise.allSettled([
        api.get('/api/users'),
        api.get('/api/reservations'),
        api.get('/api/stats')
      ]);

      if (!mounted) return;

      const wrap = (r) => r?.status === 'fulfilled' ? r.value.data : null;

      const usersData = wrap(settled[0]);
      const reservationsData = wrap(settled[1]);
      const statsData = wrap(settled[2]);

      // Mise à jour des états
      setUsers(Array.isArray(usersData) ? usersData : (usersData?.data ?? []));
      setReservations(Array.isArray(reservationsData) ? reservationsData : (reservationsData?.data ?? []));
      setStats(statsData ?? { totalReservationsToday: 0, totalOrders: 0, totalClients: 6 });

      // Gestion des erreurs
      const errors = [];
      if (settled[0].status !== 'fulfilled') errors.push('users');
      if (settled[1].status !== 'fulfilled') errors.push('reservations');
      if (settled[2].status !== 'fulfilled') errors.push('stats');
      setLoadErrors(errors);
    })();

    return () => { mounted = false; };
  }, []);

  // --- RENDERING ---
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      
      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div style={avatarStyle}>M</div>

        <button
          style={menuBtn(activeTab === "reservations")}
          onClick={() => setActiveTab("reservations")}
        >
          📅 Toutes les réservations
        </button>

        <button
          style={menuBtn(activeTab === "users")}
          onClick={() => setActiveTab("users")}
        >
          👥 Liste des clients
        </button>

        <button
          style={menuBtn(activeTab === "stats")}
          onClick={() => setActiveTab("stats")}
        >
          📊 Statistiques
        </button>
      </aside>

      {/* CONTENT PRINCIPAL */}
      <main style={{ flex: 1, padding: "30px" }}>
        
        {/* Onglet Users */}
        {activeTab === "users" && (
          <>
            <h2 style={titleStyle}>👥 Liste des clients</h2>
            {loadErrors.includes('users') && <div style={{color:'orange', marginBottom:12}}>Erreur chargement: users</div>}

            <div style={tableContainer}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Nom</th>
                    <th style={thStyle}>Email</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      style={rowStyle}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    >
                      <td style={tdStyle}>{u.name}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={{ ...tdStyle, ...actionIcons }}>
                        <FiEdit
                          size={18}
                          style={{ cursor: "pointer", color: "#568F87" }}
                          onClick={() => handleEditUser(u)}
                        />
                        <FiTrash2
                          size={18}
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDeleteUser(u.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Onglet Reservations */}
        {activeTab === "reservations" && (
          <>
            <h2 style={titleStyle}>📅 Toutes les réservations</h2>
            {loadErrors.includes('reservations') && <div style={{color:'orange', marginBottom:12}}>Erreur chargement: reservations</div>}
            
            <div style={tableContainer}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Client</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Heure</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id || Math.random()} style={rowStyle}>
                      <td style={tdStyle}>{users.find(u => u.id === r.user_id)?.name || "—"}</td>
                      <td style={tdStyle}>{r.start_time ? new Date(r.start_time).toLocaleDateString() : ''}</td>
                      <td style={tdStyle}>{r.start_time ? new Date(r.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Onglet Statistiques */}
        {activeTab === "stats" && (
          <>
            <h2 style={titleStyle}>📊 Statistiques</h2>
            {loadErrors.includes('stats') && <div style={{ color: 'orange', marginBottom: 12 }}>Erreur chargement: stats</div>}

            {/* Cartes statistiques */}
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div style={cardStyle}>
                <div style={cardTitle}>Réservations aujourd'hui</div>
                <div style={cardNumber}>{stats.totalReservationsToday}</div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitle}>Commandes</div>
                <div style={cardNumber}>{stats.totalOrders }</div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitle}>Clients</div>
                <div style={cardNumber}>{stats.totalClients}</div>
              </div>
            </div>

            {/* Graphiques */}
            <div style={{ display: "flex", marginTop: 40, gap: 30 }}>
              {/* Graphique Bar */}
              <div style={{ width: "45%" }}>
                <h3 style={{ color: "#568F87" }}>Graphique : Utilisateurs vs Réservations</h3>
                <Bar
                  data={{
                    labels: ["Clients", "Réservations"],
                    datasets: [{
                      label: "Total",
                      data: [users.length, reservations.length],
                      backgroundColor: ["#6BA292", "#F7DCE7"],
                    }],
                  }}
                />
              </div>

              {/* Graphique Pie */}
              <div style={{ width: "45%" }}>
                <h3 style={{ color: "#568F87" }}>Répartition des réservations</h3>
                <Pie
                  data={{
                    labels: ["Aujourd'hui", "Total"],
                    datasets: [{
                      data: [stats.totalReservationsToday, reservations.length],
                      backgroundColor: ["#6BA292", "#F2A7BF"],
                    }],
                  }}
                />
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

/* -------------------------------------------------
    STYLES
-------------------------------------------------- */

const sidebarStyle = {
  width: "260px",
  background: "#F7DCE7",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const avatarStyle = {
  width: "95px",
  height: "95px",
  borderRadius: "50%",
  background: "#6BA292",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "35px",
  fontWeight: "bold",
  marginBottom: "35px",
};

const menuBtn = (active) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "15px",
  border: "none",
  fontWeight: "600",
  cursor: "pointer",
  background: active ? "#6BA292" : "transparent",
  color: active ? "white" : "#6BA292",
  transition: "0.25s",
});

const titleStyle = {
  color: "#568F87",
  fontSize: "24px",
  marginBottom: "20px",
};

/* TABLE DESIGN */
const tableContainer = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "15px",
};

const thStyle = {
  background: "#F8FAFC",
  padding: "14px 18px",
  textAlign: "left",
  fontWeight: "600",
  color: "#475569",
  borderBottom: "1px solid #E2E8F0",
};

const tdStyle = {
  padding: "16px 18px",
  borderBottom: "1px solid #E2E8F0",
  color: "#334155",
};

const rowStyle = {
  transition: "0.25s",
};

const actionIcons = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "14px",
};

/* CARTES STATISTIQUES */
const cardStyle = {
  padding: 12,
  width: "450px",
  borderRadius: 8,
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.20)",
};

const cardTitle = {
  fontSize: 12,
  color: "#64748b",
};

const cardNumber = {
  fontSize: 22,
  fontWeight: 700,
};
