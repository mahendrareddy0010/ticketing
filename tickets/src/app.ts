import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { currentUser, errorHandler, NotFoundError } from "@ymrticketing/common";
import { createTicketRouter } from "./routes/new";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(currentUser);

app.use(createTicketRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
