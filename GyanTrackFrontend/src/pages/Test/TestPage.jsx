import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Checkbox, 
  FormControlLabel, 
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  Divider,
  Container,
  Alert,
  AlertTitle
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const mockQuestions = [
  {
    id: 1,
    q: "What is the primary purpose of React's Virtual DOM?",
    options: [
      "To directly manipulate the browser's DOM faster.",
      "To create a lightweight copy of the UI to optimize rendering performance.",
      "To manage application state automatically without Redux.",
      "To provide a built-in database for frontend applications."
    ],
    ans: "To create a lightweight copy of the UI to optimize rendering performance."
  },
  {
    id: 2,
    q: "Which hook is used to perform side effects in a functional component?",
    options: [
      "useState",
      "useContext",
      "useEffect",
      "useReducer"
    ],
    ans: "useEffect"
  },
  {
    id: 3,
    q: "In Material-UI, what component is universally used to create a flexible layout grid?",
    options: [
      "Box",
      "Grid",
      "Container",
      "Stack"
    ],
    ans: "Grid"
  },
  {
    id: 4,
    q: "What will happen if you do not pass a dependency array to useEffect?",
    options: [
      "It will run only once on mount.",
      "It will never run.",
      "It will throw an error.",
      "It will run on every single render."
    ],
    ans: "It will run on every single render."
  },
  {
    id: 5,
    q: "How do you conditionally apply a CSS class in React?",
    options: [
      "Using an if-statement inside the className prop.",
      "Using a template literal and ternary operator within the className prop.",
      "Using the class-condition directive.",
      "You cannot. You must use inline styles."
    ],
    ans: "Using a template literal and ternary operator within the className prop."
  }
];

