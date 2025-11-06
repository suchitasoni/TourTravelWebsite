import { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, IconButton, duration } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Helmet } from "react-helmet-async";
import "./Packages.css";

const packagesData = [
  {
    id: 1,
    title: "Goa Holiday Package",
    image: "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762112536/r64sirj4dplynouqcfae.jpg",
    description: "Beaches · Nightlife",
    price: "20,000",
    duration: "5N/6D"
  },
  {
    id: 2,
    title: "Kashmir Paradise Tour",
    image: "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762112536/hiyms4y54dwur0bksw1w.jpg",
    description: "Gulmarg · Dal Lake",
    price: "25,000",
    duration: "6N/7D"
  },
  {
    id: 3,
    title: "Char Dham Yatra",
    image: "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762112416/rigzvp6v7t7roe5y46l1.jpg",
    description: "Spiritual · Mountains",
    price: "30,000",
    duration: "8N/9D"
  },
  {
    id: 4,
    title: "Shimla-Manali Trip",
    image: "https://res.cloudinary.com/dt5wgcgwl/image/upload/v1762112390/yvbl9s8iaveuc0nd63yw.jpg",
    description: "Hill Stations · Adventure",
    price: "28,000",
    duration: "7N/8D"
  }
];

export default function Packages() {
  const [startIndex, setStartIndex] = useState(0);

  const next = () => {
    setStartIndex((prev) => (prev + 1) % packagesData.length);
  };

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + packagesData.length) % packagesData.length);
  };

  const firstIndex = startIndex;
  const secondIndex = (startIndex + 1) % packagesData.length;
  const thirdIndex = (startIndex + 2) % packagesData.length;

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, []);


  return (
    <div style={{padding:'0px 15px',position:'relative'}}>

      {/* ✅ SEO Optimization */}
      <Helmet>
        <title>Best Tour Packages | Explore Top Travel Deals</title>
        <meta
          name="description"
          content="Browse our curated tour packages including Goa, Bali, Dubai, Kashmir and more. Handpicked deals with premium experiences."
        />
      </Helmet>

      {/* ✅ Package Card Carousel */}
      <div className="package-cards-group">
        <Card
          sx={{
            width: 320,
            borderRadius: 3,
            boxShadow: 4,
            transition: "0.5s ease",
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={packagesData[firstIndex].image}
            alt={packagesData[firstIndex].title}
          />

          <CardContent>
            <Typography variant="body2" sx={{fontSize: '16px',color: '#000000',backgroundColor: '#FFFFFF',border: '1px solid #FFFFFF',
width: 'fit-content',padding: '4px 12px',position: 'absolute',bottom: '85%',borderRadius: '16px', fontWeight: 600}}>
                {packagesData[firstIndex].duration}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {packagesData[firstIndex].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {packagesData[firstIndex].description}
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{mt: 1 }}>
              Starting at ₹ {packagesData[firstIndex].price} <span style={{fontWeight: 400}}>/person</span>
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: 320,
            borderRadius: 3,
            boxShadow: 4,
            transition: "0.5s ease",
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={packagesData[secondIndex].image}
            alt={packagesData[secondIndex].title}
          />

          <CardContent>
            <Typography variant="body2" sx={{fontSize: '16px',color: '#000000',backgroundColor: '#FFFFFF',border: '1px solid #FFFFFF',
width: 'fit-content',padding: '4px 12px',position: 'absolute',bottom: '85%',borderRadius: '16px', fontWeight: 600}}>
                {packagesData[secondIndex].duration}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {packagesData[secondIndex].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {packagesData[secondIndex].description}
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{mt: 1 }}>
              Starting at ₹ {packagesData[secondIndex].price} <span style={{fontWeight: 400}}>/person</span>
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{
            width: 320,
            borderRadius: 3,
            boxShadow: 4,
            transition: "0.5s ease",
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={packagesData[thirdIndex].image}
            alt={packagesData[thirdIndex].title}
          />

          <CardContent>
            <Typography variant="body2" sx={{fontSize: '16px',color: '#000000',backgroundColor: '#FFFFFF',border: '1px solid #FFFFFF',
width: 'fit-content',padding: '4px 12px',position: 'absolute',bottom: '85%',borderRadius: '16px', fontWeight: 600}}>
                {packagesData[thirdIndex].duration}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {packagesData[thirdIndex].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {packagesData[thirdIndex].description}
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{mt: 1 }}>
              Starting at ₹ {packagesData[thirdIndex].price} <span style={{fontWeight: 400}}>/person</span>
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Prev Button */}
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

      {/* ✅ Next Button */}
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
  );
}
