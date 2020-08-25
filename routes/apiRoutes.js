// ===============================================================================
// DEPENDENCIES
// ===============================================================================

const path = require("path");
const fs = require("fs");

// ===============================================================================
// ROUTING - API's
// ===============================================================================

module.exports = function (app) {

    // GET /api/notes - returns notes saved in db.json as json
    app.get("/api/notes", async function (req, res) {
        fs.readFile(path.join(__dirname, "../db/db.json"), function (err, data) {
            if (err) {
                console.log("GET /api/notes error");
                console.log(err);
            }
            res.json(JSON.parse(data));
        });
    });


    // POST /api/notes
    //handles adding a new note object to db.json
    app.post("/api/notes", async function (req, res) {
        let newNote = req.body; // req.body holds the new note object to be added
        newNote.id = Date.now(); // add id to notes by current timestamp at time of POST

        //read stored note data from db.json file
        fs.readFile(path.join(__dirname, "../db/db.json"), function (err, data) {
            if (err) { //log error if server fails to readFile
                console.log("POST /api/notes error - read db.json");
                console.log(err);
            }
            let noteArray = JSON.parse(data); // parse db.json data into JSON array object
            //return data;
            noteArray.push(newNote); // add newNote to end of JSON array
            //write noteArray back to db.json file
            fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(noteArray, null, 2), function (err) {
                if (err) {//log error if server fails to writeFile
                    console.log("POST /api/notes error - write db.json");
                    console.log(err);
                    res.json(false); //respond with false if write fails
                    return;
                }
                res.json(true); // repond with true if write suceedes
                return;
            });
        });
    });


    // DELETE /api/notes/:id
    app.delete("/api/notes/:id", function (req, res) {
        const id = req.params.id; // id is the stored timestamp of the note
        let idFound = false; // variable to determine if a matching id was found
        console.log(`Deleting ${id}`);
        fs.readFile(path.join(__dirname, "../db/db.json"), function (err, data) {
            if (err) { //log error if server failed to read db.json
                console.log(`DELETE /api/notes/${id} error - read db.json`);
                console.log(err);
            }
            let noteObjects = JSON.parse(data);
            for (let i = 0; i < noteObjects.length; i++) {
                if (noteObjects[i].id == id) {
                    noteObjects.splice(i, 1); // removes the object at index i from array of note objects
                    idFound = true; // found matching id
                    break; //break for loop;
                }
            }
            if (idFound) {// if object with matching id was found, overwrite edited file
                fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(noteObjects), function (err) {
                    if (err) {
                        console.log(`DELETE /api/notes${id} error - write db.json`);
                        console.log(err);
                        res.json(false); // respond false if db.json was not overwritten
                        return;
                    }
                    res.json(true);// respond true if note was deleted and db.json overwritten
                    return;
                });
            } else {
                console.log("Delete ID not found!");
                res.json(false); //respond false if entry not found
            }

        });
    });
}