import db from "./db";

async function seed() {
  await db("projects").insert([
    {
      name: "Projeto 1",
      tech: JSON.stringify(["React", "Node"]),
    },
    {
      name: "Projeto 2",
      tech: JSON.stringify(["TypeScript", "Express", "Docker"]),
    },
  ]);

  console.log("Dados inseridos.");
  process.exit(0);
}

seed();
