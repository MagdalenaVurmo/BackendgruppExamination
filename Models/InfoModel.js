import fs from "fs/promises";
import Datastore from '@seald-io/nedb'; // uppdaterat till nyare version av nedb för undvika errors vid server start
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); //
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, "..", "db", "companyInfo.db");
const companyDb = new Datastore({
  filename: path.join(__dirname, "..", "db", "companyInfo.db"),
  autoload: true,
});


export const seedCompanyInfo = async () => { // En funktion som "seedar" (initierar) databasens innehåll med företagsinformation, om den är tom.
  const existing = await companyDb.find({}); // Hämtar data som finns i databasen.
  if (existing.length === 0) { // Om databasen är tom, läser den in företagsinformationen från en JSON-fil.
    const data = await fs.readFile(path.join(jsonFilePath), "utf8"); // Läser in JSON-filen som innehåller företagsinformationen.
    const companyInfo = JSON.parse(data); // Parsar JSON-filen till ett JavaScript-objekt eller också en array.

    await companyDb.insert(companyInfo); // Här läggs företagsinformationen in i databasen.
    console.log("Company info seedad."); // Loggar att företagsinformationen har seedats.
  }
};

e
export const fetchCompanyInfo = async () => {  // Den här funktionen hämtar företagsinformationen från databasen.
  const info = await companyDb.findOne({}); // Hämtar den första (och kanske enda) posten i databasen.
  return info; // och här returneras företagsinformationen.
};