import React, { Suspense, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import ViewPackages from "./ViewPackages";
import EnquiriesAdmin from "./EnquiriesAdmin";
import GalleryAdmin from "./GalleryAdmin";
import { Hotel } from "@mui/icons-material";
import HotelsAdmin from "./HotelsAdmin";

const MetricsAdmin = React.lazy(() => import("./MetricsAdmin"));
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("packages");

  return (
    <div className="admin-dashboard">
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="admin-content">
        {activeTab === "packages" && <ViewPackages />}
        {activeTab === "hotels" && <HotelsAdmin />}
        {activeTab === "enquiries" && <EnquiriesAdmin />}
        {activeTab === "metrics" && <Suspense fallback={<div>Loading Metrics...</div>}><MetricsAdmin /></Suspense>}
        {activeTab === "gallery" && <GalleryAdmin />}
      </div>
    </div>
  );
}


const AdminNav = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  return (
    <div className="admin-nav">
      <h2 className="admin-logo">Maihar Online Admin</h2>
      <div className="admin-tabs">
        <button
          className={activeTab === "packages" ? "active" : ""}
          onClick={() => setActiveTab("packages")}
        >
          Packages
        </button>
        <button
          className={activeTab === "hotels" ? "active" : ""}
          onClick={() => setActiveTab("hotels")}
        >
          Hotels
        </button>
        <button
          className={activeTab === "enquiries" ? "active" : ""}
          onClick={() => setActiveTab("enquiries")}
        >
          Enquiries
        </button>
        <button
          className={activeTab === "metrics" ? "active" : ""}
          onClick={() => setActiveTab("metrics")}
        >
          Metrics
        </button>
        <button
          className={activeTab === "gallery" ? "active" : ""}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
