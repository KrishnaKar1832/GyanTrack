import { useState } from "react";
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
  Divider,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import jsPDF from "jspdf";

const PendingEvaluations = () => {
  // Mock data representing a submission sent back by an evaluator
  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      internName: "Alex Rivendell",
      subject: "React Architecture",
      evaluator: "Dr. Sarah Chen",
      technicalScore: 85,
      fetchedAttendance: 92,
      communicationGrade: "",
      saved: false
    },
    {
      id: 2,
      internName: "Samira Ahmed",
      subject: "Backend APIs",
      evaluator: "Marcus Johnson",
      technicalScore: 90,
      fetchedAttendance: 88,
      communicationGrade: "",
      saved: false
    }
  ]);

  const handleCommChange = (id, value) => {
    setEvaluations(evaluations.map(ev => 
      ev.id === id ? { ...ev, communicationGrade: value } : ev
    ));
  };

  const calculateFinalScore = (tech, comm, att) => {
    if (!tech || !comm || !att) return "---";
    // Technical (60%), Communication 1-10 scaled to 100 (20%), Attendance (20%)
    const final = (tech * 0.60) + (comm * 10 * 0.20) + (att * 0.20);
    return final.toFixed(1);
  };

  const handleSave = (id) => {
    setEvaluations(evaluations.map(ev => 
      ev.id === id ? { ...ev, saved: true } : ev
    ));
    alert("Evaluation verified and saved to database.");
  };

  const downloadPDF = (ev) => {
    const finalScore = calculateFinalScore(ev.technicalScore, ev.communicationGrade, ev.fetchedAttendance);
    
    // Initialize jsPDF
    const doc = new jsPDF();
    
    // Add branding and styling
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("GyanTrack Official Scorecard", 20, 25);
    
    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Intern: ${ev.internName}`, 20, 60);
    doc.text(`Test Subject: ${ev.subject}`, 20, 70);
    doc.text(`Evaluator: ${ev.evaluator}`, 20, 80);
    
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);
    
    // Scores
    doc.setFontSize(14);
    doc.text(`Technical Score (60%): ${ev.technicalScore}/100`, 20, 110);
    doc.text(`Communication Grade (20%): ${ev.communicationGrade || 0}/10`, 20, 120);
    doc.text(`Attendance Record (20%): ${ev.fetchedAttendance}%`, 20, 130);
    
    // Final
    doc.setFontSize(20);
    doc.setTextColor(22, 101, 52);
    doc.text(`Overall Final Score: ${finalScore}%`, 20, 160);
    
    doc.save(`${ev.internName.replace(" ", "_")}_Scorecard.pdf`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Pending Evaluations
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Review technical scores submitted by evaluators, append HR communication grades, and finalize scorecards.
      </Typography>

      {evaluations.map((ev) => {
        const finalScore = calculateFinalScore(ev.technicalScore, ev.communicationGrade, ev.fetchedAttendance);
        const isComplete = ev.communicationGrade !== "";

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
              sx={{ bgcolor: ev.saved ? '#f0fdf4' : '#fff', p: 2 }}
            >
              <Grid container alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography fontWeight={700} color="#1e293b">{ev.internName}</Typography>
                  <Typography variant="body2" color="text.secondary">{ev.subject}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} display="flex" alignItems="center">
                  <Chip size="small" label={`Technical: ${ev.technicalScore}`} sx={{ mr: 1, bgcolor: '#e2e8f0' }} />
                  <Chip size="small" label={`Attendance: ${ev.fetchedAttendance}%`} sx={{ bgcolor: '#e0f2fe', color: '#0369a1' }} />
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
                    value={ev.communicationGrade}
                    onChange={(e) => handleCommChange(ev.id, e.target.value)}
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                    disabled={ev.saved}
                    sx={{ bgcolor: 'white', width: { xs: '100%', sm: 250 } }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                     * Technical (60%) and Attendance (20%) are fetched automatically. Comm grade scales to 20% weight.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={7} display="flex" justifyContent="flex-end" gap={2}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(ev.id)}
                    disabled={!isComplete || ev.saved}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    {ev.saved ? "Finalized" : "Save Final Evaluation"}
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() => downloadPDF(ev)}
                    disabled={!ev.saved}
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
    </Box>
  );
};

export default PendingEvaluations;