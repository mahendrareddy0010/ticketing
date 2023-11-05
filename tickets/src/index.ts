import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
require("dotenv").config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY : env variable is not defined");
  }
  if (!process.env.TICKETS_SRV_MONGO_URI) {
    throw new Error("TICKETS_SRV_MONGO_URI : env varianle is not defined");
  }
  if (!process.env.CLUSTER_ID || !process.env.NATS_URL) {
    throw new Error("some env varaibles are not defined");
  }
  try {
    await natsWrapper.connect(
      process.env.CLUSTER_ID,
      randomBytes(4).toString("hex"),
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.TICKETS_SRV_MONGO_URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }

  app.listen(4010, () => {
    console.log("Tickets : Listening  on 4010 !!!");
  });
};

start();
