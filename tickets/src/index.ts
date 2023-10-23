import mongoose from "mongoose";
import { app } from "./app";
require('dotenv').config()

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY : env variable is not defined");
  }
  try {
    await mongoose.connect("mongodb+srv://mahendrareddyyarramreddy:simple123@cluster0.1vhaq24.mongodb.net/?retryWrites=true&w=majority");
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }

  app.listen(4010, () => {
    console.log("Tickets : Listening  on 4010 !!!");
  });
};

start();
