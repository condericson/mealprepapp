const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {User} = require('./models/userModel');

const jsonParser = bodyParser.json();
router.use(morgan('common'));

router.get('/', (req,res) => {
  User.find(function(err, user) {
    if(err) {
      res.status(500).json({"message": "Error!"});
    }
    res.status(201).json(user);
  })
});

router.post('/', jsonParser, (req, res) => {
  User.create({
    'username': req.body.username,
    'password': req.body.password,
    'chefName': req.body.chefName
  }, function(err, user){
    if(err) {
      res.status(500).json({"message":"Error with post"})
    }
    res.status(201).json(user);
  });
});

router.post('/login', jsonParser, (req, res) => {
  User.findOne({
    'username': req.body.username
  }, function(err, user){
    if(err) {
      res.status(500).json({"message":"Username or password not valid"})
    }
    if(user.password === req.body.password) {
      res.status(201).json({"message":"Password accepted"})
    }    
  });
});


router.put('/:id', jsonParser, function(req, res) {
  var _id = mongoose.Types.ObjectId(req.params.id);
    User.findOneAndUpdate({
      _id: _id
    }, 
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        chefName: req.body.chefName
      }
    },
    {
      new: true
    }, 
    function(err, user) {
        if (err || !user) {
            console.error("Could not update user", req.body.username);
            mongoose.disconnect();
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                })
            }
        }
        console.log("Updated user", user.username);
        res.status(201).json(user);
    });
});


router.delete('/:id', (req, res) => {
  var _id = mongoose.Types.ObjectId(req.params.id);
    User.remove({
        _id: _id
    }, function(err, user) {
        if (err || !user) {
            console.error("Could not delete user", request.body.username);
            mongoose.disconnect();
            return;
        }
        console.log("Deleted user", user.result);
        res.status(201).json(user);
    });
})











module.exports = router;