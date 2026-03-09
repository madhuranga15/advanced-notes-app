const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const FILE = "notes.json";

app.get("/notes",(req,res)=>{

const data = JSON.parse(fs.readFileSync(FILE));
res.json(data);

});

app.post("/notes",(req,res)=>{

const notes = JSON.parse(fs.readFileSync(FILE));

notes.push(req.body);

fs.writeFileSync(FILE,JSON.stringify(notes));

res.json({success:true});

});

app.post("/notes/update",(req,res)=>{

fs.writeFileSync(FILE,JSON.stringify(req.body));

res.json({success:true});

});

app.delete("/notes/:index",(req,res)=>{

const notes = JSON.parse(fs.readFileSync(FILE));

notes.splice(req.params.index,1);

fs.writeFileSync(FILE,JSON.stringify(notes));

res.json({success:true});

});

app.listen(3000,()=>{

console.log("Server running on http://localhost:3000");

});