import { Router } from 'express'
import { getCompanyInfo } from '../controllers/infoController.js';

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Company Info
 *   description: API för företagsinformation
 */

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Hämta företagsinformation
 *     tags: [Company Info]
 *     responses:
 *       200:
 *         description: Företagsinformation hämtad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companyName:
 *                   type: string
 *                   example: Airbean AB
 *                 address:
 *                   type: string
 *                   example: Kaffegatan 1, 123 45 Fikastad
 *                 phone:
 *                   type: string
 *                   example: 08-123 456 78
 *       500:
 *         description: Serverfel vid hämtning av företagsinfo
 */

// GET /info
router.get('/', getCompanyInfo)

export default router;