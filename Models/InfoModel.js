import fs from "fs/promises";
import Datastore from "nedb-promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the path to the JSON file and the database
const jsonFilePath = path.join(__dirname, "..", "db", "companyInfo.json");
const companyDb = new Datastore({
  filename: path.join(__dirname, "..", "db", "companyInfo.db"),
  autoload: true,
});
 // Seed the company info database with data from JSON file if empty

export const seedCompanyInfo = async () => {
  const existing = await companyDb.find({});
  if (existing.length === 0) {
    const data = await fs.readFile(path.join(jsonFilePath), "utf8");
    const companyInfo = JSON.parse(data);

    await companyDb.insert(companyInfo);
    console.log("Company info seedad.");
  }
};

// Fetch company info from the database
export const fetchCompanyInfo = async () => {     //Hämta företagsinfo
  const info = await companyDb.findOne({});
  return info;
};