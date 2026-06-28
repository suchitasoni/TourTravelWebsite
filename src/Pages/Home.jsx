import HeroSection from "../Components/HeroSection";
import SEOHelmet from "../seo/SeoHelmet";
import "./Home.css";
import ReviewsCarousel from "../Components/ReviewsCaraousel.jsx";
import HowItWorks from "../Components/HowItWorks.jsx";
import { memo, useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase.js";
import { useRenderCount } from "../TourDataContext.jsx";
import { Suspense, lazy } from "react";
import { useInViewOnce } from "../useInViewOnce.js";
import NextTripPackage from "../Components/NextTripPackage.jsx";
import HotelList from "../Components/HotelList.jsx";

const Packages = lazy(() => import("../Components/Packages.jsx"));

function Home({recordVisit, setOpen}) {
  const { ref, isVisible } = useInViewOnce();
    useRenderCount("Home");
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
          <HeroSection setOpen={setOpen} />
        </section>
        <section id="nextTrip">
          <NextTripPackage />
        </section>
        <section id="packages" className="popular-packages" ref={ref}>
          {isVisible && (
          <Suspense fallback={<div style={{ height: 300 }} />}>
            <Packages />
          </Suspense>
        )}
        </section>
        <section id="hotels" style={{padding: '5px 15px'}}>
          <HotelList />
        </section>
        <section id="howitworks" ><HowItWorks /></section>
        <section id="reviews" style={{padding: '5px 15px'}}>
          <ReviewsCarousel />
        </section>
        
        
      </main>
    </>
  );
}

export default memo(Home);