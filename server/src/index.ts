// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import db from "./scripts/db";  // sua conexão Knex

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

app.post("/api/projects", async (req: Request, res: Response) => {
  try {
    const { name, tech } = req.body;

    if (!name || !Array.isArray(tech)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    await db("projects").insert({
      name,
      tech: JSON.stringify(tech), // armazena como string JSON
    });

    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error("Error creating project:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Internal error when saving project" });
  }
});

app.get('/', (_req: Request, res: Response) => {
  res.send('API running! Use /api/projects to see projects.');
});

app.get("/api/projects", async (_req: Request, res: Response) => {
  try {
    const projects = await db("projects").select("name", "tech");

    // Se tech estiver como string JSON, faça parse:
    const parsedProjects = projects.map(p => ({
      ...p,
      tech: typeof p.tech === "string" ? JSON.parse(p.tech) : p.tech,
    }));

    res.json(parsedProjects);
  } catch (error) {
    console.error("Error when searching for projects:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`API rodando em http://localhost:${PORT}`));
