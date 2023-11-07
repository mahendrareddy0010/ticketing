import { randomBytes } from "crypto";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
require("dotenv").config();

const start = async () => {
  if (
    !process.env.CLUSTER_ID ||
    !process.env.NATS_URL ||
    !process.env.REDIS_HOST
  ) {
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
  } catch (err) {
    console.log(err);
  }
};

start();
