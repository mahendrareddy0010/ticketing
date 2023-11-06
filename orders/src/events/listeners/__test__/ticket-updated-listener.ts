import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@ymrticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Topology",
    price: 5,
  });

  await ticket.save();

  // create instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: ticket.id,
    version: 0,
    title: "Topology",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message obj
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("create and save a ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.price).toEqual(data.price);
  expect(ticket?.version).toEqual(1);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  expect(msg.ack).toHaveBeenCalled();
});

it("should not do ack", async () => {
  const { listener, data, msg } = await setup();
  data.id = new mongoose.Types.ObjectId().toHexString();

  // call the onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  expect(msg.ack).toHaveBeenCalled();
});
