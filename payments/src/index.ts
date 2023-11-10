import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
require("dotenv").config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY : env variable is not defined");
  }
  if (!process.env.PAYMENTS_SRV_MONGO_URI) {
    throw new Error("PAYMENTS_SRV_MONGO_URI : env varianle is not defined");
  }
  if (!process.env.CLUSTER_ID || !process.env.NATS_URL || !process.env.STRIPE_KEY) {
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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.PAYMENTS_SRV_MONGO_URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }

  app.listen(4030, () => {
    console.log("Payments : Listening  on 4030 !!!");
  });
};

start();
