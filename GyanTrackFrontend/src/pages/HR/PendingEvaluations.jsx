import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import jsPDF from "jspdf";
import { hrService } from "../../services/hrService";

const PendingEvaluations = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commGrades, setCommGrades] = useState({});
  const [saved, setSaved] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await hrService.getAllScores();
        setScores(res.data || []);
      } catch (err) {
        console.error("Failed to load scores:", err);
        setScores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  const handleCommChange = (id, value) => {
    setCommGrades((prev) => ({ ...prev, [id]: value }));
  };

  const calculateFinalScore = (tech, comm, att) => {
    if (!tech || !comm || !att) return "---";
    const final = (tech * 0.60) + (comm * 10 * 0.20) + (att * 0.20);
    return final.toFixed(1);
  };

  const handleSave = async (ev) => {
    const commGrade = Number(commGrades[ev.id]);
    if (!commGrade) return;

    const finalScore = calculateFinalScore(ev.technicalScore, commGrade, ev.attendanceScore);

    try {
      await hrService.updateScore({
        id: ev.id,
        communicationScore: commGrade,
        finalScore: Number(finalScore),
      });
      setSaved((prev) => ({ ...prev, [ev.id]: true }));
      setSnackbar({ open: true, message: "Evaluation saved successfully!", severity: "success" });

      // Refresh
      const res = await hrService.getAllScores();
      setScores(res.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save evaluation.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const downloadPDF = (ev) => {
    const commGrade = commGrades[ev.id] || ev.communicationScore || 0;
    const finalScore = calculateFinalScore(ev.technicalScore, commGrade, ev.attendanceScore);

    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("GyanTrack Official Scorecard", 20, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Intern: ${ev.internName || "Unknown"}`, 20, 60);
    doc.text(`Subject: ${ev.subjectName || "N/A"}`, 20, 70);
    doc.text(`Evaluator: ${ev.evaluatorName || "N/A"}`, 20, 80);

    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);

    doc.setFontSize(14);
    doc.text(`Technical Score (60%): ${ev.technicalScore}/100`, 20, 110);
    doc.text(`Communication Grade (20%): ${commGrade}/10`, 20, 120);
    doc.text(`Attendance Record (20%): ${ev.attendanceScore}%`, 20, 130);

    doc.setFontSize(20);
    doc.setTextColor(22, 101, 52);
    doc.text(`Overall Final Score: ${finalScore}%`, 20, 160);

    doc.save(`${(ev.internName || "intern").replace(" ", "_")}_Scorecard.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Pending Evaluations
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Review technical scores from evaluators, append HR communication grades, and finalize scorecards.
      </Typography>

      {scores.length === 0 && (
        <Typography color="text.secondary">No pending evaluations at this time.</Typography>
      )}

      {scores.map((ev) => {
        const comm = commGrades[ev.id] ?? ev.communicationScore ?? "";
        const finalScore = calculateFinalScore(ev.technicalScore, comm, ev.attendanceScore);
        const isComplete = comm !== "" && comm !== null;
        const isSaved = saved[ev.id] || ev.finalScore != null;

        return (
          <Accordion
            key={ev.id}
            elevation={2}
            sx={{
              mb: 2,
              borderRadius: "12px !important",
              '&:before': { display: 'none' },
              overflow: 'hidden'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: isSaved ? '#f0fdf4' : '#fff', p: 2 }}
            >
              <Grid container alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography fontWeight={700} color="#1e293b">{ev.internName || "Intern"}</Typography>
                  <Typography variant="body2" color="text.secondary">{ev.subjectName || "Subject"}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} display="flex" alignItems="center">
                  <Chip size="small" label={`Technical: ${ev.technicalScore ?? "—"}`} sx={{ mr: 1, bgcolor: '#e2e8f0' }} />
                  <Chip size="small" label={`Attendance: ${ev.attendanceScore ?? "—"}%`} sx={{ bgcolor: '#e0f2fe', color: '#0369a1' }} />
                </Grid>
                <Grid item xs={12} sm={4} display="flex" justifyContent={{ xs: "flex-start", sm: "flex-end" }} mt={{ xs: 2, sm: 0 }}>
                  <Typography fontWeight={800} color={isComplete ? "#059669" : "#94a3b8"} sx={{ fontSize: '1.2rem' }}>
                    {finalScore === "---" ? "Pending Grading" : `${finalScore} OVR`}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: '#f8fafc', p: 3, borderTop: '1px solid #e2e8f0' }}>

              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>HR Input Required</Typography>
                  <TextField
                    fullWidth={false}
                    type="number"
                    label="Communication Grade (1-10)"
                    value={comm}
                    onChange={(e) => handleCommChange(ev.id, e.target.value)}
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                    disabled={isSaved}
                    sx={{ bgcolor: 'white', width: { xs: '100%', sm: 250 } }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    * Technical (60%) and Attendance (20%) are fetched automatically.
                  </Typography>
                </Grid>

                <Grid item xs={12} md={7} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(ev)}
                    disabled={!isComplete || isSaved}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    {isSaved ? "Finalized" : "Save Final Evaluation"}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() => downloadPDF(ev)}
                    disabled={!isSaved}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Download Scorecard
                  </Button>
                </Grid>
              </Grid>

            </AccordionDetails>
          </Accordion>
        );
      })}

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

export default PendingEvaluations;