module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/app/model/*{.ts,.js}"],
  migrations: ["dist/database/migration/*{.ts,.js}"],
  cli: {
    migrationsDir: "dist/database/migration",
  },
};
