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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nextTrips.map((trip) => (
                <tr key={trip.destination}>
                  <td>{trip.destination}</td>
                  <td><input type="text" defaultValue={trip.tripDate} onChange={(e) => handleInputChange(trip.destination, e.target.value)}/></td>
                  <td><button onClick={(e) => handleSaveNextTrip(e, trip.destination)}>Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Box>
  );
};

export default ViewPackages;