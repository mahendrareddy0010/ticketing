import { Listener, Subjects, TicketCreatedEvent } from "@ymrticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = Ticket.build({
      id,
      title,
      price
    });

    try {
      await ticket.save();
    } catch (err) {
      console.log(err);
    }

    msg.ack();
  }
}
