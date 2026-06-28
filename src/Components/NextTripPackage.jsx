import { Typography } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Packages.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function NextTripPackage() {
    const [nextTrips, setNextTrips] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

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
      
      {/* <div className="nextTrip-image-div">
        <img src="src/assets/NextTrip.jpg" alt="Char Dham Yatra" />
      </div> */}
      <div className="nextTrip-highlight-section">
      <div className="nextTrip-container">

        {/* IMAGE */}
        {/* <div className="nextTrip-image fade-in-section fade-left">
          {nextTrips.map((trip) => (
            <div key={trip.destination}>
            <img key={trip.destination} src={trip.imageUrl} alt={trip.destination} />
            <div className="nextTrip-badge">
              Next Departure: <strong>{trip.tripDate || "Coming soon"} </strong>
            </div></div>
          ))}          
        </div> */}
<div className="nextTrip-images fade-in-section fade-left">
  {nextTrips.map((trip) => (
    <div className="nextTrip-card" key={trip.destination}>
      <div className="nextTrip-image-wrapper">
        <img
          src={trip.imageUrl}
          alt={trip.destination}
          className="nextTrip-img"
          onClick={() => setSelectedImage(trip)}
        />

        <div className="nextTrip-badge">
          Next Departure:
          <strong>{trip.tripDate || "Coming Soon"}</strong>
        </div>
      </div>

      <div className="nextTrip-footer">
        <h3>{trip.destination}</h3>
      </div>
    </div>
  ))}
</div>
{selectedImage && (
  <div
    className="lightbox-overlay"
    onClick={() => setSelectedImage(null)}
  >
    <div
      className="lightbox-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="lightbox-close"
        onClick={() => setSelectedImage(null)}
      >
        ✕
      </button>

      <img
        src={selectedImage.imageUrl}
        alt={selectedImage.destination}
      />

      <h3>{selectedImage.destination}</h3>
    </div>
  </div>
)}

      </div>
    </div>
    </div>
  );
}
export default memo(NextTripPackage);