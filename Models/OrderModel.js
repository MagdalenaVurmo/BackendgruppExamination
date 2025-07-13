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
export const createOrder = async (order) => {
  try {
    const newOrder = await orderDb.insert(order);
    return newOrder;
  } catch (error) {
    throw new Error("Kunde tyvärr inte spara ordern: " + error.message);
  }
};

//Hämta order
export const fetchOrderById = async (orderNr) => {
  try {
    const order = await orderDb.findOne({ orderNr });
    return order;
  } catch (error) {
    throw new Error("Kunde inte hämta order: " + error.message);
  }
};

//Hämta alla ordrar för en användare 
export const fetchOrderHistory = async (userId) => {
  try {
    const orders = await orderDb.find({ userId });
    return orders;
  } catch (error) {
    throw new Error("Kunde inte hämta orderhistorik: " + error.message);
  }
}