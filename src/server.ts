import "reflect-metadata";
import express from "express";
import cors from "cors";

import "./database/connect";
import router from "./routes";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if ("OPTIONS" == req.method) {
    return res.sendStatus(200);
  } else {
    next();
  }
});

app.use(router);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(
    `🚀 servidor iniciado em https://topsun-backend.herokuapp.com:${port}`
  );
});
