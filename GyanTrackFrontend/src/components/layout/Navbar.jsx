import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener for animated styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        color: "black",
        transition: "all 0.3s ease-in-out",
        borderBottom: scrolled ? "1px solid rgba(0, 0, 0, 0.05)" : "none",
        zIndex: 1100,
        px: { xs: 2, md: 4 },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: "70px", md: "80px" },
          py: 1,
        }}
      >
        {/* Brand Section */}
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/intern")}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 45,
              height: 45,
              mr: 2,
              background: "linear-gradient(135deg, #219ebc, #8ecae6)",
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.3)",
            }}
          >
            <TrackChangesIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              fontWeight="800"
              sx={{
                background: "linear-gradient(90deg, #023047, #219ebc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
              }}
            >
              GyanTrack
            </Typography>
            <Typography
              variant="caption"
              fontWeight="600"
              color="#64748b"
              sx={{ textTransform: "uppercase", letterSpacing: "1px" }}
            >
              {user?.role || "Intern"} Portal
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: "#64748b",
                transition: "color 0.2s",
                "&:hover": { color: "#2563eb" },
              }}
            >
              <NotificationsOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              sx={{
                color: "#64748b",
                transition: "color 0.2s",
                "&:hover": { color: "#2563eb", transform: "rotate(45deg)" },
              }}
            >
              <SettingsOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Box
            sx={{ width: "1px", height: "30px", bgcolor: "#e2e8f0", mx: 1 }}
          />

          <Button
            variant="contained"
            onClick={logout}
            endIcon={<LogoutRoundedIcon />}
            disableElevation
            sx={{
              ml: 1,
              borderRadius: "50px",
              textTransform: "none",
              fontWeight: 600,
              padding: "8px 20px",
              background: "linear-gradient(to right, #fb8500, #ffb703)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 10px rgba(251, 133, 0, 0.4)",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
