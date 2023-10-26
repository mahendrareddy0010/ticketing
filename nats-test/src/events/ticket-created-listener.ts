import { Message } from "node-nats-streaming";
import { Listener } from "@ymrticketing/common";
import { TicketCreatedEvent } from "@ymrticketing/common";
import { Subjects } from "@ymrticketing/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payment-services";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data : ", data);

    msg.ack();
  }
}
