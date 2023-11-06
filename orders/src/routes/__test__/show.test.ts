import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("unauthorized user", async () => {
  const ticket = Ticket.build({
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
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin({id: '123', email:'kjhflklk@kjhk.com'}))
    .send().expect(401)
});

it("fetches orders for a particular user", async () => {
  const ticket = Ticket.build({
    title: "Topology",
    price: 10,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send();

  expect(body.id).toEqual(order.id);
});
