import { Box } from "@mui/material";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6fb",
        width: "100%",
      }}
    >
      <Navbar />

      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 6 },
          py: 4,
          pt: { xs: 12, md: 14 },
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;