import { memo, useEffect, useState } from "react";
import "./Hero.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRenderCount } from "../TourDataContext";

const slides = [
  {
    image:
      "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1771502624/mu4g5u0xrt4px4nuxjic.jpg",
    title: "Explore The World With Us",
    description:
      "Experience Yamunotri, Gangotri, Kedarnath & Badrinath and more with comfort & guidance.",
    buttonText: "View Packages",
    buttonAction: "packages"
  },
  {
    image:
      "https://res.cloudinary.com/dt5wgcgwl/image/upload/c_crop,w_1470,h_497/v1771842924/xamevakkgi1irrarkx9w.png",
    title: "Book Taxi Services",
    description:
      `Book Taxi Services in Satna, Maihar, Jabalpur and more.
       Call us at 7089211414 or 919300304422.`,
    buttonText: "Book Now",
    buttonAction: "taxi"
  },
];

const HeroSection = ({ setOpen }) => {
  useRenderCount("HeroSection");

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePackagesNavigation = (action) => {
    if (action === "taxi") {
      setOpen(true);
    }
    if (action === "packages") {
      const element = document.getElementById("packages");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className="hero-banner">

      <img
        src={slides[currentIndex].image}
        alt="Travel destination"
        className="hero-image"
        fetchpriority="high"
        loading="eager"
        decoding="async"
      />

      <div className="hero-overlay"></div>

      <div className="hero-text">
        <h1>{slides[currentIndex].title}</h1>
        <p style={{maxWidth: '87%',placeSelf: 'center',justifySelf: 'center'}}>{slides[currentIndex].description}</p>
        <button onClick={() => handlePackagesNavigation(slides[currentIndex].buttonAction)}>
          {slides[currentIndex].buttonText}
        </button>
      </div>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: "0",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.4)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.7)" },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: "0",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.4)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.7)" },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
};

export default memo(HeroSection);
