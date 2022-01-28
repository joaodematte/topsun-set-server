module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["src/app/model/**/*.ts"],
  migrations: ["src/database/migration/**/*.ts"],
  cli: {
    migrationsDir: "src/database/migration",
  },
};
