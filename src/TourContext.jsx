// src/context/TourContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "packages"));
      const data = snap.docs.map((d) => d.data());
      console.log("Fetched packages:", data);
      setLoading(false);
      return data;
    };
    fetchPackages().then((data) => {
      setPackages(data);
      const cats = Array.from(new Set(data.map((pkg) => pkg.category)));
      setCategories(["All", ...cats]);
      setFilteredPackages(data);
    });
  }, []);

  return (
    <TourContext.Provider value={{ packages, loading, categories, filteredPackages, setFilteredPackages }}>
        {loading &&
        <div className="global-loader-overlay">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
        }
        {children}
    </TourContext.Provider>
  );
};

// Custom hook
export const useTourDetails = () => useContext(TourContext);
