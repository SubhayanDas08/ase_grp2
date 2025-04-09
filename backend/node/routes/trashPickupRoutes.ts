import express from 'express';


const router = express.Router();
import { authenticate } from '../middleware/authenticate';
import { getRouteDetails } from '../controllers/trashPickupController';

router.post('/getRouteDetails', getRouteDetails);
// router.post('/getRouteDetails',authenticate(), getRouteDetails);
export default router;