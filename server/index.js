const express=require("express");
const PORT=process.env.PORT || 3001;
const path=require('path');
const crypto=require("crypto");
const app=express();
const bodyParser=require("body-parser");


var db;
var activeDB="l8d-dev-db1";
var users=[];
var ctr=0;

const MongoClient = require('mongodb').MongoClient;
const { RSA_PSS_SALTLEN_AUTO } = require("constants");
const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.resolve(__dirname, "../client/public")));
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
	var response={[user.Email]:{"login":true, "type":user.type, "FirstName": user.FirstName, "LastName": user.LastName}}
	users.push(user);//temp for testing - until DB is up, wanted to see if hashing worked
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

app.post("/login", (req,res) => {
	console.log("login attempt for "+req.body.email);
	//search for user in db
	var s=null;
	var h=null;
	for(var i=0; i<users.length;i++){
		if(users[i].Email==req.body.email){
			s=users[i].Salt;
			h=users[i].Password;
			break;
		}else{
			continue;
		};
	};
	//send user provided password and db salt to hmac
	if(s!=null && h!=null){
		compHash=hash(s, req.body.password);
		console.log("stored hash: "+h);
		console.log("generated hash: "+compHash);
		//compare generated hash with db stored hash
		if(h==compHash){
			console.log("auth successful");
		}else{
			console.log("auth failed");
		};
	};
});

app.get("/hw", (req,res) =>{
	console.log("/hw request received");
	res.json({message: "Hello World!"});
});

app.get("*", (req,res) =>{
	res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
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