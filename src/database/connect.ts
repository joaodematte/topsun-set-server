import { createConnection } from "typeorm";

createConnection().then(() => console.log("📦 conectado com o banco de dados"));
