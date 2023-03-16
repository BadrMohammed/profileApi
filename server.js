require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");
const { logger } = require("./middleware/logEvents");
const combineRoutes = require("./routes");
const i18next = require("i18next");
const middlewareI18Next = require("i18next-http-middleware");
const { initLocal } = require("./locales/locale");
const PORT = process.env.PORT || 3500;

// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

//connect to MONOG DD
connectDB();

// custom middleware
initLocal();
app.use(logger); //to log all erros
app.use(credentials);
app.use(cors(corsOptions)); //to disable secuirty policy

// app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// build in middleware
app.use(express.urlencoded({ extended: false })); //handle url encoded(form data)
app.use(middlewareI18Next.handle(i18next));
app.use(express.json()); // build in middleware to handle json

app.use(cookieParser()); //cookies parser

// routes;
combineRoutes(app);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to MONGO DB");
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});
