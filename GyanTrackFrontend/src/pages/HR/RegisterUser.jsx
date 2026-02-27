import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const RegisterUser = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        User Registration
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Onboard new evaluators and interns into the GyanTrack platform.
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden', maxWidth: 850 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: '#f8fafc',
            '& .Mui-selected': { color: '#4f46e5', fontWeight: 'bold' },
            '& .MuiTabs-indicator': { backgroundColor: '#4f46e5', height: 4 }
          }}
        >
          <Tab label="Register Evaluator" />
          <Tab label="Register Intern" />
        </Tabs>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" type="email" required />
              </Grid>
              
              {tabIndex === 0 && (
                <Grid item xs={12}>
                  <TextField fullWidth label="Specialization / Subject Area" required />
                </Grid>
              )}
              
              {tabIndex === 1 && (
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="University/College" required />
                </Grid>
              )}
              {tabIndex === 1 && (
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Enrollment Number" required />
                </Grid>
              )}
              
              <Grid item xs={12} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  startIcon={<PersonAddAlt1Icon />}
                  sx={{ 
                    mt: 2, 
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #219ebc, #023047)",
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                    width: { xs: "100%", sm: "auto" }
                  }}
                >
                  Confirm Registration
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          User registered successfully! An invitation email has been sent.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterUser;