// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import db from "./scripts/db";  // sua conexão Knex
import bcrypt from "bcryptjs"; // Usando bcryptjs
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/auth";
import multer from "multer";
import path from "path";

dotenv.config(); // Carrega variáveis do .env

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Define onde e como salvar os arquivos
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "public/uploads")); // pasta pública para imagens
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

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

// Rota POST para criar projeto com upload múltiplo
app.post(
  "/api/projects",
  authenticateToken,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const { name, tech, year } = req.body;
      if (!name || !tech) {
        return res.status(400).json({ message: "Missing name or tech" });
      }

      // tech chega como string JSON (pois multipart/form-data), parseia
      const techArray = typeof tech === "string" ? JSON.parse(tech) : tech;

      // Imagens salvas via multer
      const images = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // Monta URLs públicas das imagens
      const image1 = images?.image1 ? images.image1[0].filename : null;
      const image2 = images?.image2 ? images.image2[0].filename : null;
      const image3 = images?.image3 ? images.image3[0].filename : null;

      await db("projects").insert({
        name,
        tech: JSON.stringify(techArray),
        year: year ? Number(year) : null,
        image1,
        image2,
        image3,
      });

      res.status(201).json({ message: "Project created with images" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get('/', (_req: Request, res: Response) => {
  res.send('API running! Use /api/projects to see projects.');
});

app.get("/api/projects", async (_req: Request, res: Response) => {
  try {
    const projects = await db("projects").select("*");

    const parsedProjects = projects.map((p) => ({
      id: p.id,
      name: p.name,
      tech: typeof p.tech === "string" ? JSON.parse(p.tech) : p.tech,
      year: p.year,
      image1: p.image1,
      image2: p.image2,
      image3: p.image3,
    }));

    res.json(parsedProjects);
  } catch (error) {
    console.error("Error when searching for projects:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`API rodando em http://localhost:${PORT}`));
