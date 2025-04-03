import express, { Router } from "express";
import {
  FEregistrationData,
  FElogin,
  FElogout,
  FErefreshToken,
  getLocationByIp,
  getCurrentUser,
  changeUserPassword,
  updateFirstAndLastName,
} from "../controllers/userController";
import { authenticate } from "../middleware/authenticate";
const router: Router = express.Router();

router.post("/getRegistrationData", FEregistrationData);
router.post("/login", FElogin);
router.post("/logout", authenticate(), FElogout);
router.post("/refresh", FErefreshToken);
router.get("/locationByIp", authenticate(), getLocationByIp);
router.get("/get", authenticate(), getCurrentUser);
router.post("/changePassword", authenticate(), changeUserPassword);
router.post("/updateName", authenticate(), updateFirstAndLastName);

export default router;
