import HeroSection from "../Components/HeroSection";
import SEOHelmet from "../seo/SeoHelmet";
import "./Home.css";
import Packages from "../Components/Packages";
import ReviewsCarousel from "../Components/ReviewsCaraousel.jsx";
import HowItWorks from "../Components/HowItWorks.jsx";
import { useEffect, useState } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase.js";
import Navbar from "../Components/Navbar.jsx";

export default function Home({recordVisit}) {

  useEffect(() => {
    logEvent(analytics, "page_view", { page: "Packages" });
    recordVisit("Home-page");
  }, []);

  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <SEOHelmet
        title="Best Tour & Travel Packages | Affordable Holiday Trips"
        description="Explore top domestic and international tour packages at the best prices. Customized holidays, honeymoon trips, family tours, and weekend getaways."
        image="https://your-cdn-image-or-hero-image.jpg"
        url="https://yourdomain.com/"
      />

      {/* ✅ Schema for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": "Your Travel Company Name",
          "url": "https://yourdomain.com",
          "logo": "https://your-cdn-image.jpg",
          "sameAs": [
            "https://facebook.com/yourpage",
            "https://instagram.com/yourpage"
          ],
          "description":
            "Best domestic travel packages at affordable prices.",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9300304422",
            "contactType": "Customer Service"
          }
        })}
      </script>

      <main className="homepage">
        <section id="home" className="hero">
          <HeroSection />
        </section>

        <section id="packages" className="popular-packages">
          <div className="package-list">
            <Packages />
          </div>
        </section>
        <section id="howitworks" ><HowItWorks /></section>
        <section id="reviews" style={{padding: '5px 15px'}}>
          <ReviewsCarousel />
        </section>
        
        
      </main>
    </>
  );
}
