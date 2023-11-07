import { Publisher, ExpirationCompleteEvent, Subjects } from "@ymrticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
