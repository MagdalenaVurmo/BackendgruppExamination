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
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3030;

app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);
app.use("/signin", userRoute)
app.use("/info", infoRoute);

// Swagger UI på http://localhost:3030/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
  try {
    await seedDatabase();
    await seedCompanyInfo();
    console.log("Databaserna är seedade, startar servern...");


    app.listen(port, () => {
      console.log(`Servern körs på http://localhost:${port}`);
      console.log(`Swagger UI finns på http://localhost:${port}/docs`)
    });
  } catch (error) {
    console.error("Fel vid seeding av databasen:", error);
  }
};

startServer();
