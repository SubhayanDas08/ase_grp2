import express, { Router } from 'express'
import { FEregistrationData, FElogin, getLocationByIp } from '../controllers/userController'
const router: Router = express.Router()

router.post('/getRegistrationData', FEregistrationData)
router.post('/login', FElogin);
router.get('/locationByIp', getLocationByIp)

export default router