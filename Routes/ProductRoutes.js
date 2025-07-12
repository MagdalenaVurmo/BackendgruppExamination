import { Router } from "express";
import { getMenu } from "../controllers/productController.js";

const router = Router();

//Hämta meny
router.get("/", getMenu)

export default router;