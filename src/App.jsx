import './App.css'
import Home from './Pages/Home'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import GoogleReviewsEmbed from './Components/GoogleReviewsEmbed'
import ContactUs from './Components/ContactUs'
import AdminLogin from './Components/Admin/AdminLogin'
import Dashboard from './Components/Admin/Dashboard'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { getSessionId } from './utils/session'
import Gallery from './Components/Gallery'
import ItineraryPage from './Components/ItineraryPage'
import { Fab, Modal, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import EnquiryForm from "./Components/EnquiryForm";
import { useState } from 'react'
import Footer from "./Components/Footer.jsx";
import Navbar from './Components/Navbar.jsx'

function App() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const hideLayout = location.pathname.startsWith("/admin");

  const recordVisit = async (page) => {
    try {
      const sessionId = getSessionId();
      await addDoc(collection(db, "visits"), {
        sessionId,
        page,
        visitedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error logging visit:", err);
    }
  };
  return (
    <div className="App">
      {!hideLayout && <section id="navbar"><Navbar /></section>}
      <Routes>
        <Route path="/" element={<Home recordVisit={recordVisit}/>} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/adminDashboard' element={<Dashboard />} />
        <Route path='/reviews' element={<GoogleReviewsEmbed />} />
        <Route path='/contact' element={<ContactUs recordVisit={recordVisit} />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path="/itinerary/:id" element={<ItineraryPage />} />
      </Routes>
      {!hideLayout && <section id="footer" className="footer"><Footer /></section>}
      {!hideLayout && <div>
        <Fab
          color="primary"
          aria-label="contact"
          className="floating-contact-btn"
          onClick={() => setOpen(true)}
        >
          <ChatIcon />
        </Fab>

        {/* ✅ Modal for Contact Form */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className="contact-modal">
            <Box className="contact-modal-header">
              <CloseIcon className="close-icon" onClick={() => setOpen(false)} />
            </Box>
            <EnquiryForm /> {/* 👈 your existing enquiry form component */}
          </Box>
        </Modal>
        </div>}
    </div>
  )
}

export default App
