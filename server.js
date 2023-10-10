const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const connectDb = require("./config/db");
const siteRoutes = require("./routes/site");
const userRoutes = require("./routes/user");

const app = express();
connectDb();
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Lets introduce REST API",
      description: "A REST API built with Express and MongoDB.",
    },
  },
  apis: ["./routes/site.js", "./routes/user.js"],
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/site", siteRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT || 5000, () => console.log("Up and running 🚀"));
