import HeroSection from "../Components/HeroSection";
import SEOHelmet from "../seo/SeoHelmet";
import "./Home.css";
import Packages from "../Components/Packages";
import GoogleReviewsEmbed from "../Components/GoogleReviewsEmbed.jsx";
import ReviewsCarousel from "../Components/ReviewsCaraousel.jsx";
import Footer from "../Components/Footer.jsx";

export default function Home() {
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
        <section className="hero">
          <HeroSection />
        </section>

        <section className="popular-packages">
          <h2 style={{margin: '0px 30px'}}>Popular Packages</h2>
          <div className="package-list">
            <Packages />
          </div>
        </section>
        <section style={{padding: '5px 15px'}}>
          <ReviewsCarousel />
        </section>
        <section className="footer"><Footer /></section>        
      </main>
    </>
  );
}
