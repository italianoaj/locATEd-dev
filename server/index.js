const express=require("express");
const PORT=process.env.PORT || 3001;
const path=require('path');
const app=express();

var db;
var activeDB="l8d-dev-db1";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://netmage:IcntG3t1n$42@located-dev.lunjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.set('view engine', 'ejs');

app.get("/", (req,res) => {
	console.log("/ request received");
	res.render('index.ejs')
});

app.get("/admin", (req,res) => {
	console.log("/admin request received");
	res.render("admin.ejs");
});

app.get("/vendor", (req,res) => {
	console.log("/vendor request received");
	res.render("vendor.ejs");
});

app.get("/customer", (req,res) => {
	console.log("/customer request received");
	res.render("customer.ejs");
});

app.get("/vlogin", (req,res) => {
	console.log("/vlogin request received");
	res.render("vlogin.ejs");
});

app.get("/clogin", (req,res) => {
	console.log("/clogin request received");
	res.render("clogin.ejs");
});

app.get("/hw", (req,res) =>{
	console.log("/hw request received");
	res.json({message: "Hello World!"});
});

app.get("*", (req,res) =>{
	res.sendfile(path.resolve(__dirname, "../client/build", "index.html"));
});

client.connect(err => {
	const collection = client.db(activeDB).collection("devices");
	if (err) throw err;
	console.log(activeDB+" is the active db");
	app.listen(PORT, () => {
		console.log('Running on port 3001');
	});
	client.close();
});

// - Anthony Italiano :) 