// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import db from "./scripts/db";  // sua conexão Knex
import bcrypt from "bcryptjs"; // Usando bcryptjs
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/auth";

dotenv.config(); // Carrega variáveis do .env

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

// POST /api/register
app.post("/api/register", async (req: Request, res: Response) => {
  console.log("BODY RECEBIDO:", req.body);
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    const existingUser = await db("users").where({ username }).first();
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db("users").insert({ username, password: hashedPassword });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/login
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    const user = await db("users").where({ username }).first();
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/projects", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, tech } = req.body;

    if (!name || !Array.isArray(tech)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    await db("projects").insert({
      name,
      tech: JSON.stringify(tech),
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
