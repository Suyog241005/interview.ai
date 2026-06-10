import { Router } from "express";
import { authController, logOut } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/", authController);
authRouter.post("/logout", logOut);
