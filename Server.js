import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { seedDatabase } from "./Models/ProductModel.js";
import { seedCompanyInfo } from "./Models/InfoModel.js";
import { swaggerDocs } from "./Swagger.js";
import productRoute from "./Routes/ProductRoutes.js";
import orderRoute from "./Routes/OrderRoutes.js";
import userRoute from "./Routes/UserRoutes.js";
import infoRoute from "./Routes/InfoRoutes.js";
import open from "open"
import fs from "fs";


dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3030;

app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);
app.use("/", infoRoute);

// Swagger UI på http://localhost:3030/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
  try {
    await seedDatabase();
    await seedCompanyInfo();
    console.log("Databaserna är seedade, startar servern...");


    app.listen(port, () => {
      console.log(`Servern körs på http://localhost:${port}`);

      // denna fil skapas endast första gången servern startas.
      const flagFile = ".swagger-opened"

      // här använder jag en if-sats som kollar ifall "flagfile" finns
      // om filen finns så öppnas Swagger UI bara när servern startas.
      // detta är för att förhindra att Swagger UI öppnas varje gång koden ändras och nodemon körs.
      if (!fs.existsSync(flagFile)) {
        open(`http://localhost:${port}/docs`)
        fs.writeFileSync(flagFile, "opened")
      }

    });
  } catch (error) {
    console.error("Fel vid seeding av databasen:", error);
  }
};

startServer();
