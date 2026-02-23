// src/admin/GalleryAdmin.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedPlaces, setEditedPlaces] = useState({}); // track edits

  // Fetch images
  const fetchImages = async () => {
    const snapshot = await getDocs(collection(db, "gallery"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle place change
  const handlePlaceChange = (id, value) => {
    setEditedPlaces((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save all changes in single batch
  const handleSaveAll = async () => {
    if (Object.keys(editedPlaces).length === 0) {
      return alert("No changes to save!");
    }

    try {
      const batch = writeBatch(db);

      Object.entries(editedPlaces).forEach(([id, place]) => {
        const docRef = doc(db, "gallery", id);
        batch.update(docRef, { place });
      });

      await batch.commit();

      alert("All changes saved successfully!");

      setEditedPlaces({});
      fetchImages();
    } catch (err) {
      console.error("Batch update failed:", err);
      alert("Failed to save changes!");
    }
  };

  // Upload
  const handleUpload = async () => {
    if (!files.length) return alert("Please select images first!");
    setLoading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();

        if (data.secure_url) {
          await addDoc(collection(db, "gallery"), {
            imageUrl: data.secure_url,
            createdAt: serverTimestamp(),
            place: file.name.split(".")[0],
          });
        }
      }

      alert("All images uploaded successfully!");
      setFiles([]);
      fetchImages();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // Delete from Firestore + Cloudinary
  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteDoc(doc(db, "gallery", id));
      const res = await fetch("/.netlify/functions/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }), // or { public_id }
      });

      const data = await res.json();
      if (data.success){
        console.log("Deleted:", data.public_id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      } 
      else console.error("Delete failed:", data.error);
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="gallery-admin" style={{ padding: "2rem" }}>
      <h2>🖼️ Admin Gallery</h2>

      {/* Upload Section */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Images"}
        </button>

        {/* Save All Button */}
        <button
          onClick={handleSaveAll}
          style={{ marginLeft: "1rem", background: "#0b2c46", color: "#fff" }}
        >
          Save All Changes
        </button>
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              padding: "0.5rem",
              background: "#fff",
            }}
          >
            <img
              src={img.imageUrl}
              alt=""
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />

            {/* Editable place field */}
            <input
              type="text"
              value={editedPlaces[img.id] ?? img.place ?? ""}
              onChange={(e) =>
                handlePlaceChange(img.id, e.target.value)
              }
              style={{
                width: "100%",
                marginTop: "0.5rem",
                padding: "6px",
              }}
            />

            <button
              onClick={() => handleDelete(img.id, img.imageUrl)}
              style={{
                marginTop: "0.5rem",
                width: "100%",
                background: "#c62828",
                color: "white",
                border: "none",
                padding: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdmin;