const TestPage = () => {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showWarning, setShowWarning] = useState(false);

  const logActivity = useCallback((activity) => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), activity }]);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 5000); // Hide warning after 5s
  }, []);

  const handleStart = () => {
    document.documentElement.requestFullscreen().catch(err => {
      console.log("Error attempting to enable fullscreen:", err);
    });
    setHasStarted(true);
    logActivity("Test Started");
  };

  const handleEndTest = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    console.log("Test Submitted. Activity logs:", logs);
    console.log("Answers:", answers);
    navigate("/intern"); 
  }, [navigate, logs, answers]);

  useEffect(() => {
    if (!hasStarted) return;

    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      handleEndTest();
    }
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, handleEndTest]);

  useEffect(() => {
    if (!hasStarted) return;

    const disableCopyPaste = (e) => e.preventDefault();
    const handleVisibility = () => {
      if (document.hidden) logActivity("Tab Switched or Minimized");
    };
    const handleBlur = () => logActivity("Window lost focus");
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) logActivity("Exited Fullscreen unexpectedly");
    };

    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);
    document.addEventListener("contextmenu", disableCopyPaste);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
      document.removeEventListener("contextmenu", disableCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [hasStarted, logActivity]);

  const handleOptionChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion]: e.target.value
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // INSTRUCTION SCREEN UI
  // ----------------------------------------------------
  if (!hasStarted) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 8, display: "flex", alignItems: "center" }}>
        <Container maxWidth="md">
          <Card elevation={6} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Box sx={{ bgcolor: "#1e293b", color: "white", p: 4, textAlign: "center" }}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                React Assessment
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                Technical Evaluation • Duration: 30 Minutes
              </Typography>
            </Box>
            
            <CardContent sx={{ p: { xs: 3, md: 6 } }}>
              <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
                <AlertTitle sx={{ fontWeight: "bold" }}>Proctored Environment Active</AlertTitle>
                This assessment is strictly monitored. Any attempt to leave the fullscreen, switch tabs, or use keyboard shortcuts will be recorded and may lead to disqualification.
              </Alert>

              <Typography variant="h6" fontWeight="bold" gutterBottom color="#334155">
                Instructions & Guidelines:
              </Typography>
              
              <Box component="ul" sx={{ pl: 3, mb: 4, color: "#475569", lineHeight: 1.8 }}>
                <li>Ensure you have a stable internet connection before proceeding.</li>
                <li>The test will automatically enter <b>Fullscreen Mode</b> upon starting.</li>
                <li>You cannot pause the timer once the assessment begins.</li>
                <li>Copy, paste, right-click context menus, and text selection are strictly disabled.</li>
                <li>You can navigate between questions using the Previous and Next buttons.</li>
                <li>Click <b>Submit Test</b> on the final page to finalize your answers. If the timer runs out, answers will submit automatically.</li>
              </Box>

              <Divider sx={{ my: 4 }} />

              <FormControlLabel
                control={
                  <Checkbox 
                    checked={agreed} 
                    onChange={(e) => setAgreed(e.target.checked)} 
                    color="primary"
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                  />
                }
                label={<Typography fontWeight={500} color="#1e293b">I agree to the test rules and understand the consequences of malpractice.</Typography>}
                sx={{ mb: 4 }}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!agreed}
                onClick={handleStart}
                sx={{ 
                  py: 2, 
                  fontSize: "1.1rem", 
                  fontWeight: 700,
                  background: agreed ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "#cbd5e1",
                  boxShadow: agreed ? "0 10px 25px -5px rgba(37, 99, 235, 0.4)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: agreed ? "translateY(-2px)" : "none",
                    boxShadow: agreed ? "0 20px 25px -5px rgba(37, 99, 235, 0.4)" : "none"
                  }
                }}
              >
                BEGIN ASSESSMENT
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // ----------------------------------------------------
  // ACTIVE TEST UI
  // ----------------------------------------------------
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", userSelect: "none", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Paper elevation={2} sx={{ py: 2, px: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 0, bgcolor: "white" }}>
        <Typography variant="h6" fontWeight={800} color="#1e293b">
          React Technical Assessment
        </Typography>
        
        <Box display="flex" alignItems="center" bgcolor={timeLeft < 300 ? "#fee2e2" : "#f1f5f9"} px={3} py={1} borderRadius={2} color={timeLeft < 300 ? "#ef4444" : "#334155"}>
          <AccessTimeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            {formatTime(timeLeft)}
          </Typography>
        </Box>
      </Paper>

      {/* Warning Toast */}
      {showWarning && (
        <Alert severity="error" sx={{ position: "fixed", top: 100, left: '50%', transform: "translateX(-50%)", zIndex: 9999, boxShadow: 4 }}>
          <AlertTitle>Warning Issued</AlertTitle>
          Malpractice detected! Your activity has been logged.
        </Alert>
      )}

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 6, display: "flex", flexDirection: "column" }}>
        
        {/* Progress indicator */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Typography variant="subtitle1" fontWeight={600} color="#64748b">
            Question {currentQuestion + 1} of {mockQuestions.length}
          </Typography>
        </Box>

        <Card elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
          <CardContent>
            {/* Question Text */}
            <Typography variant="h5" fontWeight={600} color="#0f172a" mb={4} lineHeight={1.5}>
              Q{currentQuestion + 1}. {mockQuestions[currentQuestion].q}
            </Typography>
            
            {/* Options */}
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onChange={handleOptionChange}
              >
                <Grid container spacing={3}>
                  {mockQuestions[currentQuestion].options.map((opt, i) => (
                    <Grid item xs={12} key={i}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 1, 
                          borderRadius: 2, 
                          borderWidth: answers[currentQuestion] === opt ? 2 : 1,
                          borderColor: answers[currentQuestion] === opt ? "#3b82f6" : "#cbd5e1",
                          bgcolor: answers[currentQuestion] === opt ? "#eff6ff" : "white",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <FormControlLabel 
                          value={opt} 
                          control={<Radio color="primary" sx={{ ml: 1 }} />} 
                          label={<Typography variant="body1" fontWeight={500} color="#334155">{opt}</Typography>} 
                          sx={{ width: "100%", m: 0 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 5 }} />

            {/* Navigation Footer */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                variant="outlined"
                size="large"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                sx={{ px: 4, borderRadius: 2, fontWeight: 600, color: "#64748b", borderColor: "#cbd5e1" }}
              >
                Previous
              </Button>

              {currentQuestion < mockQuestions.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  sx={{ px: 5, borderRadius: 2, fontWeight: 600 }}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleEndTest}
                  sx={{ px: 5, borderRadius: 2, fontWeight: 600, bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
                >
                  Submit Final Answers
                </Button>
              )}
            </Box>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TestPage;