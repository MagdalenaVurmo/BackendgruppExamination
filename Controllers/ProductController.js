import { fetchMenu } from "../Models/ProductModel.js";

//Hämta meny
export const getMenu = async (req, res) => {
  try {
    const menu = await fetchMenu();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta menyn." });
  }
};