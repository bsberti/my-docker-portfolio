import db from "./db";

async function migrate() {
  const exists = await db.schema.hasTable("projects");
  if (!exists) {
    await db.schema.createTable("projects", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.json("tech").notNullable(); // Usando json no Postgres
    });
    console.log("Tabela 'projects' criada.");
  }
  process.exit(0);
}

migrate();
