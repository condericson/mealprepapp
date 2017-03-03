const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


mongoose.Promise = global.Promise;

const app = express();

const {DATABASE_URL, PORT} = require('./config');
const {Recipes} = require('./models/recipeModel');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(cookieParser());


//routers
const recipeRouter = require('./recipes');
app.use('/recipes', recipeRouter);

const usersRouter = require('./users');
app.use('/users', usersRouter);



//get requests to open pages
app.get('/index', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/recipeentry', function(req, res) {
  res.sendFile(__dirname + '/public/recipeentry.html');
})

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
})

app.get('/weeklyview', function(req, res) {
  res.sendFile(__dirname + '/public/weeklyview.html')
})

app.get('/public/images/platecover.png', function(req, res) {
  res.sendFile(__dirname + '/public/images/platecover.png');
})

/*app.post('/users/login', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
    if (!user) {
      res.render({error: 'Invalid email or password.' });
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/weeklyview');
      } else {
        res.render({error: 'Invalid email or password.' });
      }
    }
  });
});*/


let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};