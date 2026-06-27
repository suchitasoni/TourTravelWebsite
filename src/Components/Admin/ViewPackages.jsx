import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddPackage from "./AddPackage";
import { auth, db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ViewPackages = () => {
  const [tab, setTab] = useState(0);
  const [packages, setPackages] = useState([]);
  const [editPackage, setEditPackage] = useState(null);
  const [nextTrips, setNextTrips] = useState([]);
  const [packageData, setPackageData] = useState({
    destination: "",
    tripDate: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => setTab(newValue);
  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) navigate("/admin");
  }, []);
  const fetchPackages = async () => {
    const querySnapshot = await getDocs(collection(db, "packages"));
    const packageList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPackages(packageList);
    setPackageData({ destination: "", tripDate: "", imageUrl: "" }); // Reset packageData after fetching
  };
  const fetchNextTrip = async () => {
    const querySnapshot = await getDocs(collection(db, "nextTrips"));
    const nextTrips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNextTrips(nextTrips);
  };
  
  const handleDelete = async (id, imageUrl) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      await deleteDoc(doc(db, "packages", id));
      const res = await fetch("/.netlify/functions/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Package and image deleted successfully!");
      } else {
        console.warn("Image deletion failed:", result.error);
      }
      fetchPackages();
    }
  };

  const handleEdit = (id) => {
    const filteredArr = packages.filter((pkg)=> pkg.id == id);
    setEditPackage(filteredArr[0]);
    setTab(1);
    // redirect to edit form page or open modal later
    console.log("Edit package:", id);
  };
  const handleInputChange = (destination, value) => {
    const updatedTrips = nextTrips.map((trip) =>
      trip.destination === destination ? { ...trip, tripDate: value } : trip
    );
    setNextTrips(updatedTrips);
  };

  const handleSaveNextTrip = async (e, destination) => {
    e.preventDefault();
    await setDoc(doc(db, "nextTrips", destination.toLowerCase()), nextTrips.find(t => t.destination === destination));
    alert("Next trip updated successfully!");
  }

  useEffect(() => {
    if (tab === 0) fetchPackages();
    if (tab === 2) fetchNextTrip();
  }, [tab]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET); // replace with your Cloudinary preset

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, 
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      setPackageData((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Image upload failed. Please check your preset or file size.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddNextTrip = async (newTrip) => {
    try {
      await setDoc(doc(db, "nextTrips", newTrip.destination.toLowerCase()), newTrip);
      fetchNextTrip();
      setPackageData({ destination: "", tripDate: "", imageUrl: "" }); // Reset after adding
      alert("Next trip added successfully!");
    } catch (error) {
      console.error("Error adding next trip:", error);
      alert("Failed to add next trip.");
    }
  };
  const handleDeleteNextTrip = async (destination) => {
    if (window.confirm("Are you sure you want to delete this next trip?")) {
      try {
        await deleteDoc(doc(db, "nextTrips", destination.toLowerCase()));
        await fetch("/.netlify/functions/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: nextTrips.find(t => t.destination === destination)?.imageUrl })
        });
        fetchNextTrip();
      } catch (error) {
        console.error("Error deleting next trip:", error);
        alert("Failed to delete next trip.");
      }
    }
  };

  return (
    <Box className="packages-admin-container">
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="View All Packages" />
        <Tab label="Add New Package" />
        <Tab label="Add Next Trips" />
      </Tabs>

      {tab === 0 && (
        <div className="view-packages">
          <h2 className="tab-title">All Tour Packages</h2>
          {packages.length === 0 ? (
            <p>No packages found.</p>
          ) : (
            <table className="packages-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Region</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Visible</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>{pkg.title}</td>
                    <td>{pkg.category}</td>
                    <td>{pkg.region}</td>
                    <td>{pkg.duration}</td>
                    <td>₹{pkg.price}</td>
                    <td>{pkg.hide ? "No" : "Yes"}</td>
                    <td>{pkg.priority}</td>
                    <td className="action-buttons">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(pkg.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(pkg.id, pkg.imageUrl)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 1 && (
        <div className="add-package-tab">
          <AddPackage pkg={editPackage}/>
        </div>
      )}

      {tab === 2 && (
        <div className="add-next-trips-tab">
          <table className="packages-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Trip Date</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nextTrips.map((trip) => (
                <tr key={trip.destination}>
                  <td>{trip.destination}</td>
                  <td><input type="text" defaultValue={trip.tripDate} onChange={(e) => handleInputChange(trip.destination, e.target.value)}/></td>
                  <td><img src={trip.imageUrl} alt={trip.destination} width="100"/></td>
                  <td><button onClick={(e) => handleSaveNextTrip(e, trip.destination)}>Save</button>
                  <button onClick={() => handleDeleteNextTrip(trip.destination)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Add new trip</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddNextTrip(packageData);
          }}>
            <input type="text" name="destination" placeholder="Destination" required onChange={(e) => setPackageData({...packageData, destination: e.target.value})}/>
            <input type="text" name="tripDate" placeholder="Trip Date" required onChange={(e) => setPackageData({...packageData, tripDate: e.target.value})}/>
            <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {uploading && <p className="uploading-text">Uploading...</p>}
              {packageData.imageUrl && (
                <img src={packageData.imageUrl} alt="Preview" className="preview-img" />
              )}            <button type="submit">Add Next Trip</button>
          </form>
        </div>
      )}
    </Box>
  );
};

export default ViewPackages;