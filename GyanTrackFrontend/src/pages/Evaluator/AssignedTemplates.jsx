import { useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip, Accordion, AccordionSummary, AccordionDetails,
  Divider, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  FormControl, InputLabel, Select, MenuItem,
  Avatar,
  AvatarGroup
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SendIcon from '@mui/icons-material/Send';
import AssignmentIcon from '@mui/icons-material/Assignment';

const mockTemplates = [
  {
    id: 1,
    subject: "React Fundamentals",
    type: "Multiple Choice Questions",
    totalMarks: 50,
    questionCount: 10,
    interns: ["Alex Rivendell", "Samira Ahmed"],
    status: "Pending Creation"
  },
  {
    id: 2,
    subject: "Backend Node.js API",
    type: "Mixed (MCQ + MSQ)",
    totalMarks: 100,
    questionCount: 20,
    interns: ["Jordan Lee"],
    status: "Pending Creation"
  }
];

const AssignedTemplates = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  
  // Dynamic form state
  const [questions, setQuestions] = useState([{ q: "", options: ["", "", "", ""], answer: "" }]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenBuilder = (template) => {
    setActiveTemplate(template);
    setOpenExamModal(true);
  };

  const handleCloseBuilder = () => {
    setOpenExamModal(false);
    setActiveTemplate(null);
    setQuestions([{ q: "", options: ["", "", "", ""], answer: "" }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { q: "", options: ["", "", "", ""], answer: "" }]);
  };

  const removeQuestion = (index) => {
    const newQ = [...questions];
    newQ.splice(index, 1);
    setQuestions(newQ);
  };

  const handleQuestionChange = (index, field, value, optionIndex = null) => {
    const newQ = [...questions];
    if (field === "q") newQ[index].q = value;
    else if (field === "answer") newQ[index].answer = value;
    else if (field === "option") newQ[index].options[optionIndex] = value;
    setQuestions(newQ);
  };

  const handleSubmitExam = () => {
    // Simulate updating template status and sending notification
    setTemplates(templates.map(t => t.id === activeTemplate.id ? { ...t, status: "Deployed to Interns" } : t));
    setOpenExamModal(false);
    setOpenSnackbar(true);
    setQuestions([{ q: "", options: ["", "", "", ""], answer: "" }]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Assigned Exam Templates
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        View templates assigned by HR, build out the actual test questions, and deploy them to your interns.
      </Typography>

      {/* Templates List */}
      {templates.map((template) => (
        <Accordion 
          key={template.id} 
          elevation={2}
          sx={{ mb: 2, borderRadius: "12px !important", '&:before': { display: 'none' }, border: '1px solid #e2e8f0' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 2, bgcolor: template.status === "Deployed to Interns" ? "#f0fdf4" : "white" }}>
            <Box display="flex" flexWrap="wrap" width="100%" alignItems="center" gap={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: template.status === 'Deployed to Interns' ? '#10b981' : '#4f46e5' }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} color="#1e293b" fontSize="1.1rem">{template.subject}</Typography>
                  <Chip 
                    label={template.status} 
                    size="small" 
                    sx={{ mt: 0.5, bgcolor: template.status === 'Deployed to Interns' ? '#dcfce7' : '#e0e7ff', color: template.status === 'Deployed to Interns' ? '#166534' : '#3730a3', fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ bgcolor: '#f8fafc', p: 3, borderTop: '1px solid #e2e8f0' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>Template Specifications</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Test Type</Typography>
                    <Typography fontWeight={600} color="#1e293b">{template.type}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Target Marks</Typography>
                    <Typography fontWeight={600} color="#1e293b">{template.totalMarks}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Req. Questions</Typography>
                    <Typography fontWeight={600} color="#1e293b">{template.questionCount}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Assigned Interns</Typography>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.8rem' } }}>
                      {template.interns.map((name, i) => (
                        <MuiTooltip key={i} title={name}>
                          <Avatar alt={name} src={`/static/images/avatar/${i+1}.jpg`} />
                        </MuiTooltip>
                      ))}
                    </AvatarGroup>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={4} display="flex" alignItems="center" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                <Button 
                  variant="contained" 
                  size="large"
                  disabled={template.status === "Deployed to Interns"}
                  onClick={() => handleOpenBuilder(template)}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ borderRadius: 2, bgcolor: "#4f46e5", '&:hover': { bgcolor: "#4338ca" }, px: 3 }}
                >
                  {template.status === "Deployed to Interns" ? "Exam Deployed" : "Create Exam Form"}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Dynamic Exam Builder Modal */}
      <Dialog open={openExamModal} onClose={handleCloseBuilder} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', pb: 2 }}>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Exam Form Builder: {activeTemplate?.subject}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Draft your questions, define correct options, and deploy to {activeTemplate?.interns.length} assigned interns.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, bgcolor: '#f1f5f9' }}>
          
          {questions.map((q, qIndex) => (
            <Card key={qIndex} elevation={1} sx={{ mb: 3, borderRadius: 3, overflow: 'visible' }}>
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={700} color="#4f46e5">Question {qIndex + 1}</Typography>
                  {questions.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => removeQuestion(qIndex)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  )}
                </Box>
                
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="Enter your question here..."
                  value={q.q}
                  onChange={(e) => handleQuestionChange(qIndex, 'q', e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Grid container spacing={2}>
                  {q.options.map((opt, optIndex) => (
                    <Grid item xs={12} sm={6} key={optIndex}>
                      <TextField 
                        fullWidth 
                        size="small"
                        label={`Option ${optIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleQuestionChange(qIndex, 'option', e.target.value, optIndex)}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Box mt={3} p={2} bgcolor="#f8fafc" borderRadius={2} border="1px solid #e2e8f0">
                  <FormControl fullWidth size="small">
                    <InputLabel>Correct Answer Option</InputLabel>
                    <Select
                      value={q.answer}
                      label="Correct Answer Option"
                      onChange={(e) => handleQuestionChange(qIndex, 'answer', e.target.value)}
                    >
                      {q.options.map((opt, i) => (
                        <MenuItem key={i} value={opt} disabled={!opt}>
                          Option {i + 1}: {opt || "(Empty)"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

              </CardContent>
            </Card>
          ))}

          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<AddCircleOutlineIcon />}
            onClick={addQuestion}
            sx={{ borderStyle: 'dashed', borderWidth: 2, height: 60, borderRadius: 3, fontWeight: 700, color: '#4f46e5', borderColor: '#4f46e5' }}
          >
            Add Another Question
          </Button>

        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: 'white', borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={handleCloseBuilder} color="inherit" fontWeight={600}>Cancel</Button>
          <Button 
            onClick={handleSubmitExam} 
            variant="contained" 
            startIcon={<SendIcon />}
            sx={{ bgcolor: "#4f46e5", '&:hover': { bgcolor: "#4338ca" }, px: 4 }}
          >
            Deploy Exam to Interns
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          Exam successfully deployed! Interns have been notified.
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Workaround for undefined MuiTooltip imported as Tooltip in missing destructured import.
import { Tooltip as MuiTooltip } from "@mui/material";

export default AssignedTemplates;