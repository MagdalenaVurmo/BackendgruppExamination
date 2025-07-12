import { Router } from "express";
import { addOrder, getOrderById, getOrderHistory } from "../controllers/orderController.js";
import authMiddleware from "../Middleware/auth.js";
import validateMiddleware from "../Middleware/Validate.js"
import { orderSchema, orderIdSchema } from "../Middleware/Validation.js"

const router = Router();

//Skapa order
router.post("/order", authMiddleware, validateMiddleware(orderSchema),addOrder);

//Hämta orderhistorik
router.get("/history", authMiddleware, getOrderHistory);

//Hämta aktiv order
router.get("/:orderNr", authMiddleware, validateMiddleware(orderIdSchema, "params"), getOrderById);

export default router;