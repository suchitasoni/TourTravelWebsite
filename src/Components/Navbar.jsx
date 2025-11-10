import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./Navbar.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <Typography variant="h6" className="drawer-title">
          Maihar Travels
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
          <Typography variant="h6" className="navbar-title">
            Maihar Travels
          </Typography>

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
}
