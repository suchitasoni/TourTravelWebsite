import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export default function AdminReviews() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [reviewLink, setReviewLink] = useState("");

  const [images, setImages] = useState([]);

  // Cloudinary ENV
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleImageUpload = async (files) => {
    const uploadedImages = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      uploadedImages.push(data.secure_url);
    }

    setImages(uploadedImages);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "reviews"), {
        name,
        rating: Number(rating),
        text,
        images, // ✅ Image URLs stored here
        date: reviewDate || "", // ✅ Manual or auto date,
        reviewLink: reviewLink || "" // ✅ Review link
      });

      alert("Review added successfully!");

      setName("");
      setRating(5);
      setText("");
      setImages([]);
      setReviewDate("");
      setReviewLink("");
    } catch (error) {
      console.error(error);
      alert("Error adding review");
    }
  };

  const [avgRating, setAvgRating] = useState("");
  const [totalReviews, setTotalReviews] = useState("");

  const handleUpdateAgencyInfo = async (e) => {
    e.preventDefault();

    await setDoc(doc(db, "agencyInfo", "overview"), {
      averageRating: Number(avgRating),
      totalReviews: Number(totalReviews),
    });

    alert("Agency rating updated!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel – Reviews</h1>

      {/* ADD REVIEW */}
      <h2>Add New Review</h2>
      <form onSubmit={handleAddReview}>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        >
          <option value="5">⭐ 5</option>
          <option value="4">⭐ 4</option>
          <option value="3">⭐ 3</option>
          <option value="2">⭐ 2</option>
          <option value="1">⭐ 1</option>
        </select>

        <textarea
          placeholder="Review Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        />

        {/* REVIEW DATE */}
        <input
          type="text"
          value={reviewDate}
          onChange={(e) => setReviewDate(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <input type="text" value={reviewLink} placeholder="Add review link" onChange={(e) => setReviewLink(e.target.value)} style={{ display: "block", marginBottom: "10px" }} />

        {/* IMAGE UPLOAD */}
        <label>Upload Review Images (optional):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files)}
          style={{ display: "block", marginBottom: "15px" }}
        />

        {/* Preview */}
        {images.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                width="120"
                style={{ marginRight: "10px", borderRadius: "8px" }}
              />
            ))}
          </div>
        )}

        <button type="submit">Add Review</button>
      </form>

      <hr style={{ margin: "40px 0" }} />

      {/* UPDATE AGENCY INFO */}
      <h2>Update Agency Overall Rating</h2>
      <form onSubmit={handleUpdateAgencyInfo}>
        <input
          type="number"
          step="0.1"
          placeholder="Average Rating (e.g., 4.8)"
          value={avgRating}
          onChange={(e) => setAvgRating(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <input
          type="number"
          placeholder="Total Reviews Count"
          value={totalReviews}
          onChange={(e) => setTotalReviews(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <button type="submit">Update Agency Info</button>
      </form>
    </div>
  );
}
