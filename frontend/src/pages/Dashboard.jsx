import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.logo}>Dashboard</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <main style={styles.content}>
        <div style={styles.card}>
          <h1 style={styles.welcomeTitle}>Welcome back, {user.name}! 👋</h1>
          <p style={styles.userEmail}>
            Logged in as: <strong>{user.email}</strong>
          </p>
          <hr style={styles.divider} />
          <p style={styles.infoText}>
            You have successfully passed authentication.
          </p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
  logo: {
    margin: 0,
    fontSize: "20px",
    color: "#111827",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  content: {
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "32px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  welcomeTitle: {
    margin: "0 0 8px 0",
    color: "#111827",
  },
  userEmail: {
    color: "#4b5563",
    fontSize: "15px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "20px 0",
  },
  infoText: {
    color: "#6b7280",
  },
};

export default Dashboard;