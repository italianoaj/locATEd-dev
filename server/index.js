const express=require("express");
const PORT=process.env.PORT || 3001;
const path=require('path');
const crypto=require("crypto");
const app=express();
const bodyParser=require("body-parser");


var db;
var activeDB="l8d-dev-db1";

const MongoClient = require('mongodb').MongoClient;
const { RSA_PSS_SALTLEN_AUTO } = require("constants");
const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

function freeSalt(){
	return crypto.randomBytes(Math.ceil(12/2)).toString('hex').slice(0,12)
};

function hash(salt, pass){
	var hmac = crypto.createHmac("sha512", salt);
	hmac.update(pass);
	var hpass=hmac.digest("hex");
	return hpass;
};

app.get("/", (req,res) => {
	console.log("/ request received");
	res.render('index.ejs')
});

app.get("/admin", (req,res) => {
	console.log("/admin request received");
	res.render("admin.ejs");
});

app.get("/signup", (req,res) => {
	console.log("/signup request received");
	res.render("signup.ejs");
});

app.post("/signup", (req,res) => {
	console.log("post for new user");
	var user = req.body.attrib;
	var salt=freeSalt();
	var hpass=hash(salt,req.body.attrib.Password);
	user.Password=hpass;
	user.Salt=salt;
	//store userdata in db
	var response = {"login":true, "type":user.type}
	res.send(JSON.stringify(response));
})

app.get("/vendor", (req,res) => {
	console.log("/vendor request received");
	res.render("vendor.ejs");
});

app.get("/customer", (req,res) => {
	console.log("/customer request received");
	res.render("customer.ejs");
});

app.get("/login", (req,res) => {
	console.log("/login request received");
	res.render("login.ejs");
});

app.get("/hw", (req,res) =>{
	console.log("/hw request received");
	res.json({message: "Hello World!"});
});

app.get("*", (req,res) =>{
	res.sendfile(path.resolve(__dirname, "../client/build", "index.html"));
});

client.connect(err => {
	const collection = client.db(activeDB).collection("users");
	if (err) throw err;
	console.log(activeDB+" is the active db");
	app.listen(PORT, () => {
		console.log('Running on port 3001');
	});
	client.close();
});

// - Anthony Italiano :) 