const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const USER_COOKIE_NAME = 'meal-prep-app';

const {User} = require('./models/userModel');






const jsonParser = bodyParser.json();
router.use(morgan('common'));
router.use(cookieParser());

router.get('/', (req,res) => {
  User.find(function(err, user) {
    if(err) {
      res.status(500).json({"message": "Error!"});
    }
    res.status(201).json(user);
  })
});


router.get('/:id', (req, res) => {
  var _id = mongoose.Types.ObjectId(req.params.id);
  User.findOne({
    _id: _id
  }, function(err, user){
    if(err) {
      res.status(500).json({"message":"Username not found"})
    }
    res.status(201).json(user);
  });
});




router.get('/logout/logout', (req, res) => {
  res.clearCookie("meal-prep-app");
  res.status(201).json({"message":"logging out"})
});





router.post('/', jsonParser, (req, res) => {
  let password = req.body.password;
  bcryptjs.genSalt(10, function(err, salt) {
    if(err) {
      res.status(500).json({"message": "Error with salt"})
    }
    bcryptjs.hash(password, salt, function(err, hash) {
      if(err) {
        res.status(500).json({"message": "Error with encryption"})
      }
      User.create({
        'username': req.body.username,
        'password': hash,
        'chefName': req.body.chefName
      }, function(err, user){
        if(err) {
          res.status(500).json({"message":"Error with user creation"})
        }
        res.status(201).json(user);
      });
    });
  })

});



router.post('/login', jsonParser, async (req, res) => {
  console.log(req.body);
  let enteredpassword = req.body.password;
  try {
    const user = await User.findOne({'username': req.body.username});
    console.log("HERE IS USER", user);
    if(!user){
      res.status(500).json({"message":"Incorrect username or password"});
     }
     if(bcryptjs.compareSync(enteredpassword, user.password)) {
         res.cookie(USER_COOKIE_NAME, user._id, {});
         res.status(201).json({"message":"Password accepted"})
     }
  } catch (error) {
    console.log("Error with login:", error);
    return res.status(500).json({error})
  }
  // User.findOne({
  //    'username': req.body.username
  //  }, function(err, user){
  //    if(err) {
  //    res.status(500).json({"message":"Invalid...."})
  //      return;
  //    }
  //    if(!user){
  //     res.status(500).json({"message":"Incorrect username or password"});
  //    }
  //    if(bcryptjs.compareSync(enteredpassword, user.password)) {
  //        res.cookie(USER_COOKIE_NAME, user._id, {});
  //        res.status(201).json({"message":"Password accepted"})
  //    }
  //  });
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
