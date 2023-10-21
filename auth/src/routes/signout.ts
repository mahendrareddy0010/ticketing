import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  res.clearCookie("access_token");
  res.status(200).send({});
});

export { router as signoutRouter };
