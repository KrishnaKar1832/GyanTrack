import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #023047, #219ebc)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/logo.png"
        alt="GyanTrack Logo"
        sx={{
          width: 340,
          height: 340,
          mb: 3,
          animation: `${fadeIn} 1.5s ease-out, ${float} 3s ease-in-out infinite`,
        }}
      />

      {/* App Name
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          animation: `${fadeIn} 2s ease-out`,
          letterSpacing: 2,
        }}
      >
        GyanTrack
      </Typography> */}

      <Typography
        variant="subtitle1"
        sx={{ mt: 2, opacity: 0.85 }}
      >
        Smart Intern Evaluation & Proctored Assessment System
      </Typography>
    </Box>
  );
};

export default SplashScreen;