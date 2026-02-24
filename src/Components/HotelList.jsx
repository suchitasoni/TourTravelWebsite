import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Skeleton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const HotelList = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndexes, setCurrentIndexes] = useState({});

  // 🔹 Fetch Hotels
  useEffect(() => {
    const fetchHotels = async () => {
      const snapshot = await getDocs(collection(db, "hotels"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHotels(data);

      const initialIndexes = {};
      data.forEach((hotel) => {
        initialIndexes[hotel.id] = 0;
      });
      setCurrentIndexes(initialIndexes);

      setLoading(false);
    };

    fetchHotels();
  }, []);

  // 🔥 Auto Slider (Optimized)
  useEffect(() => {
    if (hotels.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndexes((prev) => {
        const updated = { ...prev };

        hotels.forEach((hotel) => {
          if (hotel.images?.length > 1) {
            updated[hotel.id] = (prev[hotel.id] + 1) % hotel.images.length;
          }
        });

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [hotels]);
  const getLowestRoomPrice = (rooms = []) =>
  rooms.reduce((min, room) => {
    const price = Number(room.price);
    return price > 0 && price < min ? price : min;
  }, Infinity);

  // 🔹 Memoized Hotels Grid (Performance Boost)
  const hotelCards = useMemo(() => {
    return hotels.map((hotel) => {
      const imageIndex = currentIndexes[hotel.id] || 0;
      const imageUrl =
        hotel.images?.[imageIndex]?.url ||
        "https://via.placeholder.com/400x250";

      return (
        <Grid item xs={12} sm={6} md={4} key={hotel.id}>
          <Card
            sx={{
              borderRadius: 3,
              minHeight: '100%',
              boxShadow: 3,
              cursor: "pointer",
              transition: "0.3s",
              overflow: "hidden",
              "&:hover": { transform: "scale(1.03)" },
            }}
            onClick={() => navigate(`/hotel/${hotel.id}`)}
          >
            {/* 🔥 Lazy Loaded Image */}
            <Box sx={{ height: 220, overflow: "hidden" }}>
              <img
                src={imageUrl}
                alt={hotel.name}
                loading="lazy"
                decoding="async"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/400x250")
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "0.8s ease-in-out",
                }}
              />
            </Box>

            <CardContent sx={{display: 'flex',flexDirection: 'column',
minHeight: '200px',
justifyContent: 'space-between'}}>
              <Typography variant="h6" fontWeight="bold">
                {hotel.name}
              </Typography>

              <Box display="flex" alignItems="center" mt={1}>
                <LocationOnIcon fontSize="small" color="error" />
                <Typography variant="body2" ml={1}>
                  {hotel.address}
                </Typography>
              </Box>

              <Typography variant="h6" color="primary" mt={2} fontWeight="bold">
                Starting From ₹{getLowestRoomPrice(hotel.rooms)}
              </Typography>

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PhoneIcon />}
                  href={`tel:${hotel.phone}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Call Now
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<LocationOnIcon />}
                  href={hotel.locationLink}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  Location
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    });
  }, [hotels, currentIndexes, navigate]);

  return (
    <Box sx={{ py: 6, px: 3 }}>
      <Typography variant="h4" align="center" className="packages-title" mb={4}>
        Hotels in Maihar
      </Typography>

      <Grid container spacing={4}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <Skeleton variant="rectangular" height={220} />
                  <CardContent>
                    <Skeleton width="70%" height={30} />
                    <Skeleton width="90%" />
                    <Skeleton width="50%" height={30} />
                    <Box mt={2} display="flex" gap={2}>
                      <Skeleton variant="rectangular" width={100} height={36} />
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : hotelCards}
      </Grid>
    </Box>
  );
};

export default HotelList;
