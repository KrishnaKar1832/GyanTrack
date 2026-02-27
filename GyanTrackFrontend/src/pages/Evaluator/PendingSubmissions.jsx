import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, Button, Chip, Accordion, AccordionSummary, AccordionDetails,
  TextField, Alert, Avatar, CircularProgress, Snackbar, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { evaluatorService } from "../../services/evaluatorService";

const PendingSubmissions = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [remarks, setRemarks] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await evaluatorService.getCreatedTests();
        setTests(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedTest(res.data[0].id);
        }
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to load tests", severity: "error" });
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, []);

  useEffect(() => {
    if (!selectedTest) return;
    const fetchAttempts = async () => {
      setLoadingAttempts(true);
      try {
        const res = await evaluatorService.getTestAttempts(selectedTest);
        setAttempts(res.data || []);
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to load submissions", severity: "error" });
        setAttempts([]);
      } finally {
        setLoadingAttempts(false);
      }
    };
    fetchAttempts();
  }, [selectedTest]);

  const handleRemarkChange = (attemptId, value) => {
    setRemarks((r) => ({ ...r, [attemptId]: value }));
  };

  const handleVerify = (attemptId) => {
    setSnackbar({ open: true, message: `Attempt #${attemptId} marked as verified. Remark saved.`, severity: "success" });
  };

  if (loadingTests) {
    return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  }

  const selectedTestName = tests.find((t) => t.id === selectedTest)?.title || "";

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Avatar sx={{ bgcolor: "#f59e0b" }}><AssignmentIndIcon /></Avatar>
        <Typography variant="h4" fontWeight={800} color="#1e293b">
          Test Submissions
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Review intern test attempts and add evaluator remarks.
      </Typography>

      {/* Test Selector */}
      {tests.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No tests created yet. Go to the <strong>Assigned Templates</strong> tab to create a test.
        </Alert>
      ) : (
        <>
          <FormControl sx={{ mb: 4, minWidth: 320 }}>
            <InputLabel>Select Test</InputLabel>
            <Select value={selectedTest} label="Select Test" onChange={(e) => setSelectedTest(e.target.value)}>
              {tests.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.title}
                  <Chip label={t.isActive ? "Active" : "Ended"} size="small" color={t.isActive ? "success" : "default"} sx={{ ml: 1 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {loadingAttempts ? (
            <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
          ) : attempts.length === 0 ? (
            <Paper elevation={1} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
              <Typography color="text.secondary">No submissions yet for <strong>{selectedTestName}</strong>.</Typography>
            </Paper>
          ) : (
            attempts.map((attempt) => (
              <Accordion key={attempt.id} elevation={2} sx={{ mb: 2, borderRadius: "12px !important", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%" flexWrap="wrap">
                    <Avatar sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 700, width: 40, height: 40 }}>
                      {attempt.internName?.charAt(0) || "I"}
                    </Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={700} color="#1e293b">{attempt.internName || `Attempt #${attempt.id}`}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Score: {attempt.score ?? "—"} | Submitted: {attempt.isSubmitted ? "Yes" : "No"}
                      </Typography>
                    </Box>
                    <Chip
                      label={attempt.isSubmitted ? "Submitted" : "In Progress"}
                      color={attempt.isSubmitted ? "success" : "warning"}
                      size="small"
                      icon={attempt.isSubmitted ? <CheckCircleOutlineIcon /> : undefined}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                        <Typography variant="h4" fontWeight={800} color="#4f46e5">{attempt.score ?? "—"}</Typography>
                        <Typography variant="caption" color="text.secondary">Score</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                        <Typography variant="h4" fontWeight={800} color={attempt.isSubmitted ? "#10b981" : "#f59e0b"}>
                          {attempt.isSubmitted ? "Done" : "Active"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                        <Typography variant="h4" fontWeight={800} color="#0ea5e9">
                          {attempt.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Attempt ID</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth multiline rows={2} label="Evaluator Remarks"
                        placeholder="Add your remarks about this submission..."
                        value={remarks[attempt.id] || ""}
                        onChange={(e) => handleRemarkChange(attempt.id, e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained" startIcon={<SendIcon />}
                        onClick={() => handleVerify(attempt.id)}
                        disabled={!attempt.isSubmitted}
                        sx={{ borderRadius: 2, background: "linear-gradient(135deg, #10b981, #059669)", fontWeight: 700 }}
                      >
                        Verify & Submit Remark
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingSubmissions;