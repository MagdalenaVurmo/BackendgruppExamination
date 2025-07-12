import { Router } from "express";
import { getMenu } from "../controllers/productController.js";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Hämta hela menyn
 *     tags: [Produkter]
 *     responses:
 *       200:
 *         description: Lista med produkter
 */
router.get("/", getMenu);

export default router;