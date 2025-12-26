import {
  createContext,
  useState,
  useContext,
  useMemo,
} from "react";

const TourUIContext = createContext();

export const TourUIProvider = ({ children }) => {
  const [filteredPackages, setFilteredPackages] = useState([]);

  const value = useMemo(
    () => ({
      filteredPackages,
      setFilteredPackages,
    }),
    [filteredPackages]
  );

  return (
    <TourUIContext.Provider value={value}>
      {children}
    </TourUIContext.Provider>
  );
};

export const useTourUI = () => useContext(TourUIContext);
