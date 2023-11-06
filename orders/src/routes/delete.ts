import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@ymrticketing/common";
import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    const publisher = new OrderCancelledPublisher(natsWrapper.client);
    try {
      await publisher.publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });
    } catch (err) {
      console.log("unable to publish Order cancelled event : ", err);
    }

    res.status(204).send({});
  }
);

export { router as deleteOrderRouter };
