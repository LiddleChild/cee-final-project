require("dotenv").config();

const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const staticRoute = require("./src/routes/staticRoute");
const apiRoute = require("./src/routes/apiRoute");
const coursevilleRoute = require("./src/routes/coursevilleRoute");

// Middleware options
const corsOptions = {
  origin: true,
  credentials: true,
};

const sessionOption = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
};

// Middleware
app.use("/", express.static("public"));
app.use(cors(corsOptions));
app.use(session(sessionOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", staticRoute);
app.use("/api", apiRoute);
app.use("/courseville", coursevilleRoute);

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
