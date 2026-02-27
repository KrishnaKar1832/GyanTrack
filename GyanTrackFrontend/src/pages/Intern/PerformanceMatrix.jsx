import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";

const performanceData = [
  { name: "Test 1", subject: "React", score: 65, average: 60, date: "2023-08-01" },
  { name: "Test 2", subject: "JavaScript", score: 78, average: 65, date: "2023-08-15" },
  { name: "Test 3", subject: "CSS", score: 85, average: 70, date: "2023-09-01" },
  { name: "Test 4", subject: "React", score: 90, average: 75, date: "2023-09-15" },
  { name: "Test 5", subject: "JavaScript", score: 95, average: 80, date: "2023-10-01" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={4} sx={{ p: 2, borderRadius: 2, backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #e2e8f0" }}>
        <Typography variant="subtitle2" fontWeight="bold" color="#1e293b" mb={1}>{label}</Typography>
        {payload.map((entry, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: entry.color }} />
            <Typography variant="body2" color="text.secondary">
              {entry.name}: <span style={{ fontWeight: "bold", color: "#334155" }}>{entry.value}%</span>
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

const PerformanceMatrix = () => {
  const [filterSubject, setFilterSubject] = useState("All");
  const [sortBy, setSortBy] = useState("Date");

  const handleFilter = (e) => setFilterSubject(e.target.value);
  const handleSort = (e) => setSortBy(e.target.value);

  const filteredData = useMemo(() => {
    let data = performanceData.filter(d => filterSubject === "All" || d.subject === filterSubject);
    
    if (sortBy === "Score") {
      data.sort((a, b) => b.score - a.score);
    } else if (sortBy === "Date") {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return data;
  }, [filterSubject, sortBy]);

  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", px: { xs: 1, sm: 2, md: 4 }, animation: "fadeIn 0.6s ease-in-out" }}>
        
        {/* Header Header */}
        <Box mb={4} display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
          <Box>
            <Typography variant="h3" fontWeight={800} sx={{ background: "linear-gradient(90deg, #219ebc, #8ecae6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Performance Analytics
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1, fontWeight: 400 }}>
              Deep dive into your assessment scores and growth metrics
            </Typography>
          </Box>
        </Box>

        {/* Filters Card */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterAltIcon sx={{ color: "#64748b", mr: 1 }} />
            <Typography variant="h6" fontWeight={600} color="#334155">Analysis Configuration</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ fontWeight: 600 }}>Filter by Subject</InputLabel>
                <Select 
                  value={filterSubject} 
                  onChange={handleFilter} 
                  label="Filter by Subject"
                  sx={{ borderRadius: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" } }}
                >
                  <MenuItem value="All">All Subjects (Combined)</MenuItem>
                  <MenuItem value="React">React Framework</MenuItem>
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                  <MenuItem value="CSS">CSS Styling</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ fontWeight: 600 }}>Sort Timeline By</InputLabel>
                <Select 
                  value={sortBy} 
                  onChange={handleSort} 
                  label="Sort Timeline By"
                  sx={{ borderRadius: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" } }}
                >
                  <MenuItem value="Date">Chronological (Date)</MenuItem>
                  <MenuItem value="Score">Performance (Score Rank)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Charts Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 4, height: "100%", overflow: "hidden" }}>
              <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", mr: 2 }}><TrendingUpIcon /></Avatar>
                <Typography variant="h6" fontWeight="bold" color="#1e293b">
                  Growth Trajectory
                </Typography>
              </Box>
              <CardContent sx={{ p: 3, pt: 4 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="score" name="Your Score" stroke="#7c3aed" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 8, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 4, height: "100%", overflow: "hidden" }}>
              <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", mr: 2 }}><AssessmentIcon /></Avatar>
                <Typography variant="h6" fontWeight="bold" color="#1e293b">
                  Score vs Benchmarks
                </Typography>
              </Box>
              <CardContent sx={{ p: 3, pt: 4 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip cursor={{fill: '#f8fafc'}}/>} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '20px' }}/>
                    <Bar dataKey="score" name="Your Score" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="average" name="Class Average" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </DashboardLayout>
  );
};

export default PerformanceMatrix;