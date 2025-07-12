import { v4 as uuidv4 } from "uuid";
import { createOrder, fetchOrderById, fetchOrderHistory } from "../Models/OrderModel.js";
import { fetchMenu } from "../Models/ProductModel.js";

//Skapa order
export const addOrder = async (req, res) => {
  const { totalOrder } = req.body;
  if (!totalOrder || !Array.isArray(totalOrder) || totalOrder.length === 0) {
    return res.status(400).json({ message: "Ingen order skickades." });
  }
  try {
    const menu = await fetchMenu();
    let totalPrice = 0;

    const orderItems = totalOrder.map((item) => {
      const product = menu.find((prod) => prod.id === item.id);
      if (!product) {
        throw new Error(`Produkten med id ${item.id} hittades inte.`);
      }
      const quantity = item.quantity || 1;
      const itemTotal = product.price * quantity;
      totalPrice += itemTotal;

      return {
        productId: product.id,
        name: product.name,
        quantity,
        price: product.price,
        total: itemTotal,
      };
    });
    const userId = req.user.id;
    const orderNr = uuidv4();
    const now = new Date();
    const eta = new Date(now.getTime() + 30 * 60000);

    const order = {
      userId,
      orderNr,
      orderDate: now.toISOString(),
      ETA: eta.toISOString(),
      delivered: false,
      totalPrice,
      totalOrder: orderItems,
    };

    const savedOrder = await createOrder(order);

    res.status(201).json({
      success: true,
      message: "Orden har skapats!",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Fel vid skapande av order: ", error);
    res.status(500).json({ error: "Kunde inte skapa order." });
  }
};

//Hämta order genom ID (och token)
export const getOrderById = async (req, res) => {
  const { orderNr } = req.params;
  try {
    const order = await fetchOrderById(orderNr);
    if (!order) return res.status(404).json({ error: "Ordern kunde inte hittas." });
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta ordern." });
  }
};

//Hämta orderhistorik för användare
export const getOrderHistory = async (req, res) => {
  try {
    // Användarens id från auth-middleware
    const userId = req.user.id;

    // Hämtar ordrar från databasen för den inloggade användaren
    const orders = await fetchOrderHistory(userId);

    res.json({
      success: true,
      message: "Hämtning av orderhistorik lyckades.",
      data: orders,
    });
  } catch (error) {
    console.error("Fel vid hämtning av orderhistorik: ", error);
    res.status(500).json({ error: "Kunde inte hämta orderhistorik." });
  }
};