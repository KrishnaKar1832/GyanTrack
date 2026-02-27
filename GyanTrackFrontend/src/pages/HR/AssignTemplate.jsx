import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { hrService } from "../../services/hrService";

const AssignTemplate = () => {
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [template, setTemplate] = useState({
    subjectId: "",
    evaluatorId: "",
    internIds: [],
    totalMarks: 100,
    technicalWeightage: 50,
    communicationWeightage: 30,
    attendanceWeightage: 20,
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await hrService.getAllSubjects();
        setSubjects(res.data || []);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    loadSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hrService.createTemplate({
        subjectId: template.subjectId,
        totalMarks: Number(template.totalMarks),
        technicalWeightage: Number(template.technicalWeightage),
        communicationWeightage: Number(template.communicationWeightage),
        attendanceWeightage: Number(template.attendanceWeightage),
      });
      setSnackbar({ open: true, message: "Template created successfully!", severity: "success" });
      setTemplate({
        subjectId: "",
        evaluatorId: "",
        internIds: [],
        totalMarks: 100,
        technicalWeightage: 50,
        communicationWeightage: 30,
        attendanceWeightage: 20,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create template.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Assign Template
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Create a new evaluation template and assign it to a subject.
      </Typography>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 850 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Subject */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subjectId"
                  value={template.subjectId}
                  onChange={handleChange}
                  label="Subject"
                  disabled={loadingSubjects}
                >
                  {loadingSubjects ? (
                    <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} />Loading...</MenuItem>
                  ) : subjects.length === 0 ? (
                    <MenuItem disabled>No subjects found</MenuItem>
                  ) : subjects.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Total Marks */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Total Marks"
                name="totalMarks"
                value={template.totalMarks}
                onChange={handleChange}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            {/* Weightage */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mt={1} mb={2} color="#475569">
                Marks Weightage (%)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Technical"
                    name="technicalWeightage"
                    value={template.technicalWeightage}
                    onChange={handleChange}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Communication"
                    name="communicationWeightage"
                    value={template.communicationWeightage}
                    onChange={handleChange}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Attendance"
                    name="attendanceWeightage"
                    value={template.attendanceWeightage}
                    onChange={handleChange}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #219ebc, #023047)",
                  fontWeight: 700,
                  width: { xs: "100%", sm: "auto" }
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Create Template"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default AssignTemplate;