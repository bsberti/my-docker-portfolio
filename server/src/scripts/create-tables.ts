import db from "./db";

async function migrate() {
  // Remove tabelas se existirem (ordem importa por causa de dependências)
  const hasProjects = await db.schema.hasTable("projects");
  if (hasProjects) {
    await db.schema.dropTable("projects");
    console.log("'projects' table dropped.");
  }

  const hasUsers = await db.schema.hasTable("users");
  if (hasUsers) {
    await db.schema.dropTable("users");
    console.log("'users' table dropped.");
  }

  // Cria tabela de usuários
  await db.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("password").notNullable(); // Armazena hash da senha
    table.timestamps(true, true);
  });
  console.log("'users' table created.");

  // Cria tabela de projetos
  await db.schema.createTable("projects", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.json("tech").notNullable(); // Usando JSON no Postgres
    table.integer("year");
    table.string("image1");
    table.string("image2");
    table.string("image3");
  });
  console.log("'projects' table created.");

  process.exit(0);
}

migrate();
