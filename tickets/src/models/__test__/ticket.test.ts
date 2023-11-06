import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create ticket
  const ticket = Ticket.build({
    title: "Topology",
    price: 5,
    userId: "998798",
  });
  await ticket.save();

  // fetch !st time
  const firstFetch = await Ticket.findById(ticket.id);
  // fetch 2nd time
  const secondFetch = await Ticket.findById(ticket.id);

  // update both
  firstFetch!.set({ price: 10 });
  secondFetch!.set({ title: 15 });

  // save 1st one
  await firstFetch!.save();

  // save 2nd one
  try {
    await secondFetch!.save();
  } catch (err) {
    return;
  }
  // we should get error 2nd time
  throw new Error("Shoul not reach here");
});

it("increments the version number", async () => {
  // create ticket
  const ticket = Ticket.build({
    title: "Topology",
    price: 5,
    userId: "998798",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);

  // fetch !st time
  const firstFetch = await Ticket.findById(ticket.id);
  firstFetch?.set({ price: 10 });
  await firstFetch?.save();

  expect(firstFetch?.version).toEqual(1);
});
