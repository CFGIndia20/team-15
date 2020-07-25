const express = require('express');
const mongoose = require('mongoose');
const nodemailerapp = require('./routes/server');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const keys = require('./config/keys');

const app = express();

// setting view engine
app.set('view engine', 'ejs');

// connecting to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

app.use(express.static(__dirname + '/public'));

// home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/mail', function (req, res) {
    console.log(req.body);
    let output = `
    <h1>name: ${req.body.name}</h1>
    <h2>email: ${req.body.email}</h2>
    `;
    nodemailerapp(req.body.email,output).then(info=>{
        console.log("email sent");
        res.render('home', { user: req.user })
        console.log(info);
    }).catch((err,info)=>{
        console.log(info);
        console.log(err);
        res.send("invalid email address");
    })
    
    
   
  })


app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});

