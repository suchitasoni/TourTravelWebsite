import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
} from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const TourDataContext = createContext();

export const TourDataProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "packages"));
      const data = snap.docs.map((d) => d.data());
      setLoading(false);

      setPackages(data);
      const cats = Array.from(new Set(data.map((pkg) => pkg.category)));
      setCategories(["All", ...cats]);
    };

    fetchPackages();
  }, []);

  const value = useMemo(
    () => ({
      packages,
      categories,
      loading,
    }),
    [packages, categories, loading]
  );

  return (
    <TourDataContext.Provider value={value}>
      {loading && (
        <div className="global-loader-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      {children}
    </TourDataContext.Provider>
  );
};

export const useTourData = () => useContext(TourDataContext);
// Custom hook 
export function useRenderCount(name = "Component") {
  const count = useRef(1); 
  console.log(`🔁 ${name} rendered ${count.current++} times`);
}