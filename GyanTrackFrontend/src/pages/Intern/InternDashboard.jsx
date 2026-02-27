import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

const InternDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: "100%",
        }}
      >
        {/* LEFT SECTION */}
        <Box
          sx={{
            flex: { md: "0 0 280px" }, // fixed min width
            width: { xs: "100%", md: 280 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Profile */}
          <Card 
            sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} 
            onClick={() => navigate('/intern/profile')}
          >
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Profile
              </Typography>

              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    background:
                      "linear-gradient(135deg, #219ebc, #8ecae6)",
                  }}
                >
                  HM
                </Avatar>

                <Box ml={2}>
                  <Typography fontWeight={600}>
                    Harish Mahto
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    INT-2026-1547
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Live Test */}
          <Card
            sx={{
              background:
                "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography fontWeight={600}>
                Live Test Available
              </Typography>

              <Typography variant="body2" mt={1}>
                React Assessment
              </Typography>

              <Button
                fullWidth
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate('/intern/test/1')}
                sx={{
                  mt: 2,
                  backgroundColor: "white",
                  color: "#2563eb",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#f8fafc" }
                }}
              >
                Start
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={700} color="#1e293b" mb={2}>
                Upcoming Assessments
              </Typography>

              {[
                { 
                  name: ".NET Test", 
                  subject: ".NET", 
                  marks: 50, 
                  evaluator: "Akanshaya", 
                  date: "2026-02-28", 
                  time: "10:00 AM" 
                },
                { 
                  name: "React Test", 
                  subject: "React", 
                  marks: 100, 
                  evaluator: "Arpitam", 
                  date: "2026-03-05", 
                  time: "02:00 PM" 
                },
                { 
                  name: "SQL Test", 
                  subject: "SQL", 
                  marks: 75, 
                  evaluator: "Rohit", 
                  date: "2026-03-10", 
                  time: "11:30 AM" 
                },
              ].map((test, index) => (
                <Accordion 
                  key={index} 
                  elevation={0}
                  disableGutters
                  sx={{
                    mb: 1.5,
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px !important",
                    "&:before": { display: "none" },
                    overflow: "hidden",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": { borderColor: "#cbd5e1", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#64748b" }} />}
                    sx={{
                      backgroundColor: "#f8fafc",
                      "&.Mui-expanded": { minHeight: 48, backgroundColor: "#f1f5f9" },
                      ".MuiAccordionSummary-content.Mui-expanded": { margin: "12px 0" }
                    }}
                  >
                    <Typography fontWeight={600} color="#334155" fontSize="0.95rem">
                      {test.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 2, pb: 2 }}>
                    <Grid container columnSpacing={2} rowSpacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">Subject</Typography>
                        <Typography variant="body2" fontWeight={500} color="#0f172a">{test.subject}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">Evaluator</Typography>
                        <Typography variant="body2" fontWeight={500} color="#0f172a">{test.evaluator}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">Date & Time</Typography>
                        <Typography variant="body2" fontWeight={500} color="#0f172a">{test.date} at {test.time}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">Total Marks</Typography>
                        <Typography variant="body2" fontWeight={500} color="#0f172a">{test.marks} Points</Typography>
                      </Grid>
                    </Grid>
                    
                    <Box mt={2.5}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<NotificationsActiveIcon />}
                        sx={{ 
                          borderRadius: 2, 
                          color: "#2563eb",
                          borderColor: "#bfdbfe",
                          fontWeight: 600,
                          "&:hover": { borderColor: "#2563eb", backgroundColor: "#eff6ff" }
                        }}
                      >
                        Notify Me
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* RIGHT SECTION */}
        <Box
          sx={{
            flex: 1, // THIS makes it expand fully
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Performance Matrix */}
          <Card 
            elevation={3}
            sx={{ 
              width: "100%", 
              cursor: 'pointer', 
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              '&:hover': { transform: "translateY(-4px)", boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)" } 
            }}
            onClick={() => navigate('/intern/performance')}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ background: "linear-gradient(90deg, #219ebc, #8ecae6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Performance Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Your learning analytics and growth metrics
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed" }}>
                  <PlayArrowIcon />
                </Avatar>
              </Box>

              <Grid container spacing={3}>
                {[
                  { title: "Average Score", value: "81.6%", trend: "+2.4%", trendColor: "#10b981", icon: "📈" },
                  { title: "Growth Rate", value: "+30%", trend: "Accelerating", trendColor: "#3b82f6", icon: "🚀" },
                  { title: "Assessments", value: "5", trend: "+1 this week", trendColor: "#64748b", icon: "📝" },
                ].map((item, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: i === 1 ? "#eff6ff" : "#f8fafc",
                        border: "1px solid",
                        borderColor: i === 1 ? "#bfdbfe" : "#e2e8f0",
                        borderRadius: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "background-color 0.2s ease",
                        "&:hover": { backgroundColor: i === 1 ? "#dbeafe" : "#f1f5f9" }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="body2" fontWeight={600} color="#64748b">
                          {item.title}
                        </Typography>
                        <Typography fontSize="1.25rem">{item.icon}</Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          color={i === 1 ? "#1d4ed8" : "#0f172a"}
                          mb={0.5}
                        >
                          {item.value}
                        </Typography>
                        <Typography variant="caption" fontWeight={600} sx={{ color: item.trendColor }}>
                          {item.trend}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Previous Tests */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={700} color="#1e293b" mb={2}>
                Recent Evaluation Reports
              </Typography>

              {[
                { 
                  name: "Object-Oriented Programming", 
                  date: "2026-02-20", 
                  score: 85, 
                  total: 100, 
                  correct: 34, 
                  incorrect: 6, 
                  status: "Excellent" 
                },
                { 
                  name: "Web Development Basics", 
                  date: "2026-02-15", 
                  score: 92, 
                  total: 100, 
                  correct: 46, 
                  incorrect: 4, 
                  status: "Outstanding" 
                },
                { 
                  name: "Operating Systems", 
                  date: "2026-02-10", 
                  score: 72, 
                  total: 100, 
                  correct: 36, 
                  incorrect: 14, 
                  status: "Good" 
                },
              ].map((test, index) => {
                const pieData = [
                  { name: "Correct", value: test.correct, color: "#10b981" },
                  { name: "Incorrect", value: test.incorrect, color: "#ef4444" },
                ];
                
                return (
                  <Accordion 
                    key={index} 
                    elevation={0}
                    disableGutters
                    sx={{
                      mb: 1.5,
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#cbd5e1" }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#64748b" }} />}
                      sx={{
                        backgroundColor: "#f8fafc",
                        "&.Mui-expanded": { minHeight: 48, backgroundColor: "white", borderBottom: "1px solid #f1f5f9" },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" pr={2}>
                        <Typography fontWeight={600} color="#334155" fontSize="0.95rem">
                          {test.name}
                        </Typography>
                        <Chip 
                          label={`${test.score}%`} 
                          size="small" 
                          sx={{ 
                            fontWeight: 700, 
                            backgroundColor: test.score >= 90 ? "#dcfce7" : test.score >= 80 ? "#dbeafe" : "#fef3c7",
                            color: test.score >= 90 ? "#166534" : test.score >= 80 ? "#1e40af" : "#92400e"
                          }} 
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3, backgroundColor: "#fafafa" }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" justifyContent="space-between" pb={1} borderBottom="1px dashed #cbd5e1">
                              <Typography variant="body2" color="text.secondary">Test Date</Typography>
                              <Typography variant="body2" fontWeight={600} color="#334155">{test.date}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" pb={1} borderBottom="1px dashed #cbd5e1">
                              <Typography variant="body2" color="text.secondary">Questions Attempted</Typography>
                              <Typography variant="body2" fontWeight={600} color="#334155">{test.correct + test.incorrect} / 50</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" pb={1} borderBottom="1px dashed #cbd5e1">
                              <Typography variant="body2" color="text.secondary">Evaluator Remarks</Typography>
                              <Typography variant="body2" fontWeight={600} color="#10b981">{test.status}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ height: 160, display: 'flex', justifyContent: 'center' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontWeight: 600 }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </Grid>
                      </Grid>
                      
                      <Box mt={3}>
                        <Button 
                          variant="contained" 
                          fullWidth 
                          disableElevation
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/intern/test-result/${index}`);
                          }}
                          sx={{ 
                            borderRadius: 2, 
                            backgroundColor: "#1e293b",
                            fontWeight: 600,
                            "&:hover": { backgroundColor: "#0f172a" }
                          }}
                        >
                          View Full Result
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default InternDashboard;