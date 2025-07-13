import { Router } from "express";
import { addOrder, getOrderById, getOrderHistory } from "../controllers/orderController.js";
import authMiddleware from "../Middleware/auth.js";
import { validate, orderSchema, orderIdSchema } from "../Middleware/Validation.js";

const router = Router();

/**
 * @swagger
 * /orders/order:
 *   post:
 *     summary: Skapa en ny order (kräver inloggning)
 *     tags: [Ordrar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order skapad
 *       400:
 *         description: Ogiltig order
 *       401:
 *         description: Saknar eller ogiltig token
 */
router.post("/order", authMiddleware, validate(orderSchema), addOrder);

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Hämta orderhistorik för inloggad användare
 *     tags: [Ordrar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista med tidigare ordrar
 *       401:
 *         description: Saknar eller ogiltig token
 */

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Hämta orderhistorik för inloggad användare
 *     tags: [Ordrar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista med tidigare ordrar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Saknar eller ogiltig token
 */
router.get("/history", authMiddleware, getOrderHistory);

/**
 * @swagger
 * /orders/{orderNr}:
 *   get:
 *     summary: Hämta en specifik order med ordernummer
 *     tags: [Ordrar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNr
 *         required: true
 *         schema:
 *           type: string
 *         description: Ordernummer
 *     responses:
 *       200:
 *         description: Orderdetaljer
 *       401:
 *         description: Ogiltig eller saknad token
 *       404:
 *         description: Order hittades inte
 */
router.get("/:orderNr", authMiddleware, validate(orderIdSchema, "params"), getOrderById);

export default router;