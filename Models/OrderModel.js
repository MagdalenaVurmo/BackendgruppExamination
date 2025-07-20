import Datastore from '@seald-io/nedb'; // uppdaterat till nyare version av nedb för undvika errors vid server start
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const orderDb = new Datastore({
  filename: path.join(__dirname, "..", "db", "orders.db"),
  autoload: true,
});


//Skapa order
export const createOrder = async (order) => { // createOrder funktionen skapar en ny order i databasen.
  try { //Startar ett try-block för att hantera eventuella fel under processen.
    const newOrder = await orderDb.insert(order); // Här läggs den nya ordern in i databasen.
    return newOrder; // och här returneras den skapade ordern.
  } catch (error) { // Om något går fel vid skapandet av ordern, fångas felet här.
    throw new Error("Kunde tyvärr inte spara ordern: " + error.message); // Skickar tillbaka ett felmeddelande till kunden.
  }
};

//Hämta order
export const fetchOrderById = async (orderNr) => { // Den här funktionen hämtar en order baserat på orderNumret.
  try { //Startar ett try-block för att hantera eventuella fel under processen.
    const order = await orderDb.findOne({ orderNr }); // Den här hämtar ordern från databasen med det angivna orderNumret.
    return order; // och här returneras den hämtade ordern.
  } catch (error) { // Om något går fel vid hämtning av ordern, fångas felet här.
    throw new Error("Kunde inte hämta order: " + error.message);  // Skickar tillbaka ett felmeddelande till kunden.
  }
};

//Hämta alla ordrar för en användare 
export const fetchOrderHistory = async (userId) => { // Hämtar alla ordrar som tillhör en specifik användare (userId).
  try { //Startar ett try-block för att hantera eventuella fel under processen.
    const orders = await orderDb.find({ userId }); // Hämtar alla ordrar från databasen som tillhör den angivna användaren.
    return orders; // och här returneras den hämtade orderhistoriken.
  } catch (error) { // Om något går fel vid hämtning av orderhistoriken, fångas felet här.
    throw new Error("Kunde inte hämta orderhistorik: " + error.message); // Skickar tillbaka ett felmeddelande till kunden.
  }
}