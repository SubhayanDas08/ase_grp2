import express, { Router } from "express";
import {
  FEregistrationData,
  FElogin,
  FElogout,
  FErefreshToken,
  getLocationByIp,
  getCurrentUser
} from "../controllers/userController";
import { authenticate } from "../middleware/authenticate";
const router: Router = express.Router();

router.post("/getRegistrationData", FEregistrationData);
router.post("/login", FElogin);
router.post("/logout", authenticate(), FElogout);
router.post("/refresh", FErefreshToken);
router.get("/locationByIp", authenticate(), getLocationByIp);

export default router;
