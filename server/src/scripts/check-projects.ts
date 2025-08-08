import db from "./db";

(async () => {
  const projects = await db('projects').select('*');
  console.log('Total de projetos encontrados:', projects.length);
  console.log(projects);
  process.exit(0);
})();