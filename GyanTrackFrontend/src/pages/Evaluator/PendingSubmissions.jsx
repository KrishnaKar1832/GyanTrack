import { useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip, Accordion, AccordionSummary, AccordionDetails,
  Divider, TextField, Alert, Avatar
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const mockSubmissions = [
  {
    id: 101,
    internName: "Alex Rivendell",
    subject: "React Fundamentals",
    systemScore: 80,
    totalQuestions: 10,
    activityFlags: [
      { type: "Tab Switch", count: 2, severity: "warning" },
      { type: "Copy-Paste", count: 0, severity: "success" }
    ],
    verified: false,
    evaluatorRemarks: ""
  },
  {
    id: 102,
    internName: "Samira Ahmed",
    subject: "Backend Node.js API",
    systemScore: 65,
    totalQuestions: 20,
    activityFlags: [
      { type: "Tab Switch", count: 5, severity: "error" },
      { type: "Loss of Window Focus", count: 3, severity: "error" }
    ],
    verified: false,
    evaluatorRemarks: ""
  }
];

const PendingSubmissions = () => {
  const [submissions, setSubmissions] = useState(mockSubmissions);

  const handleRemarkChange = (id, value) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, evaluatorRemarks: value } : s));
  };

  const handleVerifySubmit = (id) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, verified: true } : s));
    alert("Evaluation verified and submitted to HR successfully.");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Review Intern Submissions
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Verify intern test attempts, review system-flagged behavior, add qualitative remarks, and submit to HR for final grading.
      </Typography>

      {submissions.map((sub) => (
        <Accordion 
          key={sub.id} 
          elevation={2}
          sx={{ mb: 2, borderRadius: "12px !important", '&:before': { display: 'none' }, border: '1px solid #e2e8f0', overflow: 'hidden' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 2, bgcolor: sub.verified ? "#f0fdf4" : "white" }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4} display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: sub.verified ? '#10b981' : '#e2e8f0', color: sub.verified ? 'white' : '#475569' }}>
                  <AssignmentIndIcon />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} color="#1e293b">{sub.internName}</Typography>
                  <Typography variant="body2" color="text.secondary">{sub.subject}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4} display="flex" gap={1}>
                {sub.activityFlags.some(f => f.severity === 'error') && (
                  <Chip size="small" icon={<WarningAmberIcon />} label="High Activity Flags" color="error" variant="outlined" />
                )}
                <Chip size="small" label={`System Score: ${sub.systemScore}%`} sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
              </Grid>
              
              <Grid item xs={12} sm={4} display="flex" justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                 <Chip 
                    label={sub.verified ? "Verified & Submitted" : "Pending Verification"} 
                    color={sub.verified ? "success" : "warning"} 
                    sx={{ fontWeight: 'bold' }}
                 />
              </Grid>
            </Grid>
          </AccordionSummary>

          <AccordionDetails sx={{ bgcolor: '#f8fafc', p: { xs: 2, md: 4 }, borderTop: '1px solid #e2e8f0' }}>
            <Grid container spacing={4}>
              {/* Activity Flags Panel */}
              <Grid item xs={12} md={5}>
                <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={700} color="#334155" mb={2}>
                      Proctoring Activity Flags
                    </Typography>
                    
                    {sub.activityFlags.map((flag, i) => (
                      <Alert 
                        key={i} 
                        severity={flag.severity} 
                        sx={{ mb: 1, borderRadius: 2, py: 0 }}
                        icon={flag.severity === 'success' ? <CheckCircleOutlineIcon fontSize="small"/> : <WarningAmberIcon fontSize="small"/>}
                      >
                        {flag.type}: <strong>{flag.count} occurrences</strong>
                      </Alert>
                    ))}
                    
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Verification & Remarks */}
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" fontWeight={700} color="#334155" mb={1}>
                  Evaluator Remarks (Sent to HR)
                </Typography>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={4} 
                  placeholder="E.g., The intern showed great technical knowledge but the tab switch flags are concerning. Recommend a deduction in communication/professionalism score."
                  value={sub.evaluatorRemarks}
                  onChange={(e) => handleRemarkChange(sub.id, e.target.value)}
                  disabled={sub.verified}
                  sx={{ bgcolor: 'white', mb: 3 }}
                />

                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={sub.verified ? <CheckCircleOutlineIcon /> : <SendIcon />}
                    onClick={() => handleVerifySubmit(sub.id)}
                    disabled={sub.verified}
                    sx={{ 
                      borderRadius: 2, 
                      px: 4, 
                      bgcolor: sub.verified ? '#10b981' : '#4f46e5',
                      '&:hover': { bgcolor: sub.verified ? '#10b981' : '#4338ca' }
                    }}
                  >
                    {sub.verified ? "Submitted to HR" : "Verify & Submit to HR"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default PendingSubmissions;