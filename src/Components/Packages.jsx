import { useState, useEffect, memo } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {Helmet} from "react-helmet-async";
import "./Packages.css";
import { Link } from "react-router-dom";
import { useRenderCount, useTourData } from "../TourDataContext";
import { useTourUI } from "../TourUIContext";

const getOptimizedImage = (url) =>
  url.replace(
    "/upload/",
    "/upload/c_fill,w_400,h_250,q_auto,f_auto/"
  );

function Packages() {
  const [activeTab, setActiveTab] = useState("All");
  // const [loaded, setLoaded] = useState(false);

  const { packages, loading, categories } = useTourData();
  const { filteredPackages, setFilteredPackages } = useTourUI();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  useRenderCount("Packages");

useEffect(() => {
  if (!filteredPackages.length) return;

  const cards = document.querySelectorAll(".package-card.flip-in");

  cards.forEach((el, index) => {
    el.classList.remove("animate"); // reset
    el.style.animationDelay = `${index * 120}ms`;

    requestAnimationFrame(() => {
      el.classList.add("animate");
    });
  });
}, [filteredPackages]);

  // Filter packages by category
  useEffect(() => {
    if (activeTab === "All") {
      packages.sort((a,b) => a.priority - b.priority);
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(
        (pkg) => pkg.category === activeTab
      );
      setFilteredPackages(filtered);
    }
  }, [activeTab, packages]);

  return (
    <div id="packages-section" className="packages-section">
      {/* SEO */}
      <Helmet>
        <title>Tour Packages by Category | Explore India & Beyond</title>
        <meta
          name="description"
          content="Browse curated tour packages including Spiritual, Hill Stations, Beaches, Nature, and International destinations."
        />
      </Helmet>

      <Typography variant="h4" align="center" className="packages-title">
        Explore Our Tour Packages
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>
      </Box>

      <Box className="carousel-container">
        <button
          className="scroll-btn left"
          onClick={() =>
            document
              .querySelector(".carousel-inner")
              .scrollBy({ left: -320, behavior: "smooth" })
          }
        >
          ‹
        </button>

        <div className="carousel-inner" key={activeTab}>
          {loading ? (
            <div className="skeleton-container">
              {[...Array(3)].map((_, i) => (
                <Box key={i} className="skeleton-card">
                  <Skeleton variant="rectangular" width={280} height={180} />
                  <Skeleton variant="text" sx={{ mt: 1, width: "80%" }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              ))}
            </div>
          ) : (
            filteredPackages.map((pkg, index) => (
              <Link key={pkg.id} to={`/itinerary/${pkg.id}`}>
                <Card
                  className={`package-card carousel-card ${
                   "flip-in"
                  }`}
                  style={{ animationDelay: "120ms" }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={getOptimizedImage(pkg.imageUrl)}
                    alt={pkg.title}
                    loading="lazy"
                    width="300"
                    fetchpriority="low"
                  />

                  <CardContent>
                    <Typography className="duration-badge">
                      {pkg.duration}
                    </Typography>

                    <div className="card-content-wrapper">
                      <Typography variant="h6" fontWeight={600}>
                        {pkg.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {pkg.description}
                      </Typography>

                      <Typography variant="h7" color="primary" mt={2} fontWeight="bold">
                        {pkg.price > 0
                          ? `Starting at ₹ ${pkg.price} /person`
                          : "Coming Soon"}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        <button
          className="scroll-btn right"
          onClick={() =>
            document
              .querySelector(".carousel-inner")
              .scrollBy({ left: 320, behavior: "smooth" })
          }
        >
          ›
        </button>
      </Box>
    </div>
  );
}

export default memo(Packages);