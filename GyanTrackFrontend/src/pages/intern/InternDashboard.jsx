import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Avatar,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  DialogContentText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Quiz,
  Assignment,
  Person,
  ExitToApp,
  PlayArrow,
  Timer,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { internApi } from '../../api/internApi';

const drawerWidth = 260;
const MAX_WARNINGS = 3;

const InternDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('tests');
  const { user, logout } = useAuth();
  
  // State management
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [tests, setTests] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [profile, setProfile] = useState(null);
  
  // Test taking state
  const [testDialog, setTestDialog] = useState({ open: false, test: null });
  const [testInProgress, setTestInProgress] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [resultDialog, setResultDialog] = useState({ open: false, result: null });
  
  const timerRef = useRef(null);

  useEffect(() => {
    loadData();
    
    // Proctoring: Prevent right-click
    const handleContextMenu = (e) => {
      if (testInProgress) {
        e.preventDefault();
        handleWarning();
      }
    };
    
    // Proctoring: Prevent text selection
    const handleSelectStart = (e) => {
      if (testInProgress) {
        e.preventDefault();
        handleWarning();
      }
    };
    
    // Proctoring: Detect tab switching
    const handleVisibilityChange = () => {
      if (testInProgress && document.hidden) {
        handleWarning();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testInProgress, warnings]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadTests(),
        loadEvaluations(),
        loadProfile(),
      ]);
    } catch (error) {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const loadTests = async () => {
    try {
      const data = await internApi.getTests();
      setTests(data);
    } catch (error) {
      console.error('Failed to load tests', error);
    }
  };

  const loadEvaluations = async () => {
    try {
      const data = await internApi.getEvaluations();
      setEvaluations(data);
    } catch (error) {
      console.error('Failed to load evaluations', error);
    }
  };

  const loadProfile = async () => {
    try {
      const data = await internApi.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Warning handler for proctoring
  const handleWarning = useCallback(() => {
    const newWarnings = warnings + 1;
    setWarnings(newWarnings);
    
    showSnackbar(`Warning ${newWarnings}/${MAX_WARNINGS}: Tab switching detected!`, 'warning');
    
    if (newWarnings >= MAX_WARNINGS) {
      handleAutoSubmit();
    }
  }, [warnings]);

  // Start test
  const handleStartTest = async (test) => {
    try {
      const testDetails = await internApi.getTestDetails(test.testId);
      setQuestions(testDetails.questions || []);
      setAnswers({});
      setTimeLeft(test.durationMinutes * 60);
      setWarnings(0);
      setCurrentTest(test);
      setTestDialog({ open: false, test: null });
      setTestInProgress(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      showSnackbar('Failed to start test', 'error');
    }
  };

  // Auto submit when time runs out or max warnings reached
  const handleAutoSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      const attemptId = currentTest?.attemptId || 1; // Get from test details
      const answerList = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId: optionId,
      }));
      
      const result = await internApi.submitTest(attemptId, answerList);
      setTestInProgress(false);
      setResultDialog({ open: true, result });
    } catch (error) {
      showSnackbar('Test auto-submitted', 'info');
      setTestInProgress(false);
    }
  };

  // Manual submit
  const handleSubmitTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      const attemptId = currentTest?.attemptId || 1;
      const answerList = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId: optionId,
      }));
      
      const result = await internApi.submitTest(attemptId, answerList);
      setTestInProgress(false);
      setResultDialog({ open: true, result });
      showSnackbar('Test submitted successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to submit test', 'error');
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'info.main', width: 44, height: 44 }}>
          <Assignment />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Intern
          </Typography>
          <Typography variant="caption" color="text.secondary">
            GyanTrack
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {[
          { id: 'tests', icon: <Quiz />, label: 'Tests' },
          { id: 'evaluations', icon: <Assignment />, label: 'Evaluations' },
          { id: 'profile', icon: <Person />, label: 'Profile' },
        ].map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'info.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'info.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const renderTests = () => {
    const liveTests = tests.filter((t) => t.isLive && !t.hasAttempted);
    const upcomingTests = tests.filter((t) => !t.isLive && !t.hasAttempted);
    const completedTests = tests.filter((t) => t.hasAttempted);

    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Available Tests
        </Typography>

        {/* Live Tests */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
          🔴 Live Tests
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {liveTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.testId}>
              <Card sx={{ border: '2px solid', borderColor: 'success.main' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {test.subjectName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Timer fontSize="small" />
                    <Typography variant="body2">{test.durationMinutes} minutes</Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<PlayArrow />}
                    onClick={() => setTestDialog({ open: true, test })}
                  >
                    Start Test
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {liveTests.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">No live tests available at the moment.</Alert>
            </Grid>
          )}
        </Grid>

        {/* Upcoming Tests */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'warning.main' }}>
          📅 Upcoming Tests
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {upcomingTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.testId}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {test.subjectName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Starts: {new Date(test.startTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Duration: {test.durationMinutes} minutes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {upcomingTests.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">No upcoming tests scheduled.</Alert>
            </Grid>
          )}
        </Grid>

        {/* Completed Tests */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'info.main' }}>
          ✅ Completed Tests
        </Typography>
        <Grid container spacing={2}>
          {completedTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.testId}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {test.subjectName}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Score:</Typography>
                    <Chip
                      label={`${test.obtainedScore}/${test.totalScore}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {completedTests.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">No tests completed yet.</Alert>
            </Grid>
          )}
        </Grid>

        {/* Test Instructions Dialog */}
        <Dialog open={testDialog.open} onClose={() => setTestDialog({ open: false, test: null })}>
          <DialogTitle>Test Instructions</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Test:</strong> {testDialog.test?.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Duration:</strong> {testDialog.test?.durationMinutes} minutes
            </Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>⚠️ Proctoring Active:</strong>
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Right-click is disabled</li>
                <li>Text selection is disabled</li>
                <li>Tab switching will be detected</li>
                <li><strong>3 warnings will auto-submit your test!</strong></li>
              </ul>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestDialog({ open: false, test: null })}>Cancel</Button>
            <Button variant="contained" color="success" onClick={() => handleStartTest(testDialog.test)}>
              I Understand - Start Test
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // Render test taking interface
  const renderTestInterface = () => {
    if (!testInProgress || !currentTest) return null;

    return (
      <Dialog fullScreen open={testInProgress}>
        <AppBar sx={{ position: 'relative' }} color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {currentTest.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {warnings > 0 && (
                <Chip
                  icon={<Warning />}
                  label={`Warnings: ${warnings}/${MAX_WARNINGS}`}
                  color="error"
                />
              )}
              <Chip
                icon={<Timer />}
                label={formatTime(timeLeft)}
                color={timeLeft < 300 ? 'error' : 'default'}
                sx={{ bgcolor: 'white', color: timeLeft < 300 ? 'red' : 'black' }}
              />
            </Box>
          </Toolbar>
          <LinearProgress
            variant="determinate"
            value={((currentTest.durationMinutes * 60 - timeLeft) / (currentTest.durationMinutes * 60)) * 100}
            sx={{ height: 4 }}
          />
        </AppBar>
        
        <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>⚠️ Proctoring:</strong> Right-click disabled. Text selection disabled. Tab switching monitored. 3 warnings = auto-submit!
          </Alert>
          
          {questions.map((question, index) => (
            <Card key={question.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Question {index + 1}: {question.questionText}
                  <Chip label={`${question.marks} marks`} size="small" sx={{ ml: 2 }} />
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: parseInt(e.target.value) })}
                  >
                    {question.options?.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={option.optionText}
                        sx={{
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: answers[question.id] === option.id ? 'primary.light' : 'transparent',
                          '&:hover': { bgcolor: 'grey.100' },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Typography variant="body2">
              Answered: {Object.keys(answers).length} / {questions.length}
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmitTest}
            >
              Submit Test
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  };

  const renderEvaluations = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        My Performance Evaluations
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Technical Score</TableCell>
                <TableCell>Communication Score</TableCell>
                <TableCell>Attendance Score</TableCell>
                <TableCell>Overall</TableCell>
                <TableCell>Evaluator</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.map((eval_) => {
                const overall = ((eval_.technicalScore + eval_.communicationScore + eval_.attendanceScore) / 3).toFixed(1);
                return (
                  <TableRow key={eval_.id}>
                    <TableCell sx={{ fontWeight: 500 }}>{eval_.subjectName}</TableCell>
                    <TableCell>
                      <Chip
                        label={eval_.technicalScore}
                        color={eval_.technicalScore >= 70 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={eval_.communicationScore}
                        color={eval_.communicationScore >= 70 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={eval_.attendanceScore}
                        color={eval_.attendanceScore >= 70 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={overall} color="primary" />
                    </TableCell>
                    <TableCell>{eval_.evaluatorName}</TableCell>
                  </TableRow>
                );
              })}
              {evaluations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No evaluations yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  const renderProfile = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        My Profile
      </Typography>

      {profile && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                  bgcolor: 'info.main',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                {profile.fullName?.charAt(0)}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {profile.fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {profile.email}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Batch
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.batch}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Assigned Evaluators
                </Typography>
                {profile.assignedEvaluators?.length > 0 ? (
                  profile.assignedEvaluators.map((eval_, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {eval_.evaluatorName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {eval_.department}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No evaluators assigned yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            Intern Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.fullName}
            </Typography>
            <Avatar sx={{ bgcolor: 'info.main', width: 36, height: 36 }}>
              {user?.fullName?.charAt(0)}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {activeSection === 'tests' && renderTests()}
        {activeSection === 'evaluations' && renderEvaluations()}
        {activeSection === 'profile' && renderProfile()}
      </Box>

      {/* Test Interface */}
      {renderTestInterface()}

      {/* Result Dialog */}
      <Dialog open={resultDialog.open} onClose={() => setResultDialog({ open: false, result: null })} maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h5">Test Completed!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {resultDialog.result && (
            <Box>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700, my: 2 }}>
                {resultDialog.result.percentage}%
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Score: {resultDialog.result.obtainedScore} / {resultDialog.result.totalScore}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Chip label={`${resultDialog.result.correctAnswers} Correct`} color="success" />
                <Chip label={`${resultDialog.result.wrongAnswers} Wrong`} color="error" />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={() => {
            setResultDialog({ open: false, result: null });
            loadTests();
          }}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InternDashboard;
