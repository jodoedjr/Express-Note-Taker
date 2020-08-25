// ===============================================================================
// DEPENDENCIES
// ===============================================================================

const path = require("path");

// ===============================================================================
// ROUTING - HTML
// ===============================================================================

module.exports = function(app){
    // GET /notes - sends /public/notes.html file to client
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/notes.html"))
    });
    
    // GET * - sends /public/index.html file to client for any GET request 
    // that is not defined before this route description
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"))
    });
}
