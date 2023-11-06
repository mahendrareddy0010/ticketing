import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("unauthorized user", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Topology",
    price: 10,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin({ id: "123", email: "kjhflklk@kjhk.com" }))
    .send()
    .expect(401);
});

it("deletes/cancelled orders for a particular user", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Topology",
    price: 10,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(204);
});

it("publishes an order-cancelled event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Topology",
    price: 10,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
