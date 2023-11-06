import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "Topology",
    price: 10,
  });

  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  // create three tickets
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  const userOne = global.signin({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test1@test.com",
  });
  const userTwo = global.signin({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test2@test.com",
  });
  // create one order as user #1
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create two orders for user #2
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  //   // Make request to get orders for user #2

  const { body } = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send();

  // Make sure we only got the orders for user #2
  expect(body.length).toEqual(2);
  expect(body[0].id).toEqual(orderTwo.id);
  expect(body[1].id).toEqual(orderThree.id);
  expect(body[0].ticket.id).toEqual(ticketTwo.id);
  expect(body[1].ticket.id).toEqual(ticketThree.id);
});
