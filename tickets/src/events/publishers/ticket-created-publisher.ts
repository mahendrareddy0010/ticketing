import { Publisher, TicketCreatedEvent , Subjects} from "@ymrticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
