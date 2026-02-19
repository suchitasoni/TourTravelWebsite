import { Typography } from "@mui/material";
import React, { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "./Packages.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function CharDhamPackage() {
    const [nextTrips, setNextTrips] = React.useState([]);

    useEffect(() => {
        const fetchNextTrips = async () => {
            const snap = await getDocs(collection(db, "nextTrips"));
            const data = snap.docs.map((d) => d.data());
            console.log("Fetched next trips:", data);
            return data;
        };
        fetchNextTrips().then((data) => {
            setNextTrips(data);
        });
        const elements = document.querySelectorAll(".fade-in-section");

        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
            });
        },
        { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

  return (
    <div className="char-dham-package">
      <Helmet>
        <title>Char Dham Tour Package | Spritual Tour India</title>
        <meta
          name="description"
          content="Browse our spiritual Char Dham tour packages covering all four holy sites in India."
        />
      </Helmet>
      
      {/* <div className="chardham-image-div">
        <img src="src/assets/Chardham.jpg" alt="Char Dham Yatra" />
      </div> */}
      <div className="chardham-highlight-section">
      <div className="chardham-container">

        {/* IMAGE */}
        <div className="chardham-image fade-in-section fade-left">
          <img src="src/assets/Chardham.jpg" alt="Char Dham Yatra" />
          <div className="chardham-badge">
            Next Departure: <strong>{nextTrips.find(x => x.destination.toLowerCase().includes("char-dham"))?.tripDate || "Coming soon"} </strong>
          </div>
        </div>

        {/* CONTENT */}
        <div className="chardham-content fade-in-section fade-right">
          <h2>🙏 Experience the Divine Char Dham Yatra</h2>

          <p className="chardham-desc">
            Embark on a sacred journey to <strong style={{fontWeight: '800'}}>Yamunotri, Gangotri,
            Kedarnath & Badrinath</strong> with complete comfort,
            guidance, and spiritual care.
          </p>

          <div className="chardham-features">
            <div>🚌 Comfortable AC Transport</div>
            <div>🏨 Verified Hotels & Meals</div>
            <div>🛕 VIP Darshan Assistance</div>
            <div>📞 24/7 On-Trip Support</div>
          </div>

          <button className="chardham-btn" onClick={() => window.location.href = "/itinerary/char-dham"}>
            Plan My Char Dham Yatra
          </button>
        </div>

      </div>
    </div>
    </div>
  );
}
export default memo(CharDhamPackage);