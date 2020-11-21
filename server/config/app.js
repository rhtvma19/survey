var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var passport = require('passport');
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;


// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
// URI
let DB = require('./db');

mongoose.connect(process.env.URI || DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log("Connected to MongoDB...");
});

const UserModel = require('../models/user');


// strategy for using web token authentication
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'comp299';
var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  try {
    const user = await UserModel.findOne({ id: jwt_payload.id });
    console.log(user);
    if (!user) {
      return next(null, false, { message: 'User not found' });
    }

    // const validate = await user.isValidPassword(password);

    // if (!validate) {
    //   return next(null, false, { message: 'Wrong Password' });
    // }

    return next(null, user, { message: 'Logged in Successfully' });
  } catch (error) {
    return next(null, false, error);
  }

});
passport.use(strategy);

var app = express();
app.use(passport.initialize());
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get('/check', (req, res) => {
  res.json({ "message": "Express is up" });
});

// Login route - here we will generate the token - copy the token generated in the input
app.post("/login", async (req, res) => {

  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (user.password === req.body.password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = { id: user.id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: "ok", token: token });
      } else {
        res.status(401).json({ message: "passwords did not match" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid Inputs" });
  }
});



// POST process the New user create - CREATE
app.post('/register', (req, res, next) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  UserModel.create(user, (err, userResult) => {
    if (err) {
      res.status(400).json({ message: "Error while user registration" });
    }
    res.json({ message: "User created", data: userResult });
  });
});


// now there can be as many route you want that must have the token to run, otherwise will show unauhorized access. Will show success 
// when token auth is successfilly passed.
app.get("/secret", passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json("Success! You can not see this without a token");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;