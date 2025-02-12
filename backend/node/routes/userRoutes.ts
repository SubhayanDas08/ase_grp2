import express, { Router } from 'express'
import { FEregistrationData, FElogin } from '../controllers/userController'
const router: Router = express.Router()

router.post('/getRegistrationData', FEregistrationData)
router.post('/login', FElogin);

export default router