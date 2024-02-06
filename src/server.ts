import "reflect-metadata";
import express from "express";
import cors from "cors";

import "./database/connect";
import router from "./routes";

const app = express();

app.use(express.json());

app.use(cors({
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE', 'OPTIONS'],
    origin: true
}));

app.use(router);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(
    `🚀 servidor iniciado em https://topsun-backend.herokuapp.com:${port}`
  );
});
