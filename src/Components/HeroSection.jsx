import { useEffect, useState } from "react";
import "./Hero.css";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const images = [
  "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762098016/a7qewugz40xem1yj3i7b.png",
  "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762098374/c73hyththjwwsuqft5xj.png"
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="hero-banner">
      <img style={{height: '100%', width: '100%', objectFit: 'cover'}}
        src={images[index]}
        alt="Travel destination"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="hero-text">
        <h1>Explore The World With Us</h1>
        <p>
          Find the best tour packages, holiday trips, and affordable travel
          deals curated specially for you.
        </p>
        <button>View Packages</button>
      </div>
      
      <IconButton onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "27vh",
          left: "0",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.4)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.7)" }
        }}><ArrowBackIosNewIcon /></IconButton>

      <IconButton onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "27vh",
          right: "0",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.4)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.7)" }
        }}><ArrowForwardIosIcon /></IconButton> </div>
  );
};

export default HeroSection;
