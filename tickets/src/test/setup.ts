import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (payload?: { id: string; email: string }) => string[];
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "asfdjhf";
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (
  payload = {
    id: "ishhaklsf",
    email: "test@test.com",
  }
) => {
  // Create the JWT

  const access_token = jwt.sign(payload, process.env.JWT_KEY!);
  // Encode as base64

  // const base64 = Buffer.from(access_token).toString("base64");
  // console.log(base64);

  return [`access_token=${access_token}`];
};
