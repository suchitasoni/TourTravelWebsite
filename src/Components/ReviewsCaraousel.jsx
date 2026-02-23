import {memo, useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy,getDocs, doc, getDoc,
} from "firebase/firestore";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Reviews.css";
import { useRenderCount } from "../TourDataContext";

const ReviewsCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [agencyInfo, setAgencyInfo] = useState(null);

  const indexRef = useRef(0);
  const cardRef = useRef(null);

  useRenderCount("ReviewsCarousel");

  // Fetch data once
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        orderBy("date", "desc")
      );
      const snap = await getDocs(q);
      setReviews(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    };

    const fetchAgencyInfo = async () => {
      const ref = doc(db, "agencyInfo", "overview");
      const snap = await getDoc(ref);
      if (snap.exists()) setAgencyInfo(snap.data());
    };

    fetchAgencyInfo();
    fetchReviews();
  }, []);

  // Auto slide WITHOUT re-render
  useEffect(() => {
    if (reviews.length === 0) return;

    const updateCard = (i) => {
      const r = reviews[i];
      if (!cardRef.current) return;

      cardRef.current.querySelector(".reviewer-name").textContent = r.name;
      cardRef.current.querySelector(".review-date").textContent = r.date;
      cardRef.current.querySelector(".review-text").textContent = r.text;
      cardRef.current.href = r.reviewLink || "#";
      cardRef.current.querySelector(".rating-stars").textContent =
        "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
    };

    updateCard(0);

    const interval = setInterval(() => {
      indexRef.current =
        indexRef.current === reviews.length - 1
          ? 0
          : indexRef.current + 1;

      updateCard(indexRef.current);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews]);

  // Manual controls (still no state)
  const prev = () => {
    indexRef.current =
      indexRef.current === 0
        ? reviews.length - 1
        : indexRef.current - 1;
    updateInstant();
  };

  const next = () => {
    indexRef.current =
      indexRef.current === reviews.length - 1
        ? 0
        : indexRef.current + 1;
    updateInstant();
  };

  const updateInstant = () => {
    const r = reviews[indexRef.current];
    if (!cardRef.current) return;

    cardRef.current.querySelector(".reviewer-name").textContent = r.name;
    cardRef.current.querySelector(".review-date").textContent = r.date;
    cardRef.current.querySelector(".review-text").textContent = r.text;
    cardRef.current.href = r.reviewLink || "#";
    cardRef.current.querySelector(".rating-stars").textContent =
      "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
  };

  if (reviews.length === 0) return null;

  const r = reviews[0]; // initial render only

  return (
    <div className="review-carousel-flex">
      {/* LEFT INFO */}
      {/* <div className="review-carousel-first-div">
            {agencyInfo && (
            <div className="overall-rating-area">
            <h2 style={{fontWeight:400}}>Our Success Story!</h2>
            <div className="overall-rating-value">
                ⭐ {agencyInfo.averageRating || 0} / 5 &nbsp;
                <span className="small">
                ({agencyInfo.totalReviews} reviews)
                </span>
            </div>
            <div style={{justifyItems: 'center',margin: '20px 0px'}}><div>Customer satisfaction is our major goal.</div><div> See what our customers are saying about us.</div></div>
            <Button style={{textTransform: 'none'}} variant="contained" color="primary" href="/reviews">See All Reviews</Button>
            </div>
      )}
      </div> */}
      <div className="stats-overlay">
        <div className="stats-container">

          <div className="stat-item">
            <h2>1,200+</h2>
            <h4 style={{margin: 0}}>😊 Happy Customers</h4>
          </div>

          <div className="stat-item">
            <h2>25+</h2>
            <h4 style={{margin: 0}}>🎒 Tour Packages</h4>
          </div>

          <div className="stat-item">
            <h2>20+</h2>
            <h4 style={{margin: 0}}>🏨 Partner Hotels</h4>
          </div>

          <div className="stat-item">
            <h2>50+</h2>
            <h4 style={{margin: 0}}>📅 Room Bookings / Month</h4>
          </div>

        </div>
      </div>

      {/* REVIEW CARD */}
      <div className="review-carousel-container">
        <a
          ref={cardRef}
          className="review-card"
          href={r.reviewLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="review-header">
            <Avatar sx={{ bgcolor: "gray" }}>
              {r.name?.[0]}
            </Avatar>
            <div>
              <h3 className="reviewer-name">{r.name}</h3>
              <Typography
                variant="body2"
                color="text.secondary"
                className="review-date"
              >
                {r.date}
              </Typography>
              <div className="rating-stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
            </div>
          </div>

          <Typography
            variant="body2"
            color="text.primary"
            className="review-text"
          >
            {r.text}
          </Typography>
        </a>

        {/* Controls */}
            <IconButton
                onClick={prev}
                sx={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.4)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.7)" }
                }}
            >
          <ArrowBackIosNewIcon />
        </IconButton>
            <IconButton
                onClick={next}
                sx={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.4)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.7)" }
                }}
            >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default memo(ReviewsCarousel);
