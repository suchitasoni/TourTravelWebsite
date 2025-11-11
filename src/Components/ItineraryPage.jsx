import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import EnquiryForm from "./EnquiryForm";
import "../Components/Itinerary.css";

const ItineraryPage = () => {
  const { id  } = useParams(); // package id like "andaman"
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const docRef = doc(db, "packages", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setPkg(snap.data());
        } else {
          console.log("Package not found");
        }
      } catch (err) {
        console.error("Error fetching package:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading itinerary...</div>;
  if (!pkg) return <div style={{ padding: "2rem" }}>Package not found.</div>;

  return (
    <div className="itinerary-page" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero Section */}
      <div className="itinerary-bg">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {pkg.title}
            </h1>
            <p>{pkg.duration}</p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>{pkg.category}</h2>
        <p style={{ color: "#444", marginBottom: "1.5rem" }}>
          {pkg.description}
        </p>

        {/* Quick Facts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div className="card" style={cardStyle}>
            <h4>Region</h4>
            <p>{pkg.region}</p>
          </div>
          <div className="card" style={cardStyle}>
            <h4>Price</h4>
            <p>₹ {pkg.price.toLocaleString()}</p>
          </div>
          <div className="card" style={cardStyle}>
            <h4>Customizable</h4>
            <p>{pkg.customizable ? "Yes" : "No"}</p>
          </div>
          <div className="card" style={cardStyle}>
            <h4>Group Tour</h4>
            <p>{pkg.isGroupTourAvailable ? "Available" : "Not available"}</p>
          </div>
        </div>

        {/* Highlights */}
        {pkg.highlights?.length > 0 && (
          <>
            <h3>Highlights</h3>
            <ul>
              {pkg.highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {/* Inclusions & Exclusions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {pkg.inclusions?.length > 0 && (
            <div>
              <h3>Inclusions</h3>
              <ul>
                {pkg.inclusions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {pkg.exclusions?.length > 0 && (
            <div>
              <h3>Exclusions</h3>
              <ul>
                {pkg.exclusions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Itinerary */}
        {pkg.itinerary?.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
            <h2>Day-wise Itinerary</h2>
            <div style={{ marginTop: "1rem" }}>
              {pkg.itinerary.map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    borderLeft: "4px solid #0077cc",
                    padding: "0.5rem 1rem",
                    marginBottom: "1rem",
                    background: "#f9f9f9",
                  }}
                >
                  <strong>{day}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <section style={{marginBottom:'20px'}}><EnquiryForm /></section>
      </div>
    </div>
  );
};

// Styles
const cardStyle = {
  background: "#f9f9f9",
  borderRadius: "10px",
  padding: "1rem",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const btnStyle = {
  background: "#ff7b00",
  color: "#fff",
  border: "none",
  padding: "0.8rem 1.6rem",
  fontSize: "1rem",
  borderRadius: "8px",
  cursor: "pointer",
};

export default ItineraryPage;
