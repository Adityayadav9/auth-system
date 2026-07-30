import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    
      <div className="auth-card">
        <h1 className="auth-title">Authentication System</h1>

        {!token ? (
          <>
            <button
              className="auth-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>

            <button
              className="auth-btn"
              style={{ marginTop: "15px" }}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </>
        ) : (
          <>
            <button
              className="auth-btn"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <button
              className="auth-btn"
              style={{ marginTop: "15px" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
  );
};

export default Home;