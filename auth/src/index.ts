import mongoose from "mongoose";
import { app } from "./app";
require('dotenv').config()

const start = async () => {
  console.log('Staring up...')
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY : env variable is not defined");
  }
  try {
    await mongoose.connect("mongodb+srv://<username>:<password>@cluster0.s2kukqx.mongodb.net/?retryWrites=true&w=majority");
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }

  app.listen(4000, () => {
    console.log("Auth : Listening  on 4000 !!!");
  });
};

start();
