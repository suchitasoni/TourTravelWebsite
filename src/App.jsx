import './App.css'
import Home from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import GoogleReviewsEmbed from './Components/GoogleReviewsEmbed'
import ContactUs from './Components/ContactUs'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/reviews' element={<GoogleReviewsEmbed />} />
        <Route path='/contactus' element={<ContactUs />} />
      </Routes>
      
    </div>
  )
}

export default App
