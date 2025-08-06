// src/pages/AuthPage.tsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface AuthPageProps {
  onLogin?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    setError(null);
    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Aqui está o token
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Unknown error");

      localStorage.setItem("token", data.token);
      onLogin?.();
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isLogin ? "Login" : "Register"}
        </Typography>

        <TextField
            label="Username"
            fullWidth
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />

        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          {isLogin ? "Login" : "Create Account"}
        </Button>

        <Button
          sx={{ mt: 1 }}
          fullWidth
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage;
