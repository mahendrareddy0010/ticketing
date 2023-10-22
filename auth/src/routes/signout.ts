import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  console.log(req.cookies, req.cookies?.access_token);
  res.clearCookie("access_token");
  res.status(200).send({});
});

export { router as signoutRouter };
