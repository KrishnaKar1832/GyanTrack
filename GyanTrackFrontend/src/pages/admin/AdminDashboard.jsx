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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Assignment,
  People,
  Assessment,
  ExitToApp,
  Add,
  Delete,
  Edit,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/adminApi';

const drawerWidth = 260;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, logout } = useAuth();
  
  // State management
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [subjects, setSubjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [scores, setScores] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [interns, setInterns] = useState([]);
  const [departmentPerformance, setDepartmentPerformance] = useState([]);

  // Dialog states
  const [subjectDialog, setSubjectDialog] = useState({ open: false, edit: null });
  const [templateDialog, setTemplateDialog] = useState({ open: false, edit: null });
  const [mappingDialog, setMappingDialog] = useState({ open: false, edit: null });
  const [scoreDialog, setScoreDialog] = useState({ open: false, edit: null });

  // Form data
  const [subjectForm, setSubjectForm] = useState({ subjectName: '' });
  const [templateForm, setTemplateForm] = useState({
    subjectId: '',
    evaluatorId: '',
    technicalWeight: 40,
    communicationWeight: 30,
    attendanceWeight: 30,
  });
  const [mappingForm, setMappingForm] = useState({
    evaluatorId: '',
    internId: '',
  });
  const [scoreForm, setScoreForm] = useState({
    internId: '',
    templateId: '',
    technicalScore: 0,
    communicationScore: 0,
    attendanceScore: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSubjects(),
        loadTemplates(),
        loadMappings(),
        loadScores(),
        loadEvaluators(),
        loadInterns(),
        loadDepartmentPerformance(),
      ]);
    } catch (error) {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const loadSubjects = async () => {
    try {
      const data = await adminApi.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await adminApi.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates', error);
    }
  };

  const loadMappings = async () => {
    try {
      const data = await adminApi.getMappings();
      setMappings(data);
    } catch (error) {
      console.error('Failed to load mappings', error);
    }
  };

  const loadScores = async () => {
    try {
      const data = await adminApi.getScores();
      setScores(data);
    } catch (error) {
      console.error('Failed to load scores', error);
    }
  };

  const loadEvaluators = async () => {
    try {
      const data = await adminApi.getEvaluators();
      setEvaluators(data);
    } catch (error) {
      console.error('Failed to load evaluators', error);
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

  const loadDepartmentPerformance = async () => {
    try {
      const data = await adminApi.getDepartmentPerformance();
      setDepartmentPerformance(data);
    } catch (error) {
      console.error('Failed to load department performance', error);
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

  // Subject handlers
  const handleSubjectSubmit = async () => {
    try {
      if (subjectDialog.edit) {
        showSnackbar('Subject updated successfully');
      } else {
        await adminApi.createSubject(subjectForm);
        showSnackbar('Subject created successfully');
      }
      setSubjectDialog({ open: false, edit: null });
      setSubjectForm({ subjectName: '' });
      loadSubjects();
    } catch (error) {
      showSnackbar('Failed to save subject', 'error');
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await adminApi.deleteSubject(id);
      showSnackbar('Subject deleted successfully');
      loadSubjects();
    } catch (error) {
      showSnackbar('Failed to delete subject', 'error');
    }
  };

  // Template handlers
  const handleTemplateSubmit = async () => {
    try {
      await adminApi.createTemplate(templateForm);
      showSnackbar('Template created successfully');
      setTemplateDialog({ open: false, edit: null });
      setTemplateForm({
        subjectId: '',
        evaluatorId: '',
        technicalWeight: 40,
        communicationWeight: 30,
        attendanceWeight: 30,
      });
      loadTemplates();
    } catch (error) {
      showSnackbar('Failed to create template', 'error');
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await adminApi.deleteTemplate(id);
      showSnackbar('Template deleted successfully');
      loadTemplates();
    } catch (error) {
      showSnackbar('Failed to delete template', 'error');
    }
  };

  // Mapping handlers
  const handleMappingSubmit = async () => {
    try {
      await adminApi.createMapping(mappingForm);
      showSnackbar('Mapping created successfully');
      setMappingDialog({ open: false, edit: null });
      setMappingForm({ evaluatorId: '', internId: '' });
      loadMappings();
    } catch (error) {
      showSnackbar('Failed to create mapping', 'error');
    }
  };

  const handleDeleteMapping = async (id) => {
    try {
      await adminApi.deleteMapping(id);
      showSnackbar('Mapping deleted successfully');
      loadMappings();
    } catch (error) {
      showSnackbar('Failed to delete mapping', 'error');
    }
  };

  // Score handlers
  const handleScoreSubmit = async () => {
    try {
      await adminApi.createScore(scoreForm);
      showSnackbar('Score created successfully');
      setScoreDialog({ open: false, edit: null });
      setScoreForm({
        internId: '',
        templateId: '',
        technicalScore: 0,
        communicationScore: 0,
        attendanceScore: 0,
      });
      loadScores();
    } catch (error) {
      showSnackbar('Failed to create score', 'error');
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
          <Dashboard />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            GyanTrack
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {[
          { id: 'dashboard', icon: <Dashboard />, label: 'Dashboard' },
          { id: 'subjects', icon: <School />, label: 'Subjects' },
          { id: 'templates', icon: <Assignment />, label: 'Templates' },
          { id: 'mappings', icon: <People />, label: 'Evaluator-Intern' },
          { id: 'scores', icon: <Assessment />, label: 'Performance' },
        ].map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
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

  const renderDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.fullName || 'Admin'} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your intern management system today.
        </Typography>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Subjects
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {subjects.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                <School />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Templates
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {templates.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                <Assignment />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Evaluators
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {evaluators.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                <People />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Interns
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {interns.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.light', width: 56, height: 56 }}>
                <People />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Department Performance */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Department Performance Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Avg Technical</TableCell>
                    <TableCell>Avg Communication</TableCell>
                    <TableCell>Avg Attendance</TableCell>
                    <TableCell>Overall Average</TableCell>
                    <TableCell>Total Interns</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentPerformance.map((perf, index) => (
                    <TableRow key={index}>
                      <TableCell>{perf.department}</TableCell>
                      <TableCell>{perf.subjectName}</TableCell>
                      <TableCell>{perf.averageTechnicalScore?.toFixed(1)}</TableCell>
                      <TableCell>{perf.averageCommunicationScore?.toFixed(1)}</TableCell>
                      <TableCell>{perf.averageAttendanceScore?.toFixed(1)}</TableCell>
                      <TableCell>
                        <Chip
                          label={perf.overallAverage?.toFixed(1)}
                          color={perf.overallAverage >= 70 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{perf.totalInterns}</TableCell>
                    </TableRow>
                  ))}
                  {departmentPerformance.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No performance data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSubjects = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Subject Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setSubjectDialog({ open: true, edit: null })}
        >
          Add Subject
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Subject Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{subject.subjectName}</TableCell>
                  <TableCell>{new Date(subject.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteSubject(subject.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {subjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No subjects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Subject Dialog */}
      <Dialog open={subjectDialog.open} onClose={() => setSubjectDialog({ open: false, edit: null })}>
        <DialogTitle>{subjectDialog.edit ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Subject Name"
            value={subjectForm.subjectName}
            onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubjectDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubjectSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderTemplates = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Assignment Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setTemplateDialog({ open: true, edit: null })}
        >
          Create Template
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Evaluator</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Weights (T/C/A)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.id}</TableCell>
                  <TableCell>{template.subjectName}</TableCell>
                  <TableCell>{template.evaluatorName}</TableCell>
                  <TableCell>{template.department}</TableCell>
                  <TableCell>
                    {template.technicalWeight}/{template.communicationWeight}/{template.attendanceWeight}
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteTemplate(template.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No templates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Template Dialog */}
      <Dialog open={templateDialog.open} onClose={() => setTemplateDialog({ open: false, edit: null })} maxWidth="sm">
        <DialogTitle>Create Assignment Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={templateForm.subjectId}
                  label="Subject"
                  onChange={(e) => setTemplateForm({ ...templateForm, subjectId: e.target.value })}
                >
                  {subjects.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Evaluator</InputLabel>
                <Select
                  value={templateForm.evaluatorId}
                  label="Evaluator"
                  onChange={(e) => setTemplateForm({ ...templateForm, evaluatorId: e.target.value })}
                >
                  {evaluators.map((e) => (
                    <MenuItem key={e.evaluatorId} value={e.evaluatorId}>
                      {e.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Technical Weight"
                type="number"
                value={templateForm.technicalWeight}
                onChange={(e) => setTemplateForm({ ...templateForm, technicalWeight: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Communication Weight"
                type="number"
                value={templateForm.communicationWeight}
                onChange={(e) => setTemplateForm({ ...templateForm, communicationWeight: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Attendance Weight"
                type="number"
                value={templateForm.attendanceWeight}
                onChange={(e) => setTemplateForm({ ...templateForm, attendanceWeight: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleTemplateSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderMappings = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Evaluator-Intern Mappings
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setMappingDialog({ open: true, edit: null })}
        >
          Add Mapping
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Evaluator</TableCell>
                <TableCell>Intern</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{mapping.id}</TableCell>
                  <TableCell>{mapping.evaluatorName}</TableCell>
                  <TableCell>{mapping.internName}</TableCell>
                  <TableCell>{new Date(mapping.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteMapping(mapping.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {mappings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No mappings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Mapping Dialog */}
      <Dialog open={mappingDialog.open} onClose={() => setMappingDialog({ open: false, edit: null })}>
        <DialogTitle>Add Evaluator-Intern Mapping</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Evaluator</InputLabel>
                <Select
                  value={mappingForm.evaluatorId}
                  label="Evaluator"
                  onChange={(e) => setMappingForm({ ...mappingForm, evaluatorId: e.target.value })}
                >
                  {evaluators.map((e) => (
                    <MenuItem key={e.evaluatorId} value={e.evaluatorId}>
                      {e.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Intern</InputLabel>
                <Select
                  value={mappingForm.internId}
                  label="Intern"
                  onChange={(e) => setMappingForm({ ...mappingForm, internId: e.target.value })}
                >
                  {interns.map((i) => (
                    <MenuItem key={i.internId} value={i.internId}>
                      {i.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMappingDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleMappingSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderScores = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Performance Scores
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadScores}>
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setScoreDialog({ open: true, edit: null })}
          >
            Add Score
          </Button>
        </Box>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Intern</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Technical</TableCell>
                <TableCell>Communication</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Evaluator</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell>{score.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{score.internName}</TableCell>
                  <TableCell>{score.department}</TableCell>
                  <TableCell>{score.subjectName}</TableCell>
                  <TableCell>
                    <Chip
                      label={score.technicalScore}
                      color={score.technicalScore >= 70 ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={score.communicationScore}
                      color={score.communicationScore >= 70 ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={score.attendanceScore}
                      color={score.attendanceScore >= 70 ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{score.evaluatorName}</TableCell>
                </TableRow>
              ))}
              {scores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No scores found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Score Dialog */}
      <Dialog open={scoreDialog.open} onClose={() => setScoreDialog({ open: false, edit: null })} maxWidth="sm">
        <DialogTitle>Add Performance Score</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Intern</InputLabel>
                <Select
                  value={scoreForm.internId}
                  label="Intern"
                  onChange={(e) => setScoreForm({ ...scoreForm, internId: e.target.value })}
                >
                  {interns.map((i) => (
                    <MenuItem key={i.internId} value={i.internId}>
                      {i.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Template</InputLabel>
                <Select
                  value={scoreForm.templateId}
                  label="Template"
                  onChange={(e) => setScoreForm({ ...scoreForm, templateId: e.target.value })}
                >
                  {templates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Technical Score"
                type="number"
                value={scoreForm.technicalScore}
                onChange={(e) => setScoreForm({ ...scoreForm, technicalScore: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Communication Score"
                type="number"
                value={scoreForm.communicationScore}
                onChange={(e) => setScoreForm({ ...scoreForm, communicationScore: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Attendance Score"
                type="number"
                value={scoreForm.attendanceScore}
                onChange={(e) => setScoreForm({ ...scoreForm, attendanceScore: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScoreDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleScoreSubmit}>
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
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.fullName}
            </Typography>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
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
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'subjects' && renderSubjects()}
        {activeSection === 'templates' && renderTemplates()}
        {activeSection === 'mappings' && renderMappings()}
        {activeSection === 'scores' && renderScores()}
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

export default AdminDashboard;
