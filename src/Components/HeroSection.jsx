import { memo, useEffect, useRef, useState } from "react";
import "./Hero.css";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHref, useNavigate } from "react-router-dom";
import { useRenderCount } from "../TourDataContext";

const images = [
  "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762098016/a7qewugz40xem1yj3i7b.png",
  "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762098374/c73hyththjwwsuqft5xj.png"
];

const HeroSection = () => {
  useRenderCount("HeroSection");
  const imgRef = useRef(null);
  let currentIndex = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      imgRef.current.src = images[currentIndex];
    }, 4000);

    return () => clearInterval(interval);
  }, []);

   const handlePackagesNavigation = () => {
    const element = document.getElementById('packages');
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth', // Optional: smooth scrolling
            block: 'start'      // Aligns the top of the element to the top of the viewport
        });
    }
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % images.length;
    imgRef.current.src = images[currentIndex];
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    imgRef.current.src = images[currentIndex];
  };

  return (
    <div className="hero-banner">
      <img ref={imgRef}
        src={images[0]}
        alt="Travel destination"
        className="hero-image"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="hero-text">
        <h1>Explore The World With Us</h1>
        <p>
          Find the best tour packages, holiday trips, and affordable travel
          deals curated specially for you.
        </p>
        <button onClick={handlePackagesNavigation}>View Packages</button>
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

export default memo(HeroSection);
