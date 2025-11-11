import { Box, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box className="footer-container">
      <Box className="footer-links">
        <Box className="footer-top">
            <Typography variant="h5" mb={2} className="footer-title">Maihar Travels</Typography>
            <Typography variant="body2" mb={2} className="footer-subtitle">
            Explore India’s most spiritual and scenic destinations with us.
            </Typography>
            <Box className="footer-cta">
            <Link href="/enquiry" className="footer-btn">Send Enquiry</Link>
            <Link href="tel:+919300304422" className="footer-btn secondary">Call Us</Link>
            </Box>
        </Box>
        <Box>
          <Typography variant="h6" className="footer-heading">Quick Links</Typography>
          <ul>
            <li><Link href="/#home">Home</Link></li>
            <li><Link href="/#packages">Packages</Link></li>
            <li><Link href="/reviews">Reviews</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </Box>

        <Box>
          <Typography variant="h6" className="footer-heading">Popular Packages</Typography>
          <ul>
            <li><Link href="/packages/char-dham">Char Dham Yatra</Link></li>
            <li><Link href="/packages/rameshwaram">Rameshwaram Tour</Link></li>
            <li><Link href="/packages/goa">Goa Beach Tour</Link></li>
            <li><Link href="/packages/kashmir">Kashmir Tour</Link></li>
            <li><Link href="/packages/kerala">Kerala Backwaters</Link></li>
          </ul>
        </Box>
      </Box>

      {/* Bottom Strip */}
      <Box className="footer-bottom">
        <Typography variant="body2">© {new Date().getFullYear()} Maihar Travels | All Rights Reserved</Typography>
        <Box>
          <IconButton href="https://www.facebook.com" target="_blank"><Facebook/></IconButton>
          <IconButton href="https://www.instagram.com" target="_blank"><Instagram /></IconButton>
          <IconButton href="https://wa.me/919300304422" target="_blank"><WhatsApp /></IconButton>
        </Box>
      </Box>
    </Box>
  );
}
