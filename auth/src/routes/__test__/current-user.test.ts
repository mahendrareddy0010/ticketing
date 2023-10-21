import request from "supertest";
import { app } from "../../app";

it("no user present", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});

it("get details of current user", async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});
