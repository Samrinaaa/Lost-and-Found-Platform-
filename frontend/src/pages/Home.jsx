import { Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

function Home() {
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        position: "relative"
      }}
    >
      {/* Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4))"
        }}
      />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          color: "white",
          maxWidth: "700px",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            fontWeight: "700",
            marginBottom: "25px",
            letterSpacing: "1px",
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          Lost & Found System
        </h1>

        <p
          style={{
            fontSize: "22px",
            marginBottom: "10px",
            fontWeight: "600",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          Report lost items, find belongings
        </p>

        <p
          style={{
            fontSize: "22px",
            marginBottom: "35px",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          and reconnect with what matters.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Link to="/login">
            <button
              style={{
                padding: "14px 30px",
                borderRadius: "40px",
                border: "none",
                background: "#3b82f6",
                color: "white",
                fontWeight: "800",
                cursor: "pointer",
                fontSize: "25px",
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/register">
            <button
              style={{
                padding: "14px 30px",
                borderRadius: "40px",
                border: "none",
                background: "#10b981",
                color: "white",
                fontWeight: "800",
                cursor: "pointer",
                fontSize: "25px",
              }}
            >
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;