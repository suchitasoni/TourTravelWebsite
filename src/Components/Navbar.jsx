import React, { memo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import WhatsApp from "@mui/icons-material/WhatsApp";
import "./Navbar.css";
import { useRenderCount } from "../TourDataContext";

const Navbar = ()=>{
  const [mobileOpen, setMobileOpen] = useState(false);
  useRenderCount("Navbar");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Packages", href: "/#packages" },
    { label: "Contact Us", href: "/contact" },
    { label: "Reviews", href: "/reviews" },
    { label: "Gallery", href: "/gallery" },
  ];

  const drawer = (
    <Box className="drawer-content" onClick={handleDrawerToggle}>
      <Box className="drawer-header">
        <Typography variant="h6" className="drawer-title" onClick={() => window.location.href = "/"}>
          Maihar Online
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>
      <Divider sx={{ background: "rgba(255,255,255,0.3)" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem button component="a" href={item.href} key={item.label}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="navbar">
        <Toolbar className="navbar-toolbar">
          {/* Logo / Brand */}
          <Box className="navbar-brand">
  <Typography
    variant="h6"
    className="navbar-title"
    onClick={() => (window.location.href = "/")}
  >
    Maihar Online
  </Typography>

  <Box className="navbar-social">
    <IconButton
      href="https://www.facebook.com"
      target="_blank"
      size="small"
      className="social-icon"
    >
      <Facebook fontSize="small" />
    </IconButton>

    <IconButton
      href="https://www.instagram.com"
      target="_blank"
      size="small"
      className="social-icon"
    >
      <Instagram fontSize="small" />
    </IconButton>

    <IconButton
      href="https://wa.me/919300304422"
      target="_blank"
      size="small"
      className="social-icon"
    >
      <WhatsApp fontSize="small" />
    </IconButton>
  </Box>
</Box>

          {/* Desktop Menu */}
          <Box className="nav-links">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                color="inherit"
                className="nav-btn"
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            className="menu-icon"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 250,
            backgroundColor: "#0b2c46",
            color: "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default memo(Navbar);
