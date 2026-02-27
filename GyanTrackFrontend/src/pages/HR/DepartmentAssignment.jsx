import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const DepartmentAssignment = () => {
  const [selectedDept, setSelectedDept] = useState("Engineering");

  const departments = ["Engineering", "Marketing", "Design", "HR"];
  
  const mockPersonnel = {
    evaluators: [
      { id: 1, name: "Dr. Sarah Chen", role: "Sr. Evaluator" },
      { id: 2, name: "Marcus Johnson", role: "Tech Lead" }
    ],
    interns: [
      { id: 101, name: "Alex Rivendell" },
      { id: 102, name: "Samira Ahmed" },
      { id: 103, name: "Jordan Lee" }
    ]
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
            Department Roster
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and assign personnel across organizational sectors.
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 2 }} size="small">
          <InputLabel>View Department</InputLabel>
          <Select
            value={selectedDept}
            label="View Department"
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map((dep) => (
              <MenuItem key={dep} value={dep}>{dep}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {/* Evaluators Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden', height: "100%" }}>
            <Box sx={{ p: 3, bgcolor: '#f0fdf4', borderBottom: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <BusinessIcon sx={{ color: '#166534' }} />
                <Typography variant="h6" fontWeight={700} color="#166534">
                  Assigned Evaluators
                </Typography>
              </Box>
              <Chip label={mockPersonnel.evaluators.length} size="small" sx={{ bgcolor: '#bbf7d0', color: '#166534', fontWeight: 'bold' }} />
            </Box>
            
            <List sx={{ p: 2 }}>
              {mockPersonnel.evaluators.map((user) => (
                <ListItem 
                  key={user.id}
                  sx={{ 
                    bgcolor: 'white', 
                    mb: 1.5, 
                    borderRadius: 2, 
                    border: '1px solid #e2e8f0',
                    '&:hover': { borderColor: '#166534', bgcolor: '#f8fafc' }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#dcfce7', color: '#166534' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight={600} color="#334155">{user.name}</Typography>} 
                    secondary={user.role} 
                  />
                  <Button size="small" color="error">Remove</Button>
                </ListItem>
              ))}
              
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<AddCircleOutlineIcon />}
                sx={{ mt: 2, py: 1.5, borderStyle: 'dashed', borderWidth: 2, color: '#166534', borderColor: '#bbf7d0' }}
              >
                Assign New Evaluator
              </Button>
            </List>
          </Paper>
        </Grid>

        {/* Interns Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden', height: "100%" }}>
            <Box sx={{ p: 3, bgcolor: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <GroupAddIcon sx={{ color: '#1e40af' }} />
                <Typography variant="h6" fontWeight={700} color="#1e40af">
                  Assigned Interns
                </Typography>
              </Box>
              <Chip label={mockPersonnel.interns.length} size="small" sx={{ bgcolor: '#bfdbfe', color: '#1e40af', fontWeight: 'bold' }} />
            </Box>
            
            <List sx={{ p: 2 }}>
              {mockPersonnel.interns.map((user) => (
                <ListItem 
                  key={user.id}
                  sx={{ 
                    bgcolor: 'white', 
                    mb: 1.5, 
                    borderRadius: 2, 
                    border: '1px solid #e2e8f0',
                    '&:hover': { borderColor: '#1e40af', bgcolor: '#f8fafc' }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e40af' }}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight={600} color="#334155">{user.name}</Typography>} 
                    secondary="Intern Trainee" 
                  />
                  <Button size="small" color="error">Remove</Button>
                </ListItem>
              ))}
              
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<AddCircleOutlineIcon />}
                sx={{ mt: 2, py: 1.5, borderStyle: 'dashed', borderWidth: 2, color: '#1e40af', borderColor: '#bfdbfe' }}
              >
                Assign New Intern
              </Button>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepartmentAssignment;