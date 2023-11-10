import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { currentUser, errorHandler, NotFoundError } from "@ymrticketing/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(currentUser);

app.use(createChargeRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
