// server/src/index.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors(), express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (_req, res) => {
  res.send('API rodando! Use /api/projects para ver os projetos.');
});

app.get("/api/projects", (_req, res) => {
  return res.json([{ name: "Projeto 1", tech: ["React","Node"] }]);
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
