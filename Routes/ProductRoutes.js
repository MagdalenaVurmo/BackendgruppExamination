import { Router } from "express"; 
import { getMenu } from "../controllers/productController.js"; // Importerar getMenu-funktionen från productController.js

const router = Router(); // Skapar en ny router-instans för att hantera rutter relaterade till produkter.
// Den här instansen används för att definiera routes (t.ex. GET, POST).

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
router.get("/", getMenu); //När klienten anropar /products, körs getMenu() och menyn returneras som JSON.

export default router;