import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const Gallery = () => {
    const [images, setImages] = useState([]);

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
  }, []);

  return (
    <div className="gallery-page">
        <h1>Gallery</h1>
        <p>Welcome to the Gallery page. Explore our collection of travel photos!</p>
        <div style={{display:'flex',flexWrap:'wrap'}}>
            {images.map((img) => (
                <div key={img.id} className="gallery-item">
                    <img src={img.imageUrl} alt="Gallery" style={{width:'250px'}} />
                </div>
            ))}
        </div>
    </div>
  );
}
export default Gallery;