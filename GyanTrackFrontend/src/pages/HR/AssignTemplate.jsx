import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Paper,
  Grid,
} from "@mui/material";

const departments = ["Engineering", "Marketing", "Design", "HR"];
const evaluators = ["John Doe", "Jane Smith", "Alan Turing"];
const internsList = ["Alice", "Bob", "Charlie", "Dave"];

const AssignTemplate = () => {
  const [template, setTemplate] = useState({
    evaluator: "",
    interns: [],
    department: "",
    subject: "",
    weightage: {
      technical: 50,
      communication: 30,
      attendance: 20,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeightageChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      weightage: { ...prev.weightage, [name]: Number(value) },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Template Assigned:", template);
    alert("Template Assigned Successfully!");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Assign Template
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Create a new test template and assign evaluators and interns.
      </Typography>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 850 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Department */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={template.department}
                  onChange={handleChange}
                  label="Department"
                  required
                >
                  {departments.map((dep) => (
                    <MenuItem key={dep} value={dep}>
                      {dep}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Test Subject */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Test Subject"
                name="subject"
                value={template.subject}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Evaluator */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign Evaluator</InputLabel>
                <Select
                  name="evaluator"
                  value={template.evaluator}
                  onChange={handleChange}
                  label="Assign Evaluator"
                  required
                >
                  {evaluators.map((ev) => (
                    <MenuItem key={ev} value={ev}>
                      {ev}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Interns */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign Intern(s)</InputLabel>
                <Select
                  name="interns"
                  multiple
                  value={template.interns}
                  onChange={handleChange}
                  input={<OutlinedInput label="Assign Intern(s)" />}
                  renderValue={(selected) => selected.join(", ")}
                  required
                >
                  {internsList.map((intern) => (
                    <MenuItem key={intern} value={intern}>
                      <Checkbox checked={template.interns.indexOf(intern) > -1} />
                      <ListItemText primary={intern} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Weightage */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mt={1} mb={2} color="#475569">
                Marks Weightage (%)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Technical"
                    name="technical"
                    value={template.weightage.technical}
                    onChange={handleWeightageChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Communication"
                    name="communication"
                    value={template.weightage.communication}
                    onChange={handleWeightageChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Attendance"
                    name="attendance"
                    value={template.weightage.attendance}
                    onChange={handleWeightageChange}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth={false}
                sx={{ 
                  mt: 2, 
                  px: 6, 
                  py: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #219ebc, #023047)", 
                  fontWeight: 700,
                  width: { xs: "100%", sm: "auto" }
                }}
              >
                Assign Template
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AssignTemplate;