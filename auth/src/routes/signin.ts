import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "@ymrticketing/common";
import { validateRequest } from "@ymrticketing/common";
import jwt from "jsonwebtoken";

import { Password } from "../services/password";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Email not in use");
    }
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid Password");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store on it on session object
    res.cookie("access_token", userJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
