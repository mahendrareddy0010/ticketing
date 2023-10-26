import { Publisher } from "@ymrticketing/common";
import { Subjects } from "@ymrticketing/common";
import { TicketCreatedEvent } from "@ymrticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
