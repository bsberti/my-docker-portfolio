// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import db from "./db";  // sua conexão Knex

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (_req: Request, res: Response) => {
  res.send('API rodando! Use /api/projects para ver os projetos.');
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
    console.error("Erro ao buscar projetos:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
