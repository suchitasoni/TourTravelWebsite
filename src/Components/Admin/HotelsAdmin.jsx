import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const HotelsAdmin = () => {
  const hotelsCollection = collection(db, "hotels");

  const [tab, setTab] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [existingHotelImages, setExistingHotelImages] = useState([]);

  const fetchHotels = async () => {
    const snapshot = await getDocs(hotelsCollection);
    setHotels(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDeleteHotel = async (id) => {
    await deleteDoc(doc(db, "hotels", id));
    fetchHotels();
  };

  // ---------------- YOUR EXISTING STATES ----------------

  const [hotelData, setHotelData] = useState({
    name: "",
    locationLink: "",
    starRating: "",
    address: "",
    phone: "",
    about: "",
    checkIn: "",
    checkOut: "",
    images: [],
  });

  const [amenities, setAmenities] = useState([]);
  const [propertyRules, setPropertyRules] = useState({
    coupleRules: [],
    guestRules: [],
    generalRules: [],
  });

  const [hotelImages, setHotelImages] = useState([]);
  const [rooms, setRooms] = useState([]);

  const predefinedAmenities = [
    "Room Service",
    "Power Backup",
    "Refrigerator",
    "TV",
    "Housekeeping",
    "Parking",
    "Wi-Fi",
    "Air Conditioning",
    "Toiletries",
    "Laundry Service",
    "24/7 Front Desk",
    "Restaurant",
    "Geyser/Water Heater",
    "CCTV",
  ];
  const predefinedRoomAmenities = [
    "Breakfast Included",
    "AC",
    "TV",
    "WiFi",
    "Attached Bathroom",
    "Balcony",
    "Geyser",
    "Wardrobe",
  ];
  const predefinedCoupleRules = [
    "Unmarried couples are not allowed",
    "Local IDs are not allowed",
  ];

  const predefinedGuestRules = [
    "Primary guest should be at least 18 years of age",
  ];

  const uploadImages = async (files, folder) => {
    const uploads = files.map(async (file) => {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      form.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: form },
      );

      const data = await res.json();

      return {
        url: data.secure_url,
        public_id: data.public_id,
      };
    });

    return Promise.all(uploads);
  };

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        id: Date.now(),
        name: "",
        locationLink: "",
        price: "",
        capacity: "",
        bedType: "",
        freeCancellation: false,
        roomAmenities: [],
        roomImages: [],
        selectedFiles: [],
      },
    ]);
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };
  const deleteFromCloudinary = async (public_id) => {
    await fetch("/.netlify/functions/delete-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicIds: [public_id] }),
    });
  };

  const removeHotelImage = async (img) => {
    await deleteFromCloudinary(img.public_id);
    const updated = existingHotelImages.filter(
      (i) => i.public_id !== img.public_id,
    );
    setExistingHotelImages(updated);
  };

  const removeRoomImage = async (roomIndex, img) => {
    await deleteFromCloudinary(img.public_id);

    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].roomImages = updatedRooms[
      roomIndex
    ].roomImages.filter((i) => i.public_id !== img.public_id);
    setRooms(updatedRooms);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const newHotelImages =
        hotelImages.length > 0
          ? await uploadImages(hotelImages, "maihar-hotels")
          : [];

      const finalHotelImages = [...existingHotelImages, ...newHotelImages];

      const uploadedRooms = await Promise.all(
        rooms.map(async (room) => {
          const newRoomImages =
            room.selectedFiles?.length > 0
              ? await uploadImages(room.selectedFiles, "maihar-hotels/rooms")
              : [];

          return {
            id: room.id,
            name: room.name,
            price: room.price,
            capacity: room.capacity,
            bedType: room.bedType,
            freeCancellation: room.freeCancellation,
            roomAmenities: room.roomAmenities,
            roomImages: [...(room.roomImages || []), ...newRoomImages],
        };
        }),
      );

      const finalData = {
        ...hotelData,
        amenities,
        propertyRules,
        images: finalHotelImages,
        rooms: uploadedRooms,
        createdAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, "hotels", editId), finalData);
        alert("Hotel Updated");
      } else {
        await addDoc(hotelsCollection, finalData);
        alert("Hotel Added");
      }

      resetForm();
      fetchHotels();
      setTab(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================

  const handleEdit = (hotel) => {
    setEditId(hotel.id);

    setHotelData({
      name: hotel.name || "",
      locationLink: hotel.locationLink || "",
      starRating: hotel.starRating || "",
      address: hotel.address || "",
      phone: hotel.phone || "",
      about: hotel.about || "",
      checkIn: hotel.checkIn || "",
      checkOut: hotel.checkOut || "",
      images: hotel.images || [], 
    });

    setAmenities(hotel.amenities || []);

    setPropertyRules({
      coupleRules: hotel.propertyRules?.coupleRules || [],
      guestRules: hotel.propertyRules?.guestRules || [],
      generalRules: hotel.propertyRules?.generalRules || [],
    });

    setExistingHotelImages(hotel.images || []);
    setRooms(hotel.rooms || []);

    setTab(1);
  };

  // ================= DELETE HOTEL =================
  const handleDelete = async (hotel) => {
    const publicIds = [];

    hotel.images?.forEach((img) => publicIds.push(img.public_id));

    hotel.rooms?.forEach((room) =>
      room.roomImages?.forEach((img) => publicIds.push(img.public_id)),
    );

    await fetch("/.netlify/functions/delete-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicIds }),
    });

    await deleteDoc(doc(db, "hotels", hotel.id));
    fetchHotels();
  };

  const resetForm = () => {
    setEditId(null);
    setHotelData({
      name: "",
      locationLink: "",
      starRating: "",
      address: "",
      phone: "",
      about: "",
      checkIn: "",
      checkOut: "",
      images: [],
    });
    setAmenities([]);
    setPropertyRules({
      coupleRules: [],
      guestRules: [],
      generalRules: [],
    });
    setHotelImages([]);
    setExistingHotelImages([]);
    setRooms([]);
  };

  return (
    <Box p={4}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="View Hotels" />
        <Tab label={editId ? "Edit Hotel" : "Add Hotel"} />
      </Tabs>
      {/* VIEW TAB */}
      {tab === 0 && (
        <Grid container spacing={3} mt={2}>
          {hotels.map((hotel) => (
            <Grid item xs={12} md={6} key={hotel.id}>
              <Paper sx={{ p: 3 }}>
                <Typography fontWeight="bold">{hotel.name}</Typography>
                <Typography variant="body2" ml={1}>
                  {hotel.address}
                </Typography>

                <IconButton onClick={() => handleEdit(hotel)}>
                  <EditIcon />
                </IconButton>

                <IconButton color="error" onClick={() => handleDelete(hotel)}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      {/* <Typography variant="h4" mb={3}>
        Add Hotel
      </Typography> */}
      {tab === 1 && (
        <Box mt={3}>
          <TextField
            label="Hotel Name"
            fullWidth
            margin="normal"
            value={hotelData.name}
            onChange={(e) =>
              setHotelData({ ...hotelData, name: e.target.value })
            }
          />
          <TextField
            label="Location Link"
            fullWidth
            margin="normal"
            value={hotelData.locationLink}
            onChange={(e) =>
              setHotelData({ ...hotelData, locationLink: e.target.value })
            }
          />

          <TextField
            label="Star Rating"
            fullWidth
            margin="normal"
            value={hotelData.starRating}
            onChange={(e) =>
              setHotelData({ ...hotelData, starRating: e.target.value || "" })
            }
          />

          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={hotelData.address}
            onChange={(e) =>
              setHotelData({ ...hotelData, address: e.target.value })
            }
          />

          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={hotelData.phone}
            onChange={(e) =>
              setHotelData({ ...hotelData, phone: e.target.value || "" })
            }
          />

          <TextField
            label="About Property"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={hotelData.about}
            onChange={(e) =>
              setHotelData({ ...hotelData, about: e.target.value })
            }
          />

          <TextField
            label="Check In"
            margin="normal"
            placeholder="1 PM"
            value={hotelData.checkIn}
            onChange={(e) =>
              setHotelData({ ...hotelData, checkIn: e.target.value })
            }
          />

          <TextField
            label="Check Out"
            margin="normal"
            placeholder="11 AM"
            value={hotelData.checkOut}
            onChange={(e) =>
              setHotelData({ ...hotelData, checkOut: e.target.value })
            }
          />
          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Couple/Bachelor Rules</Typography>

          {predefinedCoupleRules.map((rule) => (
            <FormControlLabel
              key={rule}
              control={
                <Checkbox
                  checked={propertyRules.coupleRules.includes(rule)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setPropertyRules((prev) => ({
                        ...prev,
                        coupleRules: [...prev.coupleRules, rule],
                      }));
                    else
                      setPropertyRules((prev) => ({
                        ...prev,
                        coupleRules: prev.coupleRules.filter((r) => r !== rule),
                      }));
                  }}
                />
              }
              label={rule}
            />
          ))}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Guest Rules</Typography>

          {predefinedGuestRules.map((rule) => (
            <FormControlLabel
              key={rule}
              control={
                <Checkbox
                  checked={propertyRules.guestRules.includes(rule)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setPropertyRules((prev) => ({
                        ...prev,
                        guestRules: [...prev.guestRules, rule],
                      }));
                    else
                      setPropertyRules((prev) => ({
                        ...prev,
                        guestRules: prev.guestRules.filter((r) => r !== rule),
                      }));
                  }}
                />
              }
              label={rule}
            />
          ))}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Amenities</Typography>
          {predefinedAmenities.map((amenity) => (
            <FormControlLabel
              key={amenity}
              control={
                <Checkbox
                  checked={amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) setAmenities([...amenities, amenity]);
                    else setAmenities(amenities.filter((a) => a !== amenity));
                  }}
                />
              }
              label={amenity}
            />
          ))}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Hotel Images</Typography>
          {editId && hotelData.images?.length > 0 && (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    {hotelData.images.map((img, i) => (
      <Grid item xs={4} md={3} key={i}>
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <img
            src={img.url}
            alt="Hotel"
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
            }}
          />

          {/* DELETE BUTTON */}
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
            }}
            onClick={async () => {
              await deleteFromCloudinary(img.public_id);

              const updatedImages = hotelData.images.filter(
                (image) => image.public_id !== img.public_id
              );

              setHotelData({
                ...hotelData,
                images: updatedImages,
              });

              if (editId) {
                await updateDoc(
                  doc(db, "hotels", editId),
                  { images: updatedImages }
                );
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Grid>
    ))}
  </Grid>
)}
          <input
            type="file"
            multiple
            onChange={(e) => setHotelImages(Array.from(e.target.files))}
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Rooms</Typography>

          {rooms.map((room, index) => (
            <Paper key={room.id} sx={{ p: 2, my: 2 }}>
              <TextField
                label="Room Name"
                fullWidth
                margin="normal"
                value={room.name}
                onChange={(e) =>
                  handleRoomChange(index, "name", e.target.value)
                }
              />
              <TextField
                label="Price"
                type="number"
                fullWidth
                margin="normal"
                value={room.price}
                onChange={(e) =>
                  handleRoomChange(index, "price", e.target.value)
                }
              />
              <TextField
                label="Capacity"
                fullWidth
                margin="normal"
                placeholder="Max 3"
                value={room.capacity}
                onChange={(e) =>
                  handleRoomChange(index, "capacity", e.target.value)
                }
              />
              <TextField
                label="Bed Type"
                fullWidth
                margin="normal"
                value={room.bedType}
                onChange={(e) =>
                  handleRoomChange(index, "bedType", e.target.value)
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={room.freeCancellation}
                    onChange={(e) =>
                      handleRoomChange(
                        index,
                        "freeCancellation",
                        e.target.checked,
                      )
                    }
                  />
                }
                label="Free Cancellation"
              />
              <Typography mt={2}>Room Amenities</Typography>

              {predefinedRoomAmenities.map((amenity) => (
                <FormControlLabel
                  key={amenity}
                  control={
                    <Checkbox
                      checked={room.roomAmenities.includes(amenity)}
                      onChange={(e) => {
                        const updatedRooms = [...rooms];

                        if (e.target.checked) {
                          updatedRooms[index].roomAmenities.push(amenity);
                        } else {
                          updatedRooms[index].roomAmenities = updatedRooms[
                            index
                          ].roomAmenities.filter((a) => a !== amenity);
                        }

                        setRooms(updatedRooms);
                      }}
                    />
                  }
                  label={amenity}
                />
              ))}

              <Typography mt={2}>Room Images</Typography>
              {editId && room.roomImages?.length > 0 && (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    {room.roomImages.map((img, i) => (
      <Grid item xs={4} md={3} key={i}>
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <img
            src={img.url}
            alt="Room"
            style={{
              width: "100%",
              height: "100px",
              objectFit: "cover",
            }}
          />

          {/* DELETE BUTTON */}
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
            }}
            onClick={async () => {
              await deleteFromCloudinary(img.public_id);

              const updatedRooms = [...rooms];
              updatedRooms[index].roomImages =
                updatedRooms[index].roomImages.filter(
                  (image) =>
                    image.public_id !== img.public_id
                );

              setRooms(updatedRooms);

              if (editId) {
                await updateDoc(
                  doc(db, "hotels", editId),
                  { rooms: updatedRooms }
                );
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Grid>
    ))}
  </Grid>
)}
              <input
                type="file"
                multiple
                onChange={(e) =>
                  handleRoomChange(
                    index,
                    "selectedFiles",
                    Array.from(e.target.files) || [],
                  )
                }
              />
            </Paper>
          ))}

          <Button variant="outlined" onClick={handleAddRoom}>
            Add Room
          </Button>

          <Divider sx={{ my: 3 }} />

          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Hotel"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HotelsAdmin;
