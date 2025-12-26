import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { memo, useEffect } from "react";
import { useRenderCount } from "../TourDataContext";

function HowItWorks() {
  const steps = [
    {
      icon: <FlightTakeoffIcon fontSize="large" />,
      title: "1. Choose Your Destination",
      desc: "Browse through our curated tour packages across India and abroad, and pick the one that excites you most.",
    },
    {
      icon: <ChatIcon fontSize="large" />,
      title: "2. Send Enquiry",
      desc: "Tell us your travel dates, group size, and preferences. Our team will get in touch with a personalized quote.",
    },
    {
      icon: <CheckCircleIcon fontSize="large" />,
      title: "3. Confirm & Enjoy Your Trip",
      desc: "Once finalized, we take care of everything—from hotel bookings to transport—so you can focus on the experience.",
    },
  ];
  useRenderCount("HowItWorks");

useEffect(() => {
  const cards = document.querySelectorAll(".howitworks-anim");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => observer.observe(card));

  return () => observer.disconnect();
}, []);

  return (
    <Box className="howitworks-section">
      <Typography variant="h4" align="center" className="howitworks-title">
        How It Works
      </Typography>
      <Typography variant="subtitle1" align="center" className="howitworks-subtitle" mb={2}>
        Plan your journey in just three easy steps.
      </Typography>

      <Grid container spacing={3} justifyContent="center" className="howitworks-grid">
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <div className={`howitworks-anim ${
                index === 0
                  ? "from-left"
                  : index === 1
                  ? "from-bottom"
                  : "from-right"
              }`}
            >
              <Card className="howitworks-card">
                <CardContent>
                  <Box className="howitworks-icon">{step.icon}</Box>
                  <Typography variant="h6" className="howitworks-step-title">
                    {step.title}
                  </Typography>
                  <Typography variant="body2" className="howitworks-step-desc">
                    {step.desc}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(HowItWorks);