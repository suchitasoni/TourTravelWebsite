import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  Rating,
  Skeleton,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import AcUnitIcon from "@mui/icons-material/AcUnit";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PowerIcon from "@mui/icons-material/Power";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Helmet } from "react-helmet-async";
import KitchenIcon from '@mui/icons-material/Kitchen';
import TvIcon from '@mui/icons-material/Tv';
import VideocamIcon from '@mui/icons-material/Videocam';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DeskIcon from '@mui/icons-material/Desk';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GasMeterIcon from '@mui/icons-material/GasMeter';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import BathtubIcon from '@mui/icons-material/Bathtub';
import BalconyIcon from '@mui/icons-material/Balcony';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import PhoneIcon from "@mui/icons-material/Phone";

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);

  // 🔥 Scroll to Top on Load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      const snapshot = await getDoc(doc(db, "hotels", id));
      if (snapshot.exists()) setHotel(snapshot.data());
      setLoading(false);
    };
    fetchHotel();
  }, [id]);

  const amenityIcons = {
    "Room Service": <RoomServiceIcon fontSize="small" />,
    "Wi-Fi": <NetworkWifiIcon fontSize="small" />,
    "Air Conditioning": <AcUnitIcon fontSize="small" />,
    "Parking": <LocalParkingIcon fontSize="small" />,
    "Power Backup": <PowerIcon fontSize="small" />,
    "Refrigerator": <KitchenIcon fontSize="small" />,
    "TV": <TvIcon fontSize="small" />,
    "CCTV": <VideocamIcon fontSize="small" />,
    "Housekeeping": <DoorFrontIcon fontSize="small" />,
    "Toiletries": <CleanHandsIcon fontSize="small" />,
    "Laundry Service": <LocalLaundryServiceIcon fontSize="small" />,
    "24/7 Front Desk": <DeskIcon fontSize="small" />,
    "Restaurant": <RestaurantIcon fontSize="small" />,
    "Geyser/Water Heater": <GasMeterIcon fontSize="small" />,
    "Wardrobe": <CheckroomOutlinedIcon fontSize="small" />,
     "Balcony": <BalconyIcon fontSize="small" />,
     "Breakfast Included": <LunchDiningIcon fontSize="small" />,
     "Attached Bathroom": <BathtubIcon fontSize="small" />,
  };

  const roomsSection = useMemo(() => {
    if (!hotel?.rooms) return null;

    return hotel.rooms.map((room, index) => (
      <Paper
        key={index}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <img
              src={room.roomImages?.[0]?.url}
              alt={room.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedRoomImages(room.roomImages);
                setOpenGallery(true);
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight="bold">
              {room.name}
            </Typography>

            <Typography mt={1}>
              {room.capacity} Guests | {room.bedType}
            </Typography>

            {room.freeCancellation && (
              <Typography color="green" mt={1}>
                ✓ Free Cancellation
              </Typography>
            )}

            <Box mt={2}>
              {room.roomAmenities?.map((a, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{ display: "inline-block", mr: 2 }}
                >
                  • {a}
                </Typography>
              ))}
            </Box>

            <Typography
              variant="h5"
              color="primary"
              mt={2}
              fontWeight="bold"
            >
              ₹ {room.price} per night
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    ));
  }, [hotel]);

  if (loading) {
    return (
      <Box p={5}>
        <Skeleton height={300} />
        <Skeleton height={40} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!hotel) return <Typography>Hotel not found</Typography>;

  return (
    <>
      <Helmet>
        <title>{hotel.name} | Hotel in Maihar</title>
        <meta
          name="description"
          content={`${hotel.name}. ${hotel.about}`}
        />
      </Helmet>

      <Box p={{ xs: 2, md: 6 }}>
    {/* TABS */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{ mt: 7 }}
        >
          <Tab label="Overview" />
          <Tab label="Photos" />
        </Tabs>
        <div style={{display:'flex',alignItems:'baseline'}}>
            <Typography variant="h4" fontWeight="bold" mt={3}>
            {hotel.name}
            <Rating
                value={Number(hotel.starRating) || 3}
                readOnly
                size="small"
                sx={{ ml: 2, mb: 2}}
            />
            </Typography>
             
            {hotel.phone && <IconButton
                color="primary"
                fontSize="large"
                href={`tel:${hotel.phone}`}
                sx={{backgroundColor: "rgba(0,123,255,0.1)", ml: 2}}
            >
                <PhoneIcon />
            </IconButton> }
        </div>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden" }}>
        <div><img
            src={hotel.images?.[0]?.url}
            alt="Hotel"
            loading="lazy"
            style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
            }}
            />
            {tab === 0 && (
              <Button 
                variant="contained"
                onClick={() => setTab(1)}
                sx={{
                    position: "absolute",
                    bottom: 16,
                right: 16,
                backgroundColor: "rgba(0,0,0,0.7)",
            }}
            >
            View All Photos
            </Button> )}</div>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {hotel.images?.slice(1, 3).map((img, i) => (
                <Grid item xs={6} md={12} key={i}>
                  <img
                    src={img.url}
                    alt="Hotel"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "165px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => setTab(1)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* OVERVIEW TAB */}
        {tab === 0 && (
          <Box mt={4}>

            {/* ABOUT */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                About Property
              </Typography>
              <Typography>{hotel.about}</Typography>
            </Paper>

            {/* AMENITIES */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                Amenities
              </Typography>
              <Grid container spacing={2}>
                {hotel.amenities?.map((a, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "#f5f7fa",
                        padding: "8px 12px",
                        borderRadius: 2,
                      }}
                    >
                      {amenityIcons[a] || <RoomServiceIcon fontSize="small" />}
                      <Typography variant="body2">{a}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* ROOMS */}
            <Typography variant="h6" gutterBottom>
              Room Types
            </Typography>
            {roomsSection}

            {/* RULES */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h6">Property Rules</Typography>

              {hotel.propertyRules?.coupleRules?.map((r, i) => (
                <Typography key={i}>• {r}</Typography>
              ))}

              {hotel.propertyRules?.guestRules?.map((r, i) => (
                <Typography key={i}>• {r}</Typography>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography>
                <strong>Check-In:</strong> {hotel.checkIn}
              </Typography>
              <Typography>
                <strong>Check-Out:</strong> {hotel.checkOut}
              </Typography>
            </Paper>

            {/* LOCATION */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="bold">Address :</Typography>
                  <Typography>{hotel.address}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <iframe
                    title="map"
                    width="100%"
                    height="250"
                    style={{ borderRadius: "12px", border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      hotel.address
                    )}&output=embed`}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* PHOTOS TAB */}
        {tab === 1 && (
          <Grid container spacing={2} mt={3}>
            {hotel.images?.map((img, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <img
                  src={img.url}
                  alt="Hotel"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* ROOM GALLERY MODAL */}
      <Dialog
        open={openGallery}
        onClose={() => setOpenGallery(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Grid container spacing={2}>
            {selectedRoomImages.map((img, i) => (
              <Grid item xs={6} key={i}>
                <img
                  src={img.url}
                  alt="Room"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HotelDetails;