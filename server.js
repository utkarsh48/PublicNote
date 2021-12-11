require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Note = require("./models/Note");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static("public"));


app.get("/", async (req, res)=>{
  let notes = await Note.find({}).sort({_id: 1});
  res.render("index.ejs", {notes: notes});
});

app.get("/ajax", async (req, res)=>{
  let notes = await Note.find({}).sort({_id: 1});
  // res.render("index.ejs", {notes: notes});
  res.render("get.ejs", {notes: notes});
});

app.post("/", async (req,res)=>{

  const counted = await Note.findOne({}).sort({"_id": -1});
  let id = counted ? counted._id+1 : 1;

  let note = new Note({
    heading: req.body.heading,
    text: req.body.text,
    author: req.body.author,
    color: req.body.color || 0,
    _id: counted
  });
  
  try{
    let result = await note.save();
    res.send(result);
  }catch(e){
    console.error(e);
  }
  // res.redirect("/");
});

app.put("/:id", async (req,res)=>{
  try{
    let obj = {
      heading: req.body.heading,
      text: req.body.text,
      author: req.body.author,
      color: parseInt(req.body.color)
    };

    if(parseInt(obj.color)===null) {
      delete obj.color;
    }
    console.log(obj);

    let result = await Note.updateOne({
      _id: req.params.id
    }, obj);
    res.send(result);
  }catch(e){
    console.error(e);
  }
  // res.redirect("/");
});

app.delete("/:id", async (req, res)=>{
  try{
    let result = await Note.deleteOne({_id: req.params.id});
    res.send(result);
  }catch(er){
    console.log(er);
  }

})

mongoose.connect(process.env.DBName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log("connected to db...")
})
.catch(()=>{
  console.log("an error occured");
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log("listening...");
});