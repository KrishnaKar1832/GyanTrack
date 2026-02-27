import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemIcon,
  Avatar, Divider, Button, FormControl, InputLabel, Select, MenuItem,
  Chip, IconButton, CircularProgress, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { hrService } from "../../services/hrService";

const DepartmentAssignment = () => {
  const [mappings, setMappings] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEvaluatorId, setNewEvaluatorId] = useState("");
  const [newInternId, setNewInternId] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mappingRes, evalRes, internRes] = await Promise.all([
        hrService.getAllMappings(),
        hrService.getEvaluators(),
        hrService.getInterns(),
      ]);
      setMappings(mappingRes.data || []);
      setEvaluators(evalRes.data || []);
      setInterns(internRes.data || []);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load assignments", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async () => {
    if (!newEvaluatorId || !newInternId) return;
    setSaving(true);
    try {
      await hrService.createMapping({ evaluatorId: Number(newEvaluatorId), internId: Number(newInternId) });
      setSnackbar({ open: true, message: "Assignment created!", severity: "success" });
      setDialogOpen(false);
      setNewEvaluatorId("");
      setNewInternId("");
      await loadData();
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Failed to create assignment", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (mappingId) => {
    try {
      await hrService.deleteMapping(mappingId);
      setSnackbar({ open: true, message: "Assignment removed", severity: "info" });
      await loadData();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to remove assignment", severity: "error" });
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1e293b" mb={0.5}>
            Evaluator ↔ Intern Assignments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage which evaluators assess which interns.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<GroupAddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: 2, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", fontWeight: 700 }}
        >
          New Assignment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Group mappings by evaluator */}
        {evaluators.map((ev) => {
          const myMappings = mappings.filter((m) => m.evaluatorId === ev.id);
          if (myMappings.length === 0) return null;
          return (
            <Grid item xs={12} md={6} key={ev.id}>
              <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{ p: 2.5, bgcolor: "#f0fdf4", borderBottom: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <BusinessIcon sx={{ color: "#166534" }} />
                    <Typography variant="h6" fontWeight={700} color="#166534">{ev.name}</Typography>
                  </Box>
                  <Chip label={`${myMappings.length} intern${myMappings.length !== 1 ? "s" : ""}`} size="small" sx={{ bgcolor: "#bbf7d0", color: "#166534", fontWeight: 700 }} />
                </Box>
                {ev.department && (
                  <Box sx={{ px: 2.5, py: 0.5, bgcolor: "#f8fafc" }}>
                    <Typography variant="caption" color="text.secondary">Dept: {ev.department}</Typography>
                  </Box>
                )}
                <List sx={{ p: 1.5 }}>
                  {myMappings.map((m) => (
                    <ListItem
                      key={m.id}
                      secondaryAction={
                        <IconButton size="small" color="error" onClick={() => handleDelete(m.id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      }
                      sx={{ bgcolor: "white", mb: 1, borderRadius: 2, border: "1px solid #e2e8f0" }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: "#dbeafe", color: "#1e40af", width: 36, height: 36, fontSize: 14 }}>
                          {m.internName?.charAt(0) || "I"}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight={600} color="#334155">{m.internName}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          );
        })}
        {mappings.length === 0 && (
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
              <Typography color="text.secondary">No assignments yet. Click "New Assignment" to get started.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add Assignment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>New Evaluator ↔ Intern Assignment</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3, mt: 1 }}>
            <InputLabel>Evaluator</InputLabel>
            <Select value={newEvaluatorId} label="Evaluator" onChange={(e) => setNewEvaluatorId(e.target.value)}>
              {evaluators.map((ev) => <MenuItem key={ev.id} value={ev.id}>{ev.name} ({ev.department})</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Intern</InputLabel>
            <Select value={newInternId} label="Intern" onChange={(e) => setNewInternId(e.target.value)}>
              {interns.map((i) => <MenuItem key={i.id} value={i.id}>{i.name} ({i.department}, {i.batch})</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained" onClick={handleAdd}
            disabled={saving || !newEvaluatorId || !newInternId}
            sx={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentAssignment;