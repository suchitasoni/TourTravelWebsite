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
} from "firebase/firestore";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // your preset name
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // your cloud name

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch gallery images from Firestore
  const fetchImages = async () => {
    const snapshot = await getDocs(collection(db, "gallery"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload multiple images to Cloudinary
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
    if (!window.confirm("Delete this image?")) {
      return;
    }

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

      {/* Upload section */}
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
      </div>

      {/* Preview grid */}
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
              position: "relative",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={img.imageUrl}
              alt=""
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <button
              onClick={() => handleDelete(img.id, img.imageUrl)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                border: "none",
                padding: "5px 8px",
                borderRadius: "4px",
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
