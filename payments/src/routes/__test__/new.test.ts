import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@ymrticketing/common";

jest.mock("../../stripe");

it("return a 404 when purchasing order not found", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "nlknsd",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("return a 401 when author is not valid", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "hjsdkcaseri",
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "nlknsd",
      orderId: order.id,
    })
    .expect(401);
});

it("return a 400 when order is already cancelled", async () => {
  const userId = "twrpwioieqla;slkdjk";
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 10,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set(
      "Cookie",
      global.signin({
        id: userId,
        email: "test@test.com",
      })
    )
    .send({
      token: "nlknsd",
      orderId: order.id,
    })
    .expect(400);
});

it("return a 201 if success", async () => {
  const userId = "twrpwioieqla;slkdjk";
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set(
      "Cookie",
      global.signin({
        id: userId,
        email: "test@test.com",
      })
    )
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);
});
