import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
require("dotenv").config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY : env variable is not defined");
  }
  try {
    await natsWrapper.connect("ticketing", "hfkjhkjsdf", "http://0.0.0.0:4222");
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit();
    })
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(
      "mongodb+srv://mahendrareddyyarramreddy:simple123@cluster0.1vhaq24.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }

  app.listen(4010, () => {
    console.log("Tickets : Listening  on 4010 !!!");
  });
};

start();
