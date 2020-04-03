var express=require("express");
var bodyParser=require("body-parser");

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://shreyas:shreyas3336@circuitapp-8wvpk.mongodb.net/userprofile?retryWrites=true&w=majority');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/sign_up', function(req,res){
    var name = req.body.name;
    var email =req.body.email;
    var pass = req.body.password;

    var data = {
        "name": name,
        "email":email,
        "password":pass
    }
    db.collection('userdata').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");

    });

    return res.redirect('/signup_success.html');
})

app.post('/login', function(req,res){
    var email =req.body.email;
    var pass = req.body.password;

    db.collection('userdata').findOne({ email: req.body.email}, function(err, user){
        if(user == null){
            console.error("Email & password should not be empty or null");
        }
        else if(user.email == email && user.password == pass)
        {
            console.log("Login Successful.");
        }
        else{
            console.error("Invalid Credentials");
            res.redirect('/login.html');
        }
    });
    return res.redirect('/login_success.html');
})


app.get('/',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('/index.html');
}).listen(3000)


console.log("server listening at port 3000");