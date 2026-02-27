import { useState, useEffect } from 'react';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Avatar,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assignment,
  Quiz,
  People,
  Assessment,
  ExitToApp,
  Add,
  Delete,
  PlayArrow,
  Visibility,
  Send,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { evaluatorApi } from '../../api/evaluatorApi';
import { adminApi } from '../../api/adminApi';

const drawerWidth = 260;

const EvaluatorDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { user, logout } = useAuth();
  
  // State management
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [templates, setTemplates] = useState([]);
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [interns, setInterns] = useState([]);
  
  // Dialog states
  const [testDialog, setTestDialog] = useState({ open: false, edit: null });
  const [questionDialog, setQuestionDialog] = useState({ open: false, testId: null });
  const [resultDialog, setResultDialog] = useState({ open: false, attempt: null });
  const [remarkDialog, setRemarkDialog] = useState({ open: false, attemptId: null });
  
  // Form data
  const [testForm, setTestForm] = useState({
    templateId: '',
    title: '',
    startTime: '',
    endTime: '',
    durationMinutes: 30,
  });
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    marks: 10,
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
    ],
  });
  const [remarkForm, setRemarkForm] = useState({ remarks: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadTemplates(),
        loadTests(),
        loadAttempts(),
        loadSubjects(),
        loadInterns(),
      ]);
    } catch (error) {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const loadTemplates = async () => {
    try {
      const data = await evaluatorApi.getAssignedTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates', error);
    }
  };

  const loadTests = async () => {
    try {
      const data = await evaluatorApi.getCreatedTests();
      setTests(data);
    } catch (error) {
      console.error('Failed to load tests', error);
    }
  };

  const loadAttempts = async () => {
    try {
      const data = await evaluatorApi.getTestAttempts();
      setAttempts(data);
    } catch (error) {
      console.error('Failed to load attempts', error);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await adminApi.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects', error);
    }
  };

  const loadInterns = async () => {
    try {
      const data = await adminApi.getInterns();
      setInterns(data);
    } catch (error) {
      console.error('Failed to load interns', error);
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

  // Test handlers
  const handleTestSubmit = async () => {
    try {
      await evaluatorApi.createTest(testForm);
      showSnackbar('Test created successfully');
      setTestDialog({ open: false, edit: null });
      setTestForm({
        templateId: '',
        title: '',
        startTime: '',
        endTime: '',
        durationMinutes: 30,
      });
      loadTests();
    } catch (error) {
      showSnackbar('Failed to create test', 'error');
    }
  };

  const handleDeleteTest = async (id) => {
    try {
      await evaluatorApi.deleteTest(id);
      showSnackbar('Test deleted successfully');
      loadTests();
    } catch (error) {
      showSnackbar('Failed to delete test', 'error');
    }
  };

  // Question handlers
  const handleQuestionSubmit = async () => {
    try {
      await evaluatorApi.createQuestion({
        testId: questionDialog.testId,
        ...questionForm,
      });
      showSnackbar('Question added successfully');
      setQuestionDialog({ open: false, testId: null });
      setQuestionForm({
        questionText: '',
        marks: 10,
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
        ],
      });
    } catch (error) {
      showSnackbar('Failed to add question', 'error');
    }
  };

  // Result handlers
  const handleViewResult = async (attemptId) => {
    try {
      const result = await evaluatorApi.getTestResult(attemptId);
      setResultDialog({ open: true, attempt: result });
    } catch (error) {
      showSnackbar('Failed to load result', 'error');
    }
  };

  // Remark handlers
  const handleRemarkSubmit = async () => {
    try {
      await evaluatorApi.submitRemark({
        attemptId: remarkDialog.attemptId,
        evaluatorId: user.id,
        ...remarkForm,
      });
      showSnackbar('Remark submitted successfully');
      setRemarkDialog({ open: false, attemptId: null });
      setRemarkForm({ remarks: '' });
    } catch (error) {
      showSnackbar('Failed to submit remark', 'error');
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'warning.main', width: 44, height: 44 }}>
          <Assignment />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Evaluator
          </Typography>
          <Typography variant="caption" color="text.secondary">
            GyanTrack
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {[
          { id: 'templates', icon: <Assignment />, label: 'My Templates' },
          { id: 'tests', icon: <Quiz />, label: 'Tests' },
          { id: 'attempts', icon: <People />, label: 'Attempts' },
        ].map((item, index) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeTab === index}
              onClick={() => setActiveTab(index)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'warning.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'warning.dark' },
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

  const renderTemplates = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        My Assignment Templates
      </Typography>
      
      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {template.subjectName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Department: {template.department}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`Technical: ${template.technicalWeight}%`} size="small" color="primary" />
                  <Chip label={`Comm: ${template.communicationWeight}%`} size="small" color="success" />
                  <Chip label={`Attend: ${template.attendanceWeight}%`} size="small" color="info" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {templates.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">No templates assigned to you yet.</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderTests = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          My Tests
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setTestDialog({ open: true, edit: null })}
          sx={{ bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' } }}
        >
          Create Test
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>{test.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{test.title}</TableCell>
                  <TableCell>{test.subjectName}</TableCell>
                  <TableCell>{test.durationMinutes} min</TableCell>
                  <TableCell>{new Date(test.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(test.endTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={test.isLive ? 'Live' : 'Inactive'}
                      color={test.isLive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => setQuestionDialog({ open: true, testId: test.id })}
                      >
                        <Add />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTest(test.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {tests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No tests created yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Test Dialog */}
      <Dialog open={testDialog.open} onClose={() => setTestDialog({ open: false, edit: null })} maxWidth="sm">
        <DialogTitle>Create New Test</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Template</InputLabel>
                <Select
                  value={testForm.templateId}
                  label="Template"
                  onChange={(e) => setTestForm({ ...testForm, templateId: e.target.value })}
                >
                  {templates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Title"
                value={testForm.title}
                onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={testForm.startTime}
                onChange={(e) => setTestForm({ ...testForm, startTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={testForm.endTime}
                onChange={(e) => setTestForm({ ...testForm, endTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={testForm.durationMinutes}
                onChange={(e) => setTestForm({ ...testForm, durationMinutes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleTestSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={questionDialog.open} onClose={() => setQuestionDialog({ open: false, testId: null })} maxWidth="md">
        <DialogTitle>Add Question</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question Text"
                multiline
                rows={3}
                value={questionForm.questionText}
                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Marks"
                type="number"
                value={questionForm.marks}
                onChange={(e) => setQuestionForm({ ...questionForm, marks: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Options (mark correct answer)</Typography>
              {questionForm.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Option ${index + 1}`}
                    value={option.optionText}
                    onChange={(e) => {
                      const newOptions = [...questionForm.options];
                      newOptions[index].optionText = e.target.value;
                      setQuestionForm({ ...questionForm, options: newOptions });
                    }}
                  />
                  <Chip
                    label="Correct"
                    color={option.isCorrect ? 'success' : 'default'}
                    onClick={() => {
                      const newOptions = questionForm.options.map((opt, i) => ({
                        ...opt,
                        isCorrect: i === index,
                      }));
                      setQuestionForm({ ...questionForm, options: newOptions });
                    }}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDialog({ open: false, testId: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleQuestionSubmit}>
            Add Question
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderAttempts = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Test Attempts
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Test</TableCell>
                <TableCell>Intern</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{attempt.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{attempt.testTitle}</TableCell>
                  <TableCell>{attempt.internName}</TableCell>
                  <TableCell>{new Date(attempt.startTime).toLocaleString()}</TableCell>
                  <TableCell>
                    {attempt.endTime ? new Date(attempt.endTime).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {attempt.isSubmitted ? `${attempt.score}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={attempt.isSubmitted ? 'Submitted' : 'In Progress'}
                      color={attempt.isSubmitted ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewResult(attempt.id)}
                        disabled={!attempt.isSubmitted}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="warning"
                        onClick={() => setRemarkDialog({ open: true, attemptId: attempt.id })}
                        disabled={!attempt.isSubmitted}
                      >
                        <Send />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {attempts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No attempts yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Result Dialog */}
      <Dialog open={resultDialog.open} onClose={() => setResultDialog({ open: false, attempt: null })} maxWidth="md">
        <DialogTitle>Test Result Details</DialogTitle>
        <DialogContent>
          {resultDialog.attempt && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Test Title</Typography>
                  <Typography variant="body1">{resultDialog.attempt.testTitle}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Subject</Typography>
                  <Typography variant="body1">{resultDialog.attempt.subjectName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Score</Typography>
                  <Typography variant="body1">{resultDialog.attempt.totalScore}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Obtained Score</Typography>
                  <Typography variant="h5" color="primary.main">
                    {resultDialog.attempt.obtainedScore} ({resultDialog.attempt.percentage}%)
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Correct Answers</Typography>
                  <Chip label={resultDialog.attempt.correctAnswers} color="success" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Wrong Answers</Typography>
                  <Chip label={resultDialog.attempt.wrongAnswers} color="error" />
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mb: 2 }}>Answer Details</Typography>
              {resultDialog.attempt.answers?.map((answer, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Q{index + 1}: {answer.questionText}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your Answer: <strong>{answer.selectedOptionText}</strong>
                  </Typography>
                  <Chip
                    label={answer.isCorrect ? 'Correct' : 'Incorrect'}
                    color={answer.isCorrect ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultDialog({ open: false, attempt: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Remark Dialog */}
      <Dialog open={remarkDialog.open} onClose={() => setRemarkDialog({ open: false, attemptId: null })}>
        <DialogTitle>Submit Remark</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Remarks"
            value={remarkForm.remarks}
            onChange={(e) => setRemarkForm({ ...remarkForm, remarks: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialog({ open: false, attemptId: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleRemarkSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
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
            Evaluator Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.fullName}
            </Typography>
            <Avatar sx={{ bgcolor: 'warning.main', width: 36, height: 36 }}>
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
        {activeTab === 0 && renderTemplates()}
        {activeTab === 1 && renderTests()}
        {activeTab === 2 && renderAttempts()}
      </Box>

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

export default EvaluatorDashboard;
