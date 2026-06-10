import type { Request, Response } from "express";
import { User } from "../user/user.model";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Get current user Error",
    });
  }
};
