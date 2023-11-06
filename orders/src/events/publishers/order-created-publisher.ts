import { Publisher, OrderCreatedEvent, Subjects } from "@ymrticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
