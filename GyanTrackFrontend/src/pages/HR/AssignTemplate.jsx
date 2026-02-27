import { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Paper, Grid, Snackbar, Alert, CircularProgress, Divider, Slider,
  Chip, Avatar,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { hrService } from "../../services/hrService";

const defaultForm = {
  subjectId: "",
  evaluatorId: "",
  technicalWeight: 60,
  communicationWeight: 25,
  attendanceWeight: 15,
};

const AssignTemplate = () => {
  const [subjects, setSubjects] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [subRes, evalRes] = await Promise.all([
          hrService.getAllSubjects(),
          hrService.getEvaluators(),
        ]);
        // SubjectDTO: { id, subjectName, createdAt }
        setSubjects(subRes.data || []);
        // evaluators: { id, name, department }
        setEvaluators(evalRes.data || []);
      } catch (err) {
        console.error("Failed to load dropdown data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadDropdowns();
  }, []);

  const totalWeight = form.technicalWeight + form.communicationWeight + form.attendanceWeight;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlider = (field) => (_, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      setSnackbar({ open: true, message: "Weightages must total exactly 100%", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      // CreateAssignmentTemplateDTO: subjectId, evaluatorId, technicalWeight, communicationWeight, attendanceWeight
      await hrService.createTemplate({
        subjectId: Number(form.subjectId),
        evaluatorId: Number(form.evaluatorId),
        technicalWeight: Number(form.technicalWeight),
        communicationWeight: Number(form.communicationWeight),
        attendanceWeight: Number(form.attendanceWeight),
      });
      setSnackbar({ open: true, message: "Template created and assigned successfully!", severity: "success" });
      setForm(defaultForm);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create template.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Avatar sx={{ bgcolor: "#4f46e5" }}>
          <AssignmentIcon />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="#1e293b">
          Assign Evaluation Template
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Select a subject, assign an evaluator, and configure the weightage for technical, communication, and attendance scores.
      </Typography>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 900 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Subject Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subjectId"
                  value={form.subjectId}
                  onChange={handleChange}
                  label="Subject"
                  disabled={loadingData}
                >
                  {loadingData ? (
                    <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Loading...</MenuItem>
                  ) : subjects.length === 0 ? (
                    <MenuItem disabled>No subjects found</MenuItem>
                  ) : subjects.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.subjectName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Evaluator Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Evaluator</InputLabel>
                <Select
                  name="evaluatorId"
                  value={form.evaluatorId}
                  onChange={handleChange}
                  label="Evaluator"
                  disabled={loadingData}
                >
                  {loadingData ? (
                    <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Loading...</MenuItem>
                  ) : evaluators.length === 0 ? (
                    <MenuItem disabled>No evaluators found</MenuItem>
                  ) : evaluators.map((ev) => (
                    <MenuItem key={ev.id} value={ev.id}>
                      {ev.name}
                      {ev.department && <Typography variant="caption" color="text.secondary" ml={1}>({ev.department})</Typography>}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>WEIGHTAGE CONFIGURATION</Typography>
              </Divider>
            </Grid>

            {/* Weightage Total Indicator */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569">Total Weight:</Typography>
                <Chip
                  label={`${totalWeight}%`}
                  color={totalWeight === 100 ? "success" : totalWeight > 100 ? "error" : "warning"}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                {totalWeight !== 100 && (
                  <Typography variant="caption" color="error">Must equal 100%</Typography>
                )}
              </Box>
            </Grid>

            {/* Technical Weightage */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={700} color="#1e293b" gutterBottom>
                Technical 🖥️
              </Typography>
              <Slider
                value={form.technicalWeight}
                onChange={handleSlider("technicalWeight")}
                min={0} max={100} step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{ color: "#4f46e5" }}
              />
              <TextField
                fullWidth size="small" type="number"
                value={form.technicalWeight}
                onChange={(e) => setForm((p) => ({ ...p, technicalWeight: Number(e.target.value) }))}
                InputProps={{ inputProps: { min: 0, max: 100 }, endAdornment: "%" }}
              />
            </Grid>

            {/* Communication Weightage */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={700} color="#1e293b" gutterBottom>
                Communication 💬
              </Typography>
              <Slider
                value={form.communicationWeight}
                onChange={handleSlider("communicationWeight")}
                min={0} max={100} step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{ color: "#06b6d4" }}
              />
              <TextField
                fullWidth size="small" type="number"
                value={form.communicationWeight}
                onChange={(e) => setForm((p) => ({ ...p, communicationWeight: Number(e.target.value) }))}
                InputProps={{ inputProps: { min: 0, max: 100 }, endAdornment: "%" }}
              />
            </Grid>

            {/* Attendance Weightage */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={700} color="#1e293b" gutterBottom>
                Attendance 📅
              </Typography>
              <Slider
                value={form.attendanceWeight}
                onChange={handleSlider("attendanceWeight")}
                min={0} max={100} step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{ color: "#10b981" }}
              />
              <TextField
                fullWidth size="small" type="number"
                value={form.attendanceWeight}
                onChange={(e) => setForm((p) => ({ ...p, attendanceWeight: Number(e.target.value) }))}
                InputProps={{ inputProps: { min: 0, max: 100 }, endAdornment: "%" }}
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || loadingData || totalWeight !== 100 || !form.subjectId || !form.evaluatorId}
                sx={{
                  mt: 2, px: 6, py: 1.5, borderRadius: 2,
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  fontWeight: 700,
                  width: { xs: "100%", sm: "auto" },
                  boxShadow: "0 4px 14px rgba(79,70,229,0.4)",
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Create & Assign Template"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignTemplate;