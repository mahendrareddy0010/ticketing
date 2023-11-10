import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
require("dotenv").config();

const start = async () => {
  console.log("Satrting the orders service....");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY : env variable is not defined");
  }
  if (!process.env.ORDERS_SRV_MONGO_URI) {
    throw new Error("ORDERS_SRV_MONGO_URI : env varianle is not defined");
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

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.ORDERS_SRV_MONGO_URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }

  app.listen(4020, () => {
    console.log("Orders : Listening  on 4020 !!!");
  });
};

start();
