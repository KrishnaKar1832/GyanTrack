import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { internService } from "../../services/internService";

const LiveTest = () => {
  const navigate = useNavigate();
  const [liveTests, setLiveTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await internService.getLiveTests();
        setLiveTests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch live tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLive();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (liveTests.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8} gap={2}>
        <Typography variant="h6" color="text.secondary">
          No live tests available right now.
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/intern")}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const test = liveTests[0];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8} gap={3}>
      <Typography variant="h5" fontWeight={700}>
        {test.title || `Test #${test.testId}`} is live!
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<PlayArrowIcon />}
        onClick={() => navigate(`/intern/test/${test.testId}`)}
        sx={{ px: 5, py: 1.5, fontWeight: 700, borderRadius: 3 }}
      >
        Start Test
      </Button>
    </Box>
  );
};

export default LiveTest;