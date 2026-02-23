import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useRenderCount } from "../TourDataContext";
import "./Gallery.css";

const Gallery = () => {
    const [images, setImages] = useState([]);
    useRenderCount("Gallery");
    const [selectedImage, setSelectedImage] = useState(null);

    // Close on ESC key
    useEffect(() => {
        const fetchImages = async () => {
            const snap = await getDocs(collection(db, "gallery"));
            const data = snap.docs.map((d) => d.data());
            console.log("Fetched images:", data);
            return data;
        };
        fetchImages().then((data) => {
            setImages(data);
        });
        const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setSelectedImage(null);
        }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
    <div className="gallery-section">
      <h1 className="gallery-title">Gallery</h1>

      <div className="gallery-grid">
        {images.map((img) => (
          <div
            key={img.id}
            className="gallery-card"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.imageUrl}
              alt={img.place}
              className="gallery-image"
            />
            <div className="gallery-content">
              <h4>{img.place}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.place}
            />
            <p>{selectedImage.place}</p>
            <button
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Gallery;