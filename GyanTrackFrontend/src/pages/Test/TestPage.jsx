import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  AlertTitle,
  CircularProgress
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { internService } from "../../services/internService";

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [testDetails, setTestDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [hasStarted, setHasStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionId }

  const [showWarning, setShowWarning] = useState(false);

  // 1. Fetch test details and questions on load
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testRes = await internService.getTestWithQuestions(id);
        setTestDetails(testRes.data.test || testRes.data); // Depends on backend wrapper

        // The backend returns an array of questions directly for this endpoint
        const qList = Array.isArray(testRes.data) ? testRes.data : testRes.data.questions || [];
        setQuestions(qList);

        // Calculate initial time in seconds (fallback to 30 mins)
        // If getting durationMinutes from another endpoint, handle it, else default:
        setTimeLeft((testRes.data.durationMinutes || 30) * 60);
      } catch (err) {
        console.error("Error loading test:", err);
        setErrorMsg(err.response?.data?.message || "Failed to load test. It may not be live or you may have already attempted it.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTest();
  }, [id]);

  const logActivity = useCallback((activity) => {
    console.warn(`TEST ACTIVITY LOG: ${activity}`);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 5000);
  }, []);

  // 2. Start Test Attempt
  const handleStart = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      const internId = userStr ? JSON.parse(userStr).id : 0;

      const res = await internService.startAttempt({ testId: Number(id), internId });
      setAttemptId(res.data.id || res.data.attemptId);

      document.documentElement.requestFullscreen().catch(err => {
        console.log("Error attempting to enable fullscreen:", err);
      });
      setHasStarted(true);
      logActivity("Test Started");
    } catch (err) {
      console.error("Failed to start attempt:", err);
      setErrorMsg(err.response?.data?.message || "Failed to start test attempt. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Test Attempt
  const handleEndTest = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }

    try {
      // Format answers for backend SubmitTestAttemptDTO
      // { attemptId, answers: [{questionId, selectedOptionId}] }
      const answersList = Object.keys(answers).map(qId => ({
        questionId: Number(qId),
        selectedOptionId: Number(answers[qId])
      }));

      await internService.submitAttempt({
        attemptId: attemptId,
        answers: answersList
      });

      // Navigate to score/result summary page
      navigate(`/intern/test-result/${attemptId}`);
    } catch (err) {
      console.error("Failed to submit test:", err);
      setErrorMsg("Failed to submit test. Please DO NOT close the page and try again.");
      setSubmitting(false); // Let them try clicking submit again
    }
  }, [navigate, answers, attemptId, submitting]);

  // Timer Effect
  useEffect(() => {
    if (!hasStarted) return;

    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      handleEndTest(); // Auto submit when time is up
    }
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, handleEndTest]);

  // Anti-cheat mechanisms
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

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  if (errorMsg && !hasStarted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          <AlertTitle sx={{ fontWeight: "bold" }}>Test Unavailable</AlertTitle>
          {errorMsg}
        </Alert>
        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate("/intern")}>Return to Dashboard</Button>
      </Container>
    );
  }

  // ----------------------------------------------------
  // INSTRUCTION SCREEN UI
  // ----------------------------------------------------
  if (!hasStarted) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 8, display: "flex", alignItems: "center" }}>
        <Container maxWidth="md">
          <Card elevation={6} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Box sx={{ bgcolor: "#219ebc", color: "white", p: 4, textAlign: "center" }}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Technical Assessment
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Test ID: #{id} • Questions: {questions.length} • Duration: {Math.round(timeLeft / 60)} Minutes
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 3, md: 6 } }}>
              <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
                <AlertTitle sx={{ fontWeight: "bold" }}>Proctored Environment Active</AlertTitle>
                This assessment is strictly monitored. Any attempt to leave the fullscreen, switch tabs, or use keyboard shortcuts will be recorded and may lead to disqualification.
              </Alert>

              <Typography variant="h6" fontWeight="bold" gutterBottom color="#023047">
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
                label={<Typography fontWeight={500} color="#023047">I agree to the test rules and understand the consequences of malpractice.</Typography>}
                sx={{ mb: 4 }}
              />

              <Button
                variant="contained" size="large" fullWidth
                disabled={!agreed || questions.length === 0}
                onClick={handleStart}
                sx={{
                  py: 2, fontSize: "1.1rem", fontWeight: 700,
                  background: agreed ? "linear-gradient(135deg, #fb8500, #ffb703)" : "#cbd5e1",
                  color: "white",
                  boxShadow: agreed ? "0 10px 25px -5px rgba(251, 133, 0, 0.4)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: agreed ? "translateY(-2px)" : "none",
                    boxShadow: agreed ? "0 20px 25px -5px rgba(251, 133, 0, 0.5)" : "none",
                    background: agreed ? "linear-gradient(135deg, #ffb703, #fb8500)" : "#cbd5e1",
                  }
                }}
              >
                {questions.length === 0 ? "NO QUESTIONS AVAILABLE" : "BEGIN ASSESSMENT"}
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Handle edge case if no questions
  if (questions.length === 0) return <Typography align="center" mt={10}>No questions found for this test.</Typography>;

  const currentQ = questions[currentQuestion];

  // ----------------------------------------------------
  // ACTIVE TEST UI
  // ----------------------------------------------------
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", userSelect: "none", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Paper elevation={2} sx={{ py: 2, px: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 0, bgcolor: "white" }}>
        <Typography variant="h6" fontWeight={800} color="#023047">
          Technical Assessment
        </Typography>

        <Box display="flex" alignItems="center" bgcolor={timeLeft < 300 ? "#fee2e2" : "#f1f5f9"} px={3} py={1} borderRadius={2} color={timeLeft < 300 ? "#ef4444" : "#023047"}>
          <AccessTimeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            {formatTime(timeLeft)}
          </Typography>
        </Box>
      </Paper>

      {errorMsg && (
        <Alert severity="error" sx={{ position: "fixed", top: 80, left: '50%', transform: "translateX(-50%)", zIndex: 9999, width: "90%", maxWidth: 600 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Warning Toast */}
      {showWarning && (
        <Alert severity="warning" variant="filled" sx={{ position: "fixed", top: 140, left: '50%', transform: "translateX(-50%)", zIndex: 9999, boxShadow: 4 }}>
          <AlertTitle sx={{ fontWeight: "bold" }}>Warning Issued</AlertTitle>
          Malpractice detected! Your activity has been logged.
        </Alert>
      )}

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 6, display: "flex", flexDirection: "column" }}>

        {/* Progress indicator */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Typography variant="subtitle1" fontWeight={600} color="#475569">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
        </Box>

        <Card elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}>
          <CardContent>
            {/* Question Text */}
            <Typography variant="h5" fontWeight={600} color="#023047" mb={4} lineHeight={1.5}>
              Q{currentQuestion + 1}. {currentQ.questionText}
              <Typography component="span" variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                [{currentQ.marks} Marks]
              </Typography>
            </Typography>

            {/* Options */}
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleOptionChange(currentQ.id, e.target.value)}
              >
                <Grid container spacing={3}>
                  {currentQ.options?.map((opt) => (
                    <Grid item xs={12} key={opt.id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          borderWidth: answers[currentQ.id] == opt.id ? 2 : 1,
                          borderColor: answers[currentQ.id] == opt.id ? "#219ebc" : "#cbd5e1",
                          bgcolor: answers[currentQ.id] == opt.id ? "#f0f9ff" : "white",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <FormControlLabel
                          value={opt.id}
                          control={<Radio color="primary" sx={{ ml: 1, color: answers[currentQ.id] == opt.id ? "#219ebc" : undefined }} />}
                          label={<Typography variant="body1" fontWeight={500} color="#023047">{opt.optionText}</Typography>}
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
                variant="outlined" size="large" disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                sx={{ px: 4, borderRadius: 2, fontWeight: 600, color: "#475569", borderColor: "#cbd5e1" }}
              >
                Previous
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  variant="contained" color="primary" size="large"
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  sx={{ px: 5, borderRadius: 2, fontWeight: 600 }}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="contained" color="secondary" size="large"
                  onClick={handleEndTest}
                  disabled={submitting}
                  sx={{ px: 5, borderRadius: 2, fontWeight: 700 }}
                >
                  {submitting ? "Submitting..." : "Submit Final Answers"}
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