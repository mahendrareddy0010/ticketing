import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
} from "@ymrticketing/common";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    let ticket = await Ticket.findById(req.params.id);
    const currentUserId = req.currentUser!.id;

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== currentUserId) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title, price });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
