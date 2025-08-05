// src/pages/AdminPage.tsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  Stack
} from "@mui/material";

const AdminPage: React.FC = () => {
  const [name, setName] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techList, setTechList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddTech = () => {
    if (techInput.trim() && !techList.includes(techInput.trim())) {
      setTechList([...techList, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechList(techList.filter(t => t !== tech));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, tech: techList }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      setSuccess("Project added sucessfully!");
      setName("");
      setTechList([]);
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Add Project</Typography>

      <TextField
        fullWidth
        label="Project Name"
        variant="outlined"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          label="Technology"
          variant="outlined"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTech()}
        />
        <Button variant="contained" onClick={handleAddTech}>
          Adicionar
        </Button>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
        {techList.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            onDelete={() => handleRemoveTech(tech)}
            color="primary"
          />
        ))}
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          disabled={loading || !name || techList.length === 0}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Save Project"}
        </Button>
      </Box>

      {success && <Typography color="green" sx={{ mt: 2 }}>{success}</Typography>}
      {error && <Typography color="red" sx={{ mt: 2 }}>{error}</Typography>}
    </Container>
  );
};

export default AdminPage;
