import { v4 as uuidv4 } from "uuid";
import { createOrder, fetchOrderById, fetchOrderHistory } from "../Models/OrderModel.js";
import { fetchMenu } from "../Models/ProductModel.js";

//Skapa order
export const addOrder = async (req, res) => { //
  const { totalOrder } = req.body; // Hämtar ordern från request body. Denna order är en lista med produkter som ska beställas.
  if (!totalOrder || !Array.isArray(totalOrder) || totalOrder.length === 0) { // Om totalOrder inte finns, då returneras 400 Bad Request.
    return res.status(400).json({ message: "Ingen order skickades." }); // Den säger till att ordern inte skickades. Man får ett fel meddelande alltså.
  }
  try {
    const menu = await fetchMenu(); // Hämtar menyn från databasen. Denna meny är en lista med alla produkter som finns att beställa.
    let totalPrice = 0;

    const orderItems = totalOrder.map((item) => { 
      const product = menu.find((prod) => prod.id === item.id); 
      if (!product) { // Om produkten inte finns i menyn, då kommer ett felmeddelande.
        throw new Error(`Produkten med id ${item.id} hittades inte.`);  // Om produkten inte finns i menyn, så säger den att produkten hittades inte.
      }
      const quantity = item.quantity || 1; // Om inte antalet varor anges, då sätts den till 1.
      const itemTotal = product.price * quantity; // Här beräknas totalpriset för varje produkt i ordern.
      totalPrice += itemTotal; // Här beräknas det totala priset för ordern genom att summera varje produkts totalpris.

      return { 
        productId: product.id,      // Produkt id.
        name: product.name,         // Produkt namnet.
        quantity,                   // Här hämtas produktens kvantitet från ordern.
        price: product.price,        // Här hämtas produktens pris från menyn.
        total: itemTotal,           // Här beräknas totalpriset för varje produkt i ordern.
      };
    });
    const userId = req.user.id; // Hämtar användarens id från auth-middleware.
    const orderNr = uuidv4(); // Skapar ett unikt ordernummer med uuidv4.
    const now = new Date(); // Hämtar nuvarande tid och datum.
    const eta = new Date(now.getTime() + 30 * 60000); // Här beräknas ETA till 30 minuter från och med nu.

    const order = { // Här skapas själva ordern med all information.
      id: uuidv4(), // Genererar ett unikt id för ordern.
      userId, // Användarens id från auth-middleware.
      orderNr, // Ett unikt ordernummer.
      orderDate: now.toISOString(), // Datum och tid för när ordern skapades.
      ETA: eta.toISOString(), // Beräknad tid för när ordern ska vara klar.
      delivered: false, // Om ordern är levererad eller inte.
      totalPrice, // Det totala priset för ordern.
      totalOrder: orderItems, // Här är lista med alla produkter i ordern.
    };

    const savedOrder = await createOrder(order); // Här skapar ordern i databasen.

    res.status(201).json({  // Här skickar de tillbaka en 201 Created-status med orderdata.
      success: true, // Här säger den till att ordern skapades korrekt.
      message: "Orden har skapats!", // Meddelar att ordern skapades.
      data: savedOrder,   // Här skickar den tillbaka den skapade ordern.
    });
  } catch (error) { // Fångar upp fel vid skapande av order.
    console.error("Fel vid skapande av order: ", error);
    res.status(500).json({ error: "Kunde inte skapa order." });
  }
};

//Hämta order genom ID (och token)
export const getOrderById = async (req, res) => { // Den här hämtar en order och är baserat på orderNumret som skickas in i URL:en.
  const { orderNr } = req.params;                                           // Hämtar orderNumret
  try {
    const order = await fetchOrderById(orderNr);                                    // Hämtar ordern från databasen med orderNumret. 
    if (!order) return res.status(404).json({ error: "Ordern kunde inte hittas." }); // Om ordern inte skulle hittas, då returneras 404
    res.status(200).json({ 
      success: true,                // Säger till att ordern hämtades korrekt. 
      data: order,                  // Här skickar den tillbaka den hämtade ordern.
    });
  } catch (error) {               // Fångar upp eventuella fel vid hämtning av order.
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