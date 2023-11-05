import { Publisher, TicketUpdatedEvent, Subjects } from "@ymrticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
