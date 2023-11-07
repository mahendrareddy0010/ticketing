import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const createTicket = (payload: { id: string; email: string }) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin(payload))
    .send({
      title: "Topology Seminar",
      price: 10,
    });
};
const user1 = { id: "1", email: "test1@test.com" };
const user2 = { id: "2", email: "test2@test.com" };

it("returns 404 if id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "jhgdsj",
      price: 10,
    })
    .expect(404);
});

it("returns 401 if user is not signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "jhgdsj",
      price: 10,
    })
    .expect(401);
});

it("returns 400 if title is invalid", async () => {
  const response = await createTicket(user1);
  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user1))
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user1))
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns 404 if price is invalid", async () => {
  const response = await createTicket(user1);
  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user1))
    .send({
      title: "jjgdfjk",
      price: -10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user1))
    .send({
      title: "hghjgfjsb",
    })
    .expect(400);
});

it("returns 401 if user is not the owner of ticket", async () => {
  const response = await createTicket(user1);
  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user2))
    .send({
      title: "jjgdfjk",
      price: 10,
    })
    .expect(401);
});

it("returns 200 if ticket owner update with correct fields", async () => {
  const response = await createTicket(user1);
  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user1))
    .send({
      title: "jjgdfjk",
      price: 10,
    })
    .expect(200);
  const { body } = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(200);
  expect(body.title).toEqual("jjgdfjk");
  expect(body.price).toEqual("10");
});

it("publishes an event", async () => {
  const response = await createTicket(user1);
  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user1))
    .send({
      title: "jjgdfjk",
      price: 10,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('reject the ticket if Ticket is reserved', async () => {
  const response = await createTicket(user1);
  const id = response.body.id;
  const ticket = await Ticket.findById(id);
  ticket!.set({orderId: '7512873'})
  await ticket?.save()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin(user1))
    .send({
      title: "jjgdfjk",
      price: 10,
    })
    .expect(400);
})