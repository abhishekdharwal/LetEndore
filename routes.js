import { Router } from "express";
import {
  login,
  signup,
  updatePassword,
  updateUser,
} from "./controller/admin.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/update", updateUser);
router.patch("/resetpassword", updatePassword);

export default router;
