// ==============================================================================
// DEPENDENCIES
// ==============================================================================
const express = require("express");

// ==============================================================================
// EXPRESS CONFIGURATION
// ==============================================================================
// Using express as a web framework
const app = express();

//define port, 8080 for local usage, or process.env.PORT for deployed (heroku) use
const PORT = process.env.PORT || 8080;

//sets up Express app for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//sets up Express app to provide other files in the "public" folder, including .css and .js
app.use(express.static("public"));

// ===============================================================================
// ROUTES - API & HTML
// ===============================================================================
require("./routes/apiRoutes")(app); //instantiates the routes in the module.exports function(app) described in apiRoutes.js
require("./routes/htmlRoutes")(app); //instantiates the routes in the module.exports function(app) described in htmlRoutes.js


// ===============================================================================
// LISTENER
// ===============================================================================
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
})