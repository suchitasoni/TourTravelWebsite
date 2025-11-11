import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, getDoc, getDocs } from "firebase/firestore";
import "./Reviews.css";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import './Reviews.css';

const ReviewsCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [agencyInfo, setAgencyInfo] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), orderBy("date", "desc"));
      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(data);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };
    const fetchAgencyInfo = async () => {
      try {
        const ref = doc(db, "agencyInfo", "overview");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setAgencyInfo(snap.data());
        }
      } catch (err) {
        console.log("Error loading agency info:", err);
      }
    };

    fetchAgencyInfo();
  fetchReviews();
}, []);
  useEffect(() => {
    if (reviews.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews]);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));
  };

  if (reviews.length === 0) return null;

  const r = reviews[index];

  return (
    <div className="review-carousel-flex"> 
        <div className="review-carousel-first-div">
            {agencyInfo && (
            <div className="overall-rating-area">
            <h2>Our Success Story!"</h2>
            <div className="overall-rating-value">
                ⭐ {agencyInfo.averageRating || 0} / 5 &nbsp;
                <span className="small">
                ({agencyInfo.totalReviews} reviews)
                </span>
                <div>Customer satisfaction is our major goal.</div><div> See what our customers are saying about us.</div>
            </div>
            <Button variant="contained" color="primary" href="/reviews">See All</Button>
            </div>
      )}
        </div>
        <div className="review-carousel-container">
            <a className="review-card" href={r.reviewLink} target="_blank" rel="noopener noreferrer">
                <div className="review-header">
                <Avatar sx={{ bgcolor: 'gray' }}>{r.name.substr(0,1)}</Avatar>
                <div>
                    <h3 className="reviewer-name">{r.name}</h3>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                    {r.date}
                    </Typography>
                    <div className="rating-stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </div>
                </div>
                </div>
                <Typography variant="body2" color="text.primary" mt={1}>
                    {r.text}
                </Typography>
                {r.images?.length > 0 && (
                <div className="review-images-wrapper">
                    {r.images.map((img, i) => (
                    <img key={i} src={img} className="review-image" alt="review-img" />
                    ))}
                </div>
                )}
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
            {/* <button onClick={prev} className="carousel-btn prev-btn">⟨</button>
            <button onClick={next} className="carousel-btn next-btn">⟩</button> */}
        </div>
    </div>
  );
};

export default ReviewsCarousel;
