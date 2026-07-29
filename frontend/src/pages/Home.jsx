import { useNavigate } from "react-router-dom";
import bgSvg from "../assets/gemini-svg.svg"; // Step up from src/pages to src/assets

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgSvg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
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
    </div>
  );
};

export default Home;