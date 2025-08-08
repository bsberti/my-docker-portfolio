import db from "./db";

async function seed() {
  await db("projects").insert([
    {
      name: "Project 1: Portfolio Website",
      tech: JSON.stringify(["React", "Node"]),
      year: 2024,
      image1: "portfolio1.png",
      image2: "portfolio2.png",
      image3: "portfolio3.png",
    },
    {
      name: "Project 2: E-commerce App",
      tech: JSON.stringify(["TypeScript", "Express", "Docker"]),
      year: 2023,
      image1: "ecommerce1.png",
      image2: "ecommerce2.png",
      image3: "ecommerce3.png",
    },
  ]);

  console.log("Seed data inserted into 'projects' table.");
  process.exit(0);
}

seed();
