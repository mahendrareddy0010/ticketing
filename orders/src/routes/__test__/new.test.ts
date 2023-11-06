import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("invalid ticketId", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticketId });

  expect(response.status).toEqual(400);
});

it("ticketId is already reserved", async () => {
  const ticket = Ticket.build({
    title: "Topology",
    price: 10,
  });
  await ticket.save();
  const order = Order.build({
    userId: "abc",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id });

  expect(response.status).toEqual(400);
});

it("Order Successful", async () => {
  const ticket = Ticket.build({
    title: "Topology",
    price: 10,
  });
  await ticket.save();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id });

  expect(response.status).toEqual(201);
});

// it("publishes an event", async () => {
//   const ticket = Ticket.build({
//     title: "Topology",
//     price: 10,
//   });
//   await ticket.save();
//   await request(app)
//     .post("/api/orders")
//     .set("Cookie", global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
