import { Router } from "express";
import { addUser, loginUser } from "../controllers/userController.js";
import validateMiddleware from "../Middleware/Validate.js"
import { userSchema } from "../Middleware/Validation.js"


const router = Router();

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Skapa en ny användare
 *     tags: [Användare]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Användare skapad
 *       400:
 *         description: Ogiltiga indata
 */
router.post("/signup", validateMiddleware(userSchema), addUser);

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Logga in användare och få JWT-token
 *     tags: [Användare]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Inloggning lyckades, token returneras
 *       401:
 *         description: Felaktiga inloggningsuppgifter
 */
router.post("/signin", validateMiddleware(userSchema), loginUser);

export default router;