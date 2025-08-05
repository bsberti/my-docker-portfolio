import db from "./db";

async function seed() {
  await db("projects").insert([
    {
      name: "Project 1: Portfolio Website",
      tech: JSON.stringify(["React", "Node"]),
    },
    {
      name: "Project 2: E-commerce App",
      tech: JSON.stringify(["TypeScript", "Express", "Docker"]),
    },
  ]);

  console.log("Data entered.");
  process.exit(0);
}

seed();
