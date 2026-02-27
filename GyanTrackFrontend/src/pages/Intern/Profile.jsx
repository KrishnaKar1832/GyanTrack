import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Paper,
  Button,
  Chip
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  // Mock User Data
  const user = {
    name: "Harish Mahto",
    role: "Fullstack Developer Intern",
    id: "INT-2026-1547",
    department: "Microsoft",
    email: "Harish.Mahto@gyansys.com",
    phone: "+91 7091700129",
    location: "Bangalore, India",
    university: "Siksha O Anusandhan University",
    skills: ["React", "JavaScript", "Material-UI", "Git", "Redux", ".NET", "C#"],
    joinDate: "Jan 12, 2026",
    status: "Active"
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", px: { xs: 1, sm: 2, md: 4 } }}>
        
        {/* Profile Header Card */}
        <Card 
          elevation={4} 
          sx={{ 
            borderRadius: 4, 
            overflow: "hidden", 
            mb: 4,
            background: "linear-gradient(135deg, #023047 0%, #219ebc 100%)",
            color: "white"
          }}
        >
          <Box 
            sx={{ 
              height: 140, 
              background: "linear-gradient(90deg, #219ebc, #8ecae6)",
              opacity: 0.9,
              position: "relative"
            }} 
          />
          
          <CardContent sx={{ px: { xs: 3, md: 6 }, pb: 5, position: "relative" }}>
            <Box 
              display="flex" 
              flexDirection={{ xs: "column", sm: "row" }} 
              alignItems={{ xs: "center", sm: "flex-end" }}
              mt={-8}
              mb={3}
            >
              <Avatar
                src="/alex.png" // Fallbacks to letter A if not found
                sx={{
                  width: 130,
                  height: 130,
                  border: "4px solid #1e293b",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  bgcolor: "#7c3aed",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  mr: { xs: 0, sm: 4 },
                  mb: { xs: 2, sm: 0 }
                }}
              >
                {user.name.charAt(0)}
              </Avatar>

              <Box textAlign={{ xs: "center", sm: "left" }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                  {user.role}
                </Typography>
              </Box>

              <Box ml="auto" mt={{ xs: 2, sm: 0 }}>
                <Chip 
                  label={user.status} 
                  color="success" 
                  sx={{ fontWeight: "bold", px: 2, py: 2.5, fontSize: "1rem", borderRadius: 2 }} 
                />
              </Box>
            </Box>
            
            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" color="#94a3b8">
                  <BadgeIcon sx={{ mr: 1.5, color: "#3b82f6" }} />
                  <Box>
                    <Typography variant="caption" display="block">Intern ID</Typography>
                    <Typography variant="body1" fontWeight={600} color="white">{user.id}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" color="#94a3b8">
                  <BusinessIcon sx={{ mr: 1.5, color: "#8b5cf6" }} />
                  <Box>
                    <Typography variant="caption" display="block">Department</Typography>
                    <Typography variant="body1" fontWeight={600} color="white">{user.department}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Left Column: Contact & Details */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderRadius: 3, mb: 4, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} color="#1e293b" mb={3}>
                  Contact Information
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", mr: 2, width: 40, height: 40 }}>
                      <EmailIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email Address</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">{user.email}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", mr: 2, width: 40, height: 40 }}>
                      <PhoneIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">{user.phone}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", mr: 2, width: 40, height: 40 }}>
                      <LocationOnIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Location</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">{user.location}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", mr: 2, width: 40, height: 40 }}>
                      <SchoolIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Education</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">{user.university}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Skills & Actions */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4} direction="column">
              
              <Grid item>
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={700} color="#1e293b" mb={3}>
                      Technical Skills
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1.5}>
                      {user.skills.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          sx={{ 
                            px: 1.5, 
                            py: 2, 
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            bgcolor: "#f1f5f9",
                            color: "#334155",
                            "&:hover": { bgcolor: "#e2e8f0" }
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item>
                <Card elevation={2} sx={{ borderRadius: 3, background: "linear-gradient(to right, #ffffff, #f8fafc)" }}>
                  <CardContent sx={{ p: 4, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="#1e293b" gutterBottom>
                        Ready for your next assessment?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check your dashboard to see upcoming scheduled tests.
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => navigate("/intern")}
                      sx={{ 
                        px: 4, 
                        py: 1.2, 
                        borderRadius: 2,
                        fontWeight: "bold",
                        background: "linear-gradient(90deg, #219ebc, #8ecae6)",
                        boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.4)"
                      }}
                    >
                      Return to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
        
      </Box>
    </DashboardLayout>
  );
};

export default Profile;