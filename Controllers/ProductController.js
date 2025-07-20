import { fetchMenu } from "../Models/ProductModel.js";

//Hämta meny
export const getMenu = async (req, res) => { // Denna funktion hämtar menyn från databasen och skickar den som JSON-svar.
  // req: Inkommande request, innehåller info om t.ex. vilka rutter som anropas.
  // res: Svar som skickas tillbaka till klienten.
  try { //  Börjar ett try/catch-block för att fånga fel som kan uppstå när man hämtar menyn.
    const menu = await fetchMenu(); // Anropar funktionen fetchMenu från ProductModel.js för att hämta menyn.
    res.json(menu); // Skickar tillbaka menyn som JSON-svar.
  } catch (error) { // Om det blir fel vid hämtning av menyn, fångas det här.
    res.status(500).json({ error: "Kunde inte hämta menyn." }); // Skickar tillbaka ett felmeddelande som JSON-svar.
  }
};