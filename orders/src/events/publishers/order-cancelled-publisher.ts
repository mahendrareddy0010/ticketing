import { Publisher, OrderCancelledEvent, Subjects } from "@ymrticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
