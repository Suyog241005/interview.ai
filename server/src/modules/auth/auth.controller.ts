import type { Request, Response } from "express";
import { AuthSchema } from "../../zod";
import { User } from "../user/user.model";
import { genToken } from "../../utils/token";

export const authController = async (req: Request, res: Response) => {
  try {
    const { name, email, photoUrl } = req.body;

    const { success } = AuthSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = genToken(existingUser._id.toString());
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.status(200).json({
        message: "User logged in successfully",
        user: existingUser,
        token,
      });
    } else {
      const newUser = await User.create({
        name,
        email,
        photoUrl,
      });

      const token = genToken(newUser._id.toString());
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.status(200).json({
        message: "User signed up successfully",
        user: newUser,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Auth Error",
    });
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Logout Error",
    });
  }
};
