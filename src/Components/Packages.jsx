import { useState, useEffect } from "react";
import { Tabs, Tab, Card, CardContent, CardMedia, Typography, Box, Grid, Skeleton } from "@mui/material";
import { Helmet } from "react-helmet-async";
import "./Packages.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Packages() {
  const [activeTab, setActiveTab] = useState("All");
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "packages"));
      const data = snap.docs.map((d) => d.data());
      console.log("Fetched packages:", data);
      setLoading(false);
      return data;
    };
    fetchPackages().then((data) => {
      setAllPackages(data);
      const cats = Array.from(new Set(data.map((pkg) => pkg.category)));
      setCategories(["All", ...cats]);
      setFilteredPackages(data);
    });
  }, []);

  useEffect(() => {
    if (activeTab == "All") {
      setFilteredPackages(allPackages);
    }
    else{
      const filtered = allPackages.filter((pkg) => pkg.category === activeTab);
      setFilteredPackages(filtered);
    }
  }, [activeTab]);

  // const categories = [
  //   "Spiritual",
  //   "Hill Station",
  //   "Beach & Island",
  //   "Nature & Serenity",
  //   "International",
  //   "Special Tours"
  // ];

  return (
    <div className="packages-section">
      {/* ✅ SEO Optimization */}
      <Helmet>
        <title>Tour Packages by Category | Explore India & Beyond</title>
        <meta
          name="description"
          content="Browse our curated tour packages by category including Spiritual, Hill Stations, Beach, Nature, and International destinations."
        />
      </Helmet>

      <Typography variant="h4" align="center" className="packages-title">
        Explore Our Tour Packages
      </Typography>

      {/* ✅ Category Tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="package categories"
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>
      </Box>

      {/* ✅ Packages Grid */}
      <Box className="carousel-container">
        <button className="scroll-btn left" onClick={() => {
          document.querySelector('.carousel-inner').scrollBy({ left: -320, behavior: 'smooth' });
        }}>‹</button>

        <div className="carousel-inner">
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
          filteredPackages.map((pkg) => (
            <Link key={pkg.id} to={`/itinerary/${pkg.id}`}>
              <Card key={pkg.id} className="package-card carousel-card">
                <CardMedia
                  component="img"
                  height="180"
                  image={pkg.imageUrl}
                  alt={pkg.title}
                />
                <CardContent>
                  <Typography variant="body2" className="duration-badge">
                    {pkg.duration}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {pkg.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {pkg.description}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                    {pkg.price > 0 ? `Starting at ₹ ${pkg.price} /person` : "Coming Soon"}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
        </div>

        <button className="scroll-btn right" onClick={() => {
          document.querySelector('.carousel-inner').scrollBy({ left: 320, behavior: 'smooth' });
        }}>›</button>
      </Box>
    </div>
  );
}
