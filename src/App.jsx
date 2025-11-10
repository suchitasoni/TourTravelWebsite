import './App.css'
import Home from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import GoogleReviewsEmbed from './Components/GoogleReviewsEmbed'
import ContactUs from './Components/ContactUs'
import AdminLogin from './Components/Admin/AdminLogin'
import Dashboard from './Components/Admin/Dashboard'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { getSessionId } from './utils/session'
import Gallery from './Components/Gallery'

function App() {
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
      <Routes>
        <Route path="/" element={<Home recordVisit={recordVisit}/>} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/adminDashboard' element={<Dashboard />} />
        <Route path='/reviews' element={<GoogleReviewsEmbed />} />
        <Route path='/contact' element={<ContactUs recordVisit={recordVisit} />} />
        <Route path='/gallery' element={<Gallery />} />
      </Routes>
      
    </div>
  )
}

export default App
