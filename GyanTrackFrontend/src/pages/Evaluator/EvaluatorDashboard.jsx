import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Icons
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradingIcon from '@mui/icons-material/Grading';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CoPresentIcon from '@mui/icons-material/CoPresent';

// Placeholder Components (will be replaced by actual files later)
import AssignedTemplates from "./AssignedTemplates";
import PendingSubmissions from "./PendingSubmissions";
import PerformanceMatrix from "./PerformanceMatrix";

const EvaluatorDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: "Assigned Templates", icon: <AssignmentTurnedInIcon />, component: <AssignedTemplates /> },
    { label: "Pending Submissions", icon: <GradingIcon />, component: <PendingSubmissions /> },
    { label: "Department Performance", icon: <QueryStatsIcon />, component: <PerformanceMatrix /> },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: "auto", animation: "fadeIn 0.5s ease-in-out" }}>
        
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4} p={2} sx={{ backgroundColor: "white", borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mr: 2, background: "linear-gradient(135deg, #219ebc, #023047)" }}>
            <CoPresentIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#0f172a" sx={{ letterSpacing: "-0.5px" }}>
              Evaluator Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Create exam forms, review intern submissions, and track your department's progress.
            </Typography>
          </Box>
        </Box>

        {/* Main Interface Layout */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            gap: 3,
            alignItems: "flex-start"
          }}
        >
          {/* Sidebar Tabs */}
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 4, 
              width: { xs: "100%", md: 280 }, 
              flexShrink: 0,
              position: { md: "sticky" },
              top: { md: 100 }
            }}
          >
            <Tabs
              orientation={isMobile ? "horizontal" : "vertical"}
              variant="scrollable"
              scrollButtons="auto"
              value={activeTab}
              onChange={handleTabChange}
              sx={{ 
                borderRight: { md: 1 }, 
                borderBottom: { xs: 1, md: 0 }, 
                borderColor: 'divider',
                '& .MuiTabs-indicator': {
                  width: { md: 4, xs: '100%' },
                  borderRadius: '4px 0 0 4px',
                  backgroundColor: "#4f46e5"
                },
                minHeight: { md: 300 }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab 
                  key={index} 
                  icon={tab.icon} 
                  iconPosition="start" 
                  label={tab.label}
                  sx={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                    minHeight: 64,
                    px: 3,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    color: activeTab === index ? "#4f46e5" : "#64748b",
                    transition: "all 0.2s",
                    '&:hover': {
                      backgroundColor: "rgba(79, 70, 229, 0.04)",
                      color: "#4f46e5"
                    },
                    '&.Mui-selected': {
                      color: "#4f46e5",
                      backgroundColor: "rgba(79, 70, 229, 0.08)"
                    }
                  }}
                />
              ))}
            </Tabs>
          </Card>

          {/* Content Area */}
          <Box sx={{ flexGrow: 1, width: "100%", minWidth: 0 }}>
            {tabs[activeTab].component}
          </Box>
        </Box>

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

export default EvaluatorDashboard;