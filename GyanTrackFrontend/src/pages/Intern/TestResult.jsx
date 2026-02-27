import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const TestResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for test result
  const testData = {
    title: "Object-Oriented Programming Assessment",
    date: "2024-02-20",
    timeTaken: "45 mins",
    evaluator: "Dr. Smith",
    score: 85,
    totalMarks: 100,
    totalQuestions: 50,
    correctAnswers: 34,
    incorrectAnswers: 6,
    unattempted: 10,
    status: "Excellent",
    accuracy: 85,
  };

  const pieData = [
    { name: "Correct", value: testData.correctAnswers, color: "#10b981" },
    { name: "Incorrect", value: testData.incorrectAnswers, color: "#ef4444" },
    { name: "Unattempted", value: testData.unattempted, color: "#cbd5e1" },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", animation: "fadeIn 0.5s ease-in-out" }}>
        
        {/* Header Section */}
        <Box display="flex" alignItems="center" mb={4}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/intern')}
            sx={{ color: "#64748b", mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h5" fontWeight={800} color="#0f172a">
            Detailed Test Result
          </Typography>
        </Box>

        {/* Top Banner Scorecard */}
        <Card 
          elevation={4} 
          sx={{ 
            borderRadius: 4, 
            background: "linear-gradient(135deg, #023047 0%, #219ebc 100%)",
            color: "white",
            mb: 4,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Box sx={{ position: "absolute", top: -50, right: -50, opacity: 0.1 }}>
            <EmojiEventsIcon sx={{ fontSize: 300 }} />
          </Box>
          <CardContent sx={{ p: { xs: 4, md: 6 }, position: "relative", zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Chip 
                  label={testData.status} 
                  sx={{ 
                    backgroundColor: "rgba(255,255,255,0.2)", 
                    color: "white", 
                    fontWeight: 600, 
                    mb: 2 
                  }} 
                />
                <Typography variant="h3" fontWeight={800} mb={1}>
                  {testData.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Evaluated by {testData.evaluator} on {testData.date}
                </Typography>
                
                <Box display="flex" gap={4} mt={4}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Time Taken</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="h6" fontWeight={600}>{testData.timeTaken}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Questions</Typography>
                    <Typography variant="h6" fontWeight={600} mt={0.5}>{testData.totalQuestions}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4} display="flex" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                <Box textAlign="center">
                  <Typography variant="h1" fontWeight={800}>
                    {testData.score}<Typography component="span" variant="h4" sx={{ opacity: 0.8 }}>/{testData.totalMarks}</Typography>
                  </Typography>
                  <Typography variant="h6" fontWeight={500} sx={{ opacity: 0.9 }}>
                    Final Score
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <Grid container spacing={4}>
          
          {/* Left Column: Breakdown */}
          <Grid item xs={12} md={12} lg={7}>
            <Card elevation={2} sx={{ borderRadius: 4, height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} color="#1e293b" mb={3}>
                  Performance Breakdown
                </Typography>

                <Box mb={4}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography fontWeight={600} color="#334155">Accuracy</Typography>
                    <Typography fontWeight={700} color="#3b82f6">{testData.accuracy}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={testData.accuracy} 
                    sx={{ height: 10, borderRadius: 5, backgroundColor: "#e2e8f0", "& .MuiLinearProgress-bar": { backgroundColor: "#3b82f6" } }}
                  />
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={0} sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 3, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <CheckCircleIcon sx={{ color: "#10b981", fontSize: 40, mb: 1, mx: "auto" }} />
                      <Typography variant="h4" fontWeight={800} color="#065f46">{testData.correctAnswers}</Typography>
                      <Typography variant="body2" fontWeight={600} color="#059669">Correct</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={0} sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 3, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <CancelIcon sx={{ color: "#ef4444", fontSize: 40, mb: 1, mx: "auto" }} />
                      <Typography variant="h4" fontWeight={800} color="#991b1b">{testData.incorrectAnswers}</Typography>
                      <Typography variant="body2" fontWeight={600} color="#b91c1c">Incorrect</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <Card elevation={0} sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 3, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: '3px dashed #cbd5e1', mx: 'auto', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Typography color="#94a3b8" fontWeight="bold">-</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight={800} color="#475569">{testData.unattempted}</Typography>
                      <Typography variant="body2" fontWeight={600} color="#64748b">Skipped</Typography>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Chart */}
          <Grid item xs={12} md={12} lg={5}>
            <Card elevation={2} sx={{ borderRadius: 4, height: "100%" }}>
              <CardContent sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" fontWeight={700} color="#1e293b" mb={1}>
                  Attempt Analysis
                </Typography>
                
                <Box sx={{ flex: 1, minHeight: 300, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Box>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default TestResult;
