module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/app/model/**/*.ts"],
  migrations: ["dist/database/migration/**/*.ts"],
  cli: {
    migrationsDir: "dist/database/migration",
  },
};
