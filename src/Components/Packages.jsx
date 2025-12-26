import { useState, useEffect, memo } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import "./Packages.css";
import { Link } from "react-router-dom";
import { useRenderCount, useTourData } from "../TourDataContext";
import { useTourUI } from "../TourUIContext";

function Packages() {
  const [activeTab, setActiveTab] = useState("All");
  // const [loaded, setLoaded] = useState(false);

  const { packages, loading, categories } = useTourData();
  const { filteredPackages, setFilteredPackages } = useTourUI();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  useRenderCount("Packages");
  // Trigger flip animation once component mounts
  // useEffect(() => {
  //   setLoaded(true);
  // }, []);

  // Filter packages by category
  useEffect(() => {
    if (activeTab === "All") {
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
                  style={{ animationDelay: `${index == 0 ? 500 : index * 500}ms` }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={pkg.imageUrl}
                    alt={pkg.title}
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

                      <Typography variant="body1" fontWeight={600}>
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