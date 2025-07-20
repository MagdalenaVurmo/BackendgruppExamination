// funktioner för att hantera produktdata
import Datastore from '@seald-io/nedb'; // uppdaterat till nyare version av nedb för undvika errors vid server start
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDb = new Datastore({
  filename: path.join(__dirname, "..", "db", "products.db"),
  autoload: true,
});


export const seedDatabase = async () => { // Exporterar en asynkron funktion med namnet seedDatabase.
  try { //Startar ett try-block för att hantera eventuella fel under processen.
    const count = await productsDb.count({});  //Räknar hur många produkter som redan finns i databasen productsDb. 
    console.log("Antal produkter före seeding:", count); // count({}) räknar alla dokument.

    if (count === 0) { // Kontrollerar om databasen är helt tom. Om det redan finns produkter, görs inget.
      const seedFile = path.join(__dirname, "..", "db", "Products.json"); //Skapar en filväg till Products.json, som innehåller de produkter som ska laddas in.
      const data = await fs.readFile(seedFile, "utf8");   //Läser in hela JSON-filen som en textsträng.
      const { coffeeMenu } = JSON.parse(data); // Parsar JSON-filen och hämtar coffeeMenu-arrayen.

      const insertedDocs = await productsDb.insert(coffeeMenu); // Lägger in produkterna i databasen.

      console.log("seed-data importerad: ", insertedDocs); // Consolen skriver ut de importerade produkterna.
    }
  } catch (error) {  // Fångar upp eventuella fel som kan uppstå under processen.
    console.error("FEL!", error); // Skriver ut felmeddelandet till konsolen.
  }
};


export const fetchMenu = async () => { // Den här funktionen hämtar alla produkter från databasen.
  try { //Startar ett try-block för att hantera eventuella fel under processen.
    const products = await productsDb.find({}); // Hämtar alla produkter från databasen.
    const sortedProducts = products.sort((a, b) => a.id - b.id); // Sorterar produkterna baserat på deras id i stigande ordning.
    return sortedProducts; // och här returneras de sorterade produkterna.
  } catch (error) { // Om något går fel vid hämtning av produkterna, fångas felet här.
    throw new Error("Fel vid hämtning av produkter: " + error.message); // Skickar tillbaka ett felmeddelande till den som anropar funktionen.
  }
};