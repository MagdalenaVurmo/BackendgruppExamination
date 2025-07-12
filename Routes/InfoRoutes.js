import { Router } from 'express'
import { getCompanyInfo } from '../controllers/infoController.js';

const router = Router()

//Hämta företagsinfo
router.get('/', getCompanyInfo)

export default router;