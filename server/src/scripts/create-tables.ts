import db from "./db";

async function migrate() {
  // Cria tabela de projetos, se não existir
  const hasProjects  = await db.schema.hasTable("projects");
  if (!hasProjects ) {
    await db.schema.createTable("projects", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.json("tech").notNullable(); // Usando json no Postgres
    });
    console.log("'projects' table created.");
  }

  // Cria tabela de usuários, se não existir
  const hasUsers = await db.schema.hasTable("users");
  if (!hasUsers) {
    await db.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username").notNullable().unique();
      table.string("password").notNullable(); // Armazenará hash da senha
      table.timestamps(true, true);
    });
    console.log("'users' table created.");
  }
  
  process.exit(0);
}

migrate();
