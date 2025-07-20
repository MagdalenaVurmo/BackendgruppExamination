import dotenv from "dotenv";                              //Laddar miljövariabler från .env-fil
import express from "express";
import swaggerUi from "swagger-ui-express";
import { seedDatabase } from "./Models/ProductModel.js";
import { seedCompanyInfo } from "./Models/InfoModel.js";
import { swaggerDocs } from "./Swagger.js";
import productRoute from "./Routes/ProductRoutes.js";
import orderRoute from "./Routes/OrderRoutes.js";
import userRoute from "./Routes/UserRoutes.js";
import infoRoute from "./Routes/InfoRoutes.js";
import cors from "cors";


dotenv.config();                  // Laddar in .env-filen så att.env och PORT finns tillgängliga


const app = express();            // Skapar en ny Express-applikation.

app.use(cors());                     //Den här aktiverar CORS för alla rutter.
app.use(express.json());          //Lägger till en middleware som gör att Express kan läsa JSON i inkommande request-body.

const port = process.env.PORT || 3030;   // Hämtar portnumret från .env.


app.use("/products", productRoute);  // Använder productRoute för alla rutter som börjar med /products.
app.use("/orders", orderRoute); // Använder orderRoute för alla rutter som börjar med /orders.
app.use("/user", userRoute); // Använder userRoute för alla rutter som börjar med /user.
app.use("/signin", userRoute); // Använder userRoute för alla rutter som börjar med /signin.
app.use("/info", infoRoute); // Rutter för företagsinfo.


// Swagger UI på http://localhost:3030/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Här visas Swagger UI på http://localhost:3030/docs så att man kan testa API:et i webbläsaren.


const startServer = async () => { // Denna funktion som starta servern och seed:a databaserna.

  try { 
    await seedDatabase();  
    await seedCompanyInfo(); 
    console.log("Databaserna är seedade, startar servern..."); 
         
=======
  try {
    await seedDatabase();
    await seedCompanyInfo();
    console.log("Databaserna är seedade, startar servern...");





    // Startar servern och lyssnar på den valda porten. Skriver ut adressen till konsolen.
    app.listen(port, () => {
      console.log(`Servern körs på http://localhost:${port}`);
      console.log(`Swagger UI finns på http://localhost:${port}/docs`)
    });
  } catch (error) {    // Om det blir fel vid seeding då fångas det här och skrivs ut.
    console.error("Fel vid seeding av databasen:", error);
  }
};

startServer();
