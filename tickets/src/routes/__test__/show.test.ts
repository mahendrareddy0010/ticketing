import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns 401 if the user is not signed in", async () => {
  await request(app).get("/api/tickets/hgfjhgfjjhsbxzx").send().expect(401);
});

it("returns 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send();

  expect(response.status).toEqual(404);
});

it("returns ticket if the ticket is found", async () => {
  const title = "Topology seminar";
  const price = 10;
  const { body } = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${body.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price.toString());
});
