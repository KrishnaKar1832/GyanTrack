import { useState, useEffect } from "react";
import {
  Box, Typography, Card, Grid, Button, Chip, Accordion, AccordionSummary, AccordionDetails,
  TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  FormControl, InputLabel, Select, MenuItem, Avatar, CircularProgress, Radio, RadioGroup,
  FormControlLabel, FormLabel, Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { evaluatorService } from "../../services/evaluatorService";

const emptyQuestion = () => ({
  questionText: "",
  marks: 5,
  options: [
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ],
  correctIndex: "", // 0-3 index of the correct option
});

const AssignedTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [testTitle, setTestTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await evaluatorService.getAssignedTemplates();
      setTemplates(res.data || []);
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (template) => {
    setActiveTemplate(template);
    setTestTitle(template.subjectName || "New Test");
    setQuestions([emptyQuestion()]);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setActiveTemplate(null);
    setQuestions([emptyQuestion()]);
  };

  // Question handlers
  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));

  const setQuestionText = (i, val) => {
    const q = [...questions];
    q[i] = { ...q[i], questionText: val };
    setQuestions(q);
  };

  const setMarks = (i, val) => {
    const q = [...questions];
    q[i] = { ...q[i], marks: Number(val) };
    setQuestions(q);
  };

  const setOptionText = (qi, oi, val) => {
    const q = [...questions];
    q[qi].options[oi] = { ...q[qi].options[oi], optionText: val };
    setQuestions(q);
  };

  const setCorrectOption = (qi, oi) => {
    const q = [...questions];
    q[qi].correctIndex = oi;
    // Mark options as correct/incorrect
    q[qi].options = q[qi].options.map((opt, idx) => ({ ...opt, isCorrect: idx === oi }));
    setQuestions(q);
  };

  const handleSubmit = async () => {
    // Validate
    for (const q of questions) {
      if (!q.questionText.trim()) {
        setSnackbar({ open: true, message: "Every question must have question text.", severity: "warning" });
        return;
      }
      if (q.options.some((o) => !o.optionText.trim())) {
        setSnackbar({ open: true, message: "All 4 options must be filled in.", severity: "warning" });
        return;
      }
      if (!q.options.some((o) => o.isCorrect)) {
        setSnackbar({ open: true, message: "Each question must have a correct option selected.", severity: "warning" });
        return;
      }
    }

    setSubmitting(true);
    try {
      // 1. Create the test — only send fields CreateTestDTO accepts:
      //    { templateId, title, startTime, endTime, durationMinutes }
      const now = new Date();
      const endTime = new Date(now.getTime() + durationMinutes * 60 * 1000 + 86400000); // 1 day from now
      const testRes = await evaluatorService.createTest({
        templateId: activeTemplate.id,
        title: testTitle || activeTemplate.subjectName || "Test",
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
        durationMinutes: durationMinutes,
      });

      const testId = testRes.data?.id || testRes.data?.testId;

      // 2. Create questions — CreateQuestionDTO: { testId, questionText, marks, options: [{optionText, isCorrect}] }
      for (const q of questions) {
        await evaluatorService.createQuestion({
          testId: testId,
          questionText: q.questionText.trim(),
          marks: q.marks,
          options: q.options.map((o) => ({
            optionText: o.optionText.trim(),
            isCorrect: o.isCorrect,
          })),
        });
      }

      setSnackbar({ open: true, message: `Test "${testTitle}" created with ${questions.length} question(s) and saved to database! ✅`, severity: "success" });
      handleClose();
      fetchTemplates();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create test. Check console for details.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Avatar sx={{ bgcolor: "#4f46e5" }}><AssignmentIcon /></Avatar>
        <Typography variant="h4" fontWeight={800} color="#1e293b">Assigned Exam Templates</Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Build test questions for each template assigned by HR. Questions and options are saved to the database.
      </Typography>

      {templates.length === 0 ? (
        <Card variant="outlined" sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Typography color="text.secondary">No templates assigned yet. HR needs to assign a template first.</Typography>
        </Card>
      ) : (
        templates.map((template) => (
          <Accordion key={template.id} elevation={2} sx={{ mb: 2, borderRadius: "12px !important", "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" width="100%" alignItems="center" gap={2} flexWrap="wrap">
                <Avatar sx={{ bgcolor: "#4f46e5", width: 40, height: 40 }}><AssignmentIcon fontSize="small" /></Avatar>
                <Box flex={1}>
                  <Typography fontWeight={700} color="#1e293b">{template.subjectName || "Subject"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Evaluator: {template.evaluatorName} | Tech: {template.technicalWeight}% | Comm: {template.communicationWeight}% | Att: {template.attendanceWeight}%
                  </Typography>
                </Box>
                <Chip label={`Template #${template.id}`} size="small" sx={{ bgcolor: "#e0e7ff", color: "#3730a3" }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => handleOpen(template)}
                sx={{ borderRadius: 2, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", fontWeight: 700 }}
              >
                Build Test Questions
              </Button>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Test Builder Dialog */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ fontWeight: 800, borderBottom: "1px solid #e2e8f0" }}>
          Build Test for "{activeTemplate?.subjectName}"
        </DialogTitle>
        <DialogContent dividers>
          {/* Test metadata */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth label="Test Title" value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Duration (minutes)" type="number" value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                InputProps={{ inputProps: { min: 5, max: 300 } }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }}>
            <Chip label={`${questions.length} Question${questions.length !== 1 ? "s" : ""}`} color="primary" size="small" />
          </Divider>

          {questions.map((q, qi) => (
            <Card key={qi} variant="outlined" sx={{ mb: 3, borderRadius: 2, p: 2, border: "1px solid #e2e8f0" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography fontWeight={700} color="#1e293b">Question {qi + 1}</Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <TextField
                    size="small" label="Marks" type="number" value={q.marks}
                    onChange={(e) => setMarks(qi, e.target.value)}
                    sx={{ width: 80 }} InputProps={{ inputProps: { min: 1 } }}
                  />
                  {questions.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => removeQuestion(qi)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <TextField
                fullWidth multiline rows={2} label="Question Text"
                value={q.questionText}
                onChange={(e) => setQuestionText(qi, e.target.value)}
                required sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600, color: "#475569" }}>
                  Options (select the correct answer ✓)
                </FormLabel>
                <RadioGroup value={q.correctIndex === "" ? "" : String(q.correctIndex)} onChange={(e) => setCorrectOption(qi, Number(e.target.value))}>
                  <Grid container spacing={1.5}>
                    {q.options.map((opt, oi) => (
                      <Grid item xs={12} sm={6} key={oi}>
                        <Box display="flex" alignItems="center" gap={1}
                          sx={{
                            p: 1.5, borderRadius: 2, border: "1px solid",
                            borderColor: opt.isCorrect ? "#10b981" : "#e2e8f0",
                            bgcolor: opt.isCorrect ? "#f0fdf4" : "white",
                            transition: "all 0.2s",
                          }}
                        >
                          <Radio value={String(oi)} size="small" sx={{ color: opt.isCorrect ? "#10b981" : undefined }} />
                          <TextField
                            fullWidth size="small" variant="standard"
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            value={opt.optionText}
                            onChange={(e) => setOptionText(qi, oi, e.target.value)}
                            InputProps={{ disableUnderline: false }}
                          />
                          {opt.isCorrect && <CheckCircleIcon sx={{ color: "#10b981", flexShrink: 0 }} />}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Card>
          ))}

          <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={addQuestion} sx={{ borderRadius: 2, borderStyle: "dashed" }}>
            Add Question
          </Button>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
          <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button
            variant="contained" onClick={handleSubmit} disabled={submitting}
            sx={{ borderRadius: 2, background: "linear-gradient(135deg, #10b981, #059669)", fontWeight: 700, px: 4 }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : `Save Test & ${questions.length} Question(s) to DB`}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, boxShadow: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignedTemplates;