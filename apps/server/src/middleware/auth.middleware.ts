import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const userId = verifyToken(token);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    req.userId = userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Auth Error",
    });
  }
};
