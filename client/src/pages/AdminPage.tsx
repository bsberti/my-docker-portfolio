import React, { useState, ChangeEvent } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";

const AdminPage: React.FC = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [techInput, setTechInput] = useState("");
  const [techList, setTechList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Imagens e previews
  const [images, setImages] = useState<{ [key: string]: File | null }>({
    image1: null,
    image2: null,
    image3: null,
  });
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const handleAddTech = () => {
    if (techInput.trim() && !techList.includes(techInput.trim())) {
      setTechList([...techList, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechList(techList.filter((t) => t !== tech));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setImages((prev) => ({ ...prev, [key]: file }));

    // preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({ ...prev, [key]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add a project.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("year", year ? year.toString() : "");
      formData.append("tech", JSON.stringify(techList));

      if (images.image1) formData.append("image1", images.image1);
      if (images.image2) formData.append("image2", images.image2);
      if (images.image3) formData.append("image3", images.image3);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create project");

      setSuccess("Project added successfully!");
      setName("");
      setYear("");
      setTechList([]);
      setImages({ image1: null, image2: null, image3: null });
      setPreviews({});
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Project
      </Typography>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          fullWidth
          label="Project Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
      
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          fullWidth
          label="Year"
          type="number"
          variant="outlined"
          margin="normal"
          value={year}
          onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          label="Technology"
          variant="outlined"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTech()}
        />
        <Button variant="contained" onClick={handleAddTech}>
          Add
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

      {/* Upload de imagens */}
      <Box sx={{ mt: 3 }}>
        {["image1", "image2", "image3"].map((key) => (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography>{key.toUpperCase()}</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, key)}
            />
            {previews[key] && (
              <Box
                component="img"
                src={previews[key]}
                alt={`${key} preview`}
                sx={{ mt: 1, maxWidth: "100%", maxHeight: 200, borderRadius: 2 }}
              />
            )}
          </Box>
        ))}
      </Box>

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

      {success && (
        <Typography color="green" sx={{ mt: 2 }}>
          {success}
        </Typography>
      )}
      {error && (
        <Typography color="red" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default AdminPage;
