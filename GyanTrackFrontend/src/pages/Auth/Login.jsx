import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const userData = response.data;

      // userData should contain { token, userId, email, role, fullName }
      login(userData);

      // Navigate based on role (Admin -> /hr, Evaluator -> /evaluator, Intern -> /intern)
      let rolePath = userData.role.toLowerCase();
      if (rolePath === "admin") rolePath = "hr"; // Frontend uses /hr mapping for Admin

      navigate(`/${rolePath}`);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #023047, #219ebc)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated Background Blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          background: "rgba(33, 158, 188, 0.4)",
          filter: "blur(120px)",
          borderRadius: "50%",
          top: -100,
          left: -100,
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          background: "rgba(142, 202, 230, 0.3)",
          filter: "blur(150px)",
          borderRadius: "50%",
          bottom: -150,
          right: -150,
          animation: `${float} 8s ease-in-out infinite`,
        }}
      />

      {/* Glass Card */}
      <Paper
        elevation={0}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,
          backdropFilter: "blur(25px)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          animation: `${fadeIn} 1s ease`,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/logo.png"
          alt="GyanTrack Logo"
          sx={{
            width: 90,
            mb: 2,
          }}
        />

        <Typography
          variant="h5"
          fontWeight="bold"
          color="white"
          gutterBottom
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.6)", mb: 3 }}
        >
          Sign in to continue to GyanTrack
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2, background: 'rgba(255,0,0,0.1)', p: 1, borderRadius: 1 }}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          sx={{
            mb: 2,
            input: { color: "white" },
            label: { color: "rgba(255,255,255,0.6)" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#8ecae6",
              },
            },
          }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          sx={{
            mb: 3,
            input: { color: "white" },
            label: { color: "rgba(255,255,255,0.6)" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#8ecae6",
              },
            },
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            py: 1.3,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #219ebc, #8ecae6)",
            "&:hover": {
              background: hovered ?
                "linear-gradient(90deg, #023047, #219ebc)" :
                "linear-gradient(90deg, #219ebc, #8ecae6)",
            },
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;