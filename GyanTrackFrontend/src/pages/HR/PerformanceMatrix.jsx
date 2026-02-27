import { useState, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Select, MenuItem, FormControl, InputLabel, Paper,
  Avatar, Chip, IconButton, Tooltip as MuiTooltip
} from "@mui/material";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from "recharts";
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const mockDepartmentData = [
  { name: "Engineering", avgScore: 82, highest: 96, lowest: 65, growth: 5 },
  { name: "Marketing", avgScore: 75, highest: 88, lowest: 55, growth: 2 },
  { name: "Design", avgScore: 88, highest: 98, lowest: 72, growth: 8 },
  { name: "HR", avgScore: 70, highest: 85, lowest: 50, growth: 1 },
];

const mockInternData = [
  { 
    id: 1, name: "Alex Rivendell", department: "Engineering", 
    performance: [
      { test: "Week 1", score: 65 }, { test: "Week 2", score: 72 }, { test: "Week 3", score: 85 }, { test: "Final", score: 92 }
    ]
  },
  { 
    id: 2, name: "Samira Ahmed", department: "Engineering", 
    performance: [
      { test: "Week 1", score: 80 }, { test: "Week 2", score: 85 }, { test: "Week 3", score: 88 }, { test: "Final", score: 90 }
    ]
  },
  { 
    id: 3, name: "Jordan Lee", department: "Design", 
    performance: [
      { test: "Week 1", score: 70 }, { test: "Week 2", score: 78 }, { test: "Week 3", score: 85 }, { test: "Final", score: 95 }
    ]
  }
];

const PerformanceMatrix = () => {
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("avgScore");
  const [selectedIntern, setSelectedIntern] = useState(mockInternData[0].id);

  // Filter & Sort Department Data
  const processedDeptData = useMemo(() => {
    let data = [...mockDepartmentData];
    if (departmentFilter !== "All") {
      data = data.filter(d => d.name === departmentFilter);
    }
    return data.sort((a, b) => b[sortBy] - a[sortBy]);
  }, [departmentFilter, sortBy]);

  // Get active intern chart data
  const activeIntern = mockInternData.find(i => i.id === selectedIntern);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Analytics Hub
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Deep-dive into organizational performance metrics and track individual intern growth trajectories.
      </Typography>

      {/* Control Panel */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 4, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterListIcon sx={{ color: '#64748b' }} />
          <Typography fontWeight={600} color="#334155">Filters & Sorting</Typography>
        </Box>
        
        <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
          <InputLabel>Department Filter</InputLabel>
          <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} label="Department Filter">
            <MenuItem value="All">All Departments</MenuItem>
            {mockDepartmentData.map(d => <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
          <InputLabel>Sort Metrics By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort Metrics By">
            <MenuItem value="avgScore">Average Score (High to Low)</MenuItem>
            <MenuItem value="growth">Growth % (High to Low)</MenuItem>
            <MenuItem value="highest">Highest Score Achieved</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Grid container spacing={4}>
        {/* Department Comparison */}
        <Grid item xs={12} lg={7}>
          <Card elevation={2} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} color="#1e293b" mb={3}>
                Department Aggregates
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedDeptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                    <Bar dataKey="avgScore" name="Average Score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="highest" name="Highest Score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Individual Intern Growth */}
        <Grid item xs={12} lg={5}>
          <Card elevation={2} sx={{ borderRadius: 4, height: "100%", display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                  Individual Growth Tracker
                </Typography>
                <MuiTooltip title="Select Intern">
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select 
                      value={selectedIntern} 
                      onChange={(e) => setSelectedIntern(e.target.value)} 
                      sx={{ borderRadius: 2, height: 36, fontSize: '0.875rem' }}
                    >
                      {mockInternData.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </MuiTooltip>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={3} p={2} bgcolor="#f8fafc" borderRadius={3}>
                <Avatar sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 'bold' }}>
                  {activeIntern.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight={700} color="#1e293b">{activeIntern.name}</Typography>
                  <Box display="flex" gap={1} mt={0.5}>
                    <Chip size="small" label={activeIntern.department} sx={{ fontSize: '0.7rem', height: 20 }} />
                    <Chip size="small" icon={<TrendingUpIcon fontSize="small"/>} label="Positive Trajectory" color="success" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flexGrow: 1, minHeight: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeIntern.performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="test" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" name="Test Score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceMatrix;