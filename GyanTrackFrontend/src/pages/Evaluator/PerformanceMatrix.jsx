import { useState, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Paper, Select, MenuItem, FormControl, InputLabel,
  Avatar, Chip, IconButton, Tooltip as MuiTooltip
} from "@mui/material";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const mockDepartmentInterns = [
  { name: "Alex Rivendell", react: 85, node: 70, db: 90, avg: 81.6 },
  { name: "Samira Ahmed", react: 95, node: 85, db: 80, avg: 86.6 },
  { name: "Jordan Lee", react: 65, node: 80, db: 75, avg: 73.3 },
  { name: "Casey Smith", react: 88, node: 92, db: 85, avg: 88.3 }
];

const mockTimelineData = [
  { week: "Week 1", avgScore: 68 },
  { week: "Week 2", avgScore: 74 },
  { week: "Week 3", avgScore: 79 },
  { week: "Week 4", avgScore: 82 }
];

const PerformanceMatrix = () => {
  const [selectedIntern, setSelectedIntern] = useState("All");

  const radarData = useMemo(() => {
    if (selectedIntern === "All") {
      // Calculate averages across all interns
      const avgReact = mockDepartmentInterns.reduce((acc, curr) => acc + curr.react, 0) / mockDepartmentInterns.length;
      const avgNode = mockDepartmentInterns.reduce((acc, curr) => acc + curr.node, 0) / mockDepartmentInterns.length;
      const avgDb = mockDepartmentInterns.reduce((acc, curr) => acc + curr.db, 0) / mockDepartmentInterns.length;
      
      return [
        { subject: 'React.js', score: avgReact, fullMark: 100 },
        { subject: 'Node.js', score: avgNode, fullMark: 100 },
        { subject: 'Databases', score: avgDb, fullMark: 100 },
        { subject: 'Communication', score: 85, fullMark: 100 },
        { subject: 'Problem Solving', score: 78, fullMark: 100 }
      ];
    } else {
      const intern = mockDepartmentInterns.find(i => i.name === selectedIntern);
      return [
        { subject: 'React.js', score: intern.react, fullMark: 100 },
        { subject: 'Node.js', score: intern.node, fullMark: 100 },
        { subject: 'Databases', score: intern.db, fullMark: 100 },
        { subject: 'Communication', score: 88, fullMark: 100 }, // Mock
        { subject: 'Problem Solving', score: 90, fullMark: 100 } // Mock
      ];
    }
  }, [selectedIntern]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-in-out" }}>
      <Typography variant="h4" fontWeight={800} color="#1e293b" mb={1}>
        Department Metrics
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Analyze score averages and skill distributions for the interns in your department.
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 4, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <InsertChartIcon sx={{ color: '#64748b' }} />
          <Typography fontWeight={600} color="#334155">Focus View</Typography>
        </Box>
        
        <FormControl size="small" sx={{ minWidth: 250, bgcolor: 'white' }}>
          <InputLabel>Select Intern to Analyze</InputLabel>
          <Select value={selectedIntern} onChange={(e) => setSelectedIntern(e.target.value)} label="Select Intern to Analyze">
            <MenuItem value="All">Overall Department Average</MenuItem>
            {mockDepartmentInterns.map(i => <MenuItem key={i.name} value={i.name}>{i.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>

      <Grid container spacing={4}>
        {/* Intern Leaderboard / Bar Chart */}
        <Grid item xs={12} lg={7}>
          <Card elevation={2} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                  Intern Overall Rankings
                </Typography>
                <Chip icon={<TrendingUpIcon />} label="Top: Samira Ahmed" color="success" size="small" variant="outlined" />
              </Box>
              
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockDepartmentInterns} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: '#475569', fontWeight: 600, fontSize: 13 }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="avg" name="Overall Avg Score" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Radar Chart */}
        <Grid item xs={12} lg={5}>
          <Card elevation={2} sx={{ borderRadius: 4, height: "100%", display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#1e293b" mb={1}>
                Skill Distribution Radar
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {selectedIntern === "All" ? "Aggregated department competencies." : `${selectedIntern}'s individual skill strengths.`}
              </Typography>

              <Box sx={{ height: 320, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={selectedIntern === "All" ? "Dept Average" : selectedIntern} dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Department Timeline */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} color="#1e293b" mb={3}>
                Department Progress Timeline
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTimelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} domain={['auto', 'auto']} tick={{ fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                    <Line type="monotone" dataKey="avgScore" name="Dept Average Test Score" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 8 }} />
                  </LineChart>
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