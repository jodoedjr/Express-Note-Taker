//DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");

//EXPRESS CONFIGURATION
const app = express();

//define port, 8080 for local usage, or process.env.PORT for deployed (heroku) use
const PORT = process.env.PORT || 8080;

//sets up Express app for data parsing
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

//ROUTES
//HTML
// GET /notes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});
// GET *
// app.get("*", function(req, res) {
//     res.sendFile(path.join(__dirname, "/public/index.html"))
// });

//API
// GET /api/notes - returns notes saved in db.json as json
app.get("/api/notes", async function(req, res){
    console.log("notes requested");
     fs.readFile(path.join(__dirname, "/db/db.json"), function(err, data){
        if(err){
            console.log(err);
        }
        res.json(JSON.parse(data));
    });   
    //let test = [{"title":"Test Title","text":"Test text", "id": 1}];    
});
// POST /api/notes
app.post("/api/notes", async function(req, res){
    let newNote = JSON.parse(req.body);
    console.log("newNote from user:");
    console.log(newNote);
    newNote.id = Date.now(); // id notes by current timestamp at time of POST
    let status = await fs.appendFile(path.join(__dirname, "/db/db.json"), newNote, function(err){
        if(err){
            console.log(err);
            return false;
        }
        return true;
    });
    res.json(status);
});
// DELETE /api/notes/:id
app.delete("/api/notes/:id", async function(req, res){
    const id = req.params.id;
    let idFound = false;
    let status = false; // false if program failed to find/overwrite id
    console.log(`Deleting ${id}`);
    let noteJSON = await fs.readFile(path.join(__dirname, "/db/db.json"), function(err, data){
        if(err){
            console.log(err);
        }
        return data;
    });
    noteObjects = JSON.parse(noteJSON);
    for (let i = 0; i < noteObjects.length; i++){
        if(noteObjects[i].id === id){
            noteObjects.splice(i, 1); // removes the object at index i from array of note objects
            idFound = true; // found matching id
            break; //break for loop;
        }
    }
    if(idFound){// if object with matching id was found, overwrite edited file
        status = await fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(noteObjects), function(err){
            if(err){
                console.log(err);
                return false;
            }
            return true;
        });
    }
    res.json(status); //returns true if file sucessfully overwritten
})

//PORT LISTENER
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
})