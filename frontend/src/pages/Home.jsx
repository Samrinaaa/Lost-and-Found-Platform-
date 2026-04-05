import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/image.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif" }}>

      {/* HERO SECTION */}
      <section style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden"
      }}>

        <img
          src={heroImage}
          alt="Lost and Found"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)"
        }} />

        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          zIndex: 2,
          maxWidth: "600px",
          width: "90%"
        }}>
          <h1 style={{
            fontSize: "3rem",
            marginBottom: "10px",
            fontWeight: "700"
          }}>
            Lost & Found System
          </h1>

          <p style={{
            marginBottom: "25px",
            opacity: 0.9,
            fontSize: "16px"
          }}>
            Report lost items, find belongings and reconnect with what matters.
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => navigate("/login")}
              style={btnPrimary}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              style={btnSecondary}
            >
              Register
            </button>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section style={{
        padding: "70px 20px",
        textAlign: "center",
        background: "#f5f5f5"
      }}>
        <h2 style={{ fontSize: "26px", fontWeight: "600" }}>Explore</h2>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          marginTop: "35px",
          flexWrap: "wrap"
        }}>

          {/* LOST ITEMS */}
          <div style={card}>
            <h3>🔍 Lost Items</h3>
            <p>
              Browse reports of lost belongings submitted by users across the platform.
            </p>
          </div>

          {/* FOUND ITEMS */}
          <div style={card}>
            <h3>📦 Found Items</h3>
            <p>
              Explore items that have been found and reported by the community.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        padding: "70px 20px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "26px", fontWeight: "600" }}>
          How It Works
        </h2>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          marginTop: "35px",
          flexWrap: "wrap"
        }}>

          <div style={infoCard}>
            <h4>📌 Report Item</h4>
            <p>Submit details of your lost or found item</p>
          </div>

          <div style={infoCard}>
            <h4>🔍 Find Matches</h4>
            <p>We match your item with reports</p>
          </div>

          <div style={infoCard}>
            <h4>✅ Verify & Claim</h4>
            <p>Securely confirm ownership</p>
          </div>

        </div>
      </section>

    </div>
  );
};

/* STYLES */

const btnPrimary = {
  padding: "10px 24px",
  borderRadius: "25px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  minWidth: "130px",
  transition: "0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
};

const btnSecondary = {
  padding: "10px 24px",
  borderRadius: "25px",
  border: "none",
  background: "#10b981",
  color: "white",
  cursor: "pointer",
  minWidth: "130px",
  transition: "0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
};

const card = {
  background: "white",
  padding: "28px",
  borderRadius: "14px",
  width: "260px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
};

const infoCard = {
  background: "#f9f9f9",
  padding: "22px",
  borderRadius: "12px",
  width: "230px"
};

export default Home;