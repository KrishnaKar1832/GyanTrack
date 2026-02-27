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
  CircularProgress,
} from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { authService } from "../../services/authService";

const defaultForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  specialization: "",
  department: "",
  batch: "",
};

const RegisterUser = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setForm(defaultForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const role = tabIndex === 0 ? "Evaluator" : "Intern";
      const payload = {
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password || "Welcome@123", // default temp password
        role,
        department: form.department || null,
        batch: form.batch || null,
      };
      await authService.register(payload);
      setSnackbar({
        open: true,
        message: `${role} registered successfully! They can now log in.`,
        severity: "success",
      });
      setForm(defaultForm);
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
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
                <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Temporary Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Leave blank for default: Welcome@123"
                  helperText="If left blank, default password 'Welcome@123' will be set."
                />
              </Grid>

              {/* Evaluator-specific */}
              {tabIndex === 0 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specialization / Subject Area"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                  />
                </Grid>
              )}

              {/* Intern-specific */}
              {tabIndex === 1 && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Batch / Enrollment Number"
                      name="batch"
                      value={form.batch}
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAddAlt1Icon />}
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
                  {loading ? "Registering..." : "Confirm Registration"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterUser;