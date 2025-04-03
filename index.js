const express = require("express");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");

const database = require("./config/database");
const routesAmdin = require("./routes/admin/index.route");
const routesClient = require("./routes/client/index.route");

const app = express();
database.connect();

app.use(cors());

// parse application/json
app.use(bodyParser.json());

// Routes Admin
routesAmdin(app);
// Routes Client
routesClient(app);
app.listen(process.env.PORT,"0.0.0.0" , () => {
    console.log(`App listen on port ${process.env.PORT}`);
});