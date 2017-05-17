const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {Recipes} = require('./models/recipeModel');

const jsonParser = bodyParser.json();
router.use(morgan('common'));

// router.get('/', (req,res) => {
// 	Recipes.find(function(err, recipe) {
// 		if(err) {
// 			res.status(500).json({"message": "Error!"});
// 		}
// 		res.status(201).json(recipe);
// 	})
// });

router.get('/:id', async (req, res) => {
    var _id = mongoose.Types.ObjectId(req.params.id);
    console.log("getting"); 
  try {
    const recipe = await Recipes.find({ _id: _id })
    res.status(201).json(recipe);
    console.log(recipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.log(e.message);
  }
});

router.post('/', jsonParser, (req, res) => {
    console.log("here is the req", req.body);
    Recipes.create({
		'title': req.body.title,
		'ingredients': req.body.ingredients,
		'instructions': req.body.instructions,
        'userId': req.body.userId,
        'day': req.body.day,
        'image': req.body.image,
        'sourceRecipeUrl': req.body.sourceRecipeUrl,
        'totalTime': req.body.totalTime
	}, function(err, recipe){
		if(err) {
            console.log(err);
			res.status(500).json({"message":"Error with post"})
		}
		res.status(201).json(recipe);
	})
})

router.put('/:id', jsonParser, function(req, res) {
	var _id = mongoose.Types.ObjectId(req.params.id);
    Recipes.findOneAndUpdate({
      _id: _id
    },
    {
      $set: {
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        userId: req.body.userId,
        day: req.body.day,
        image: req.body.image,
        sourceRecipeUrl: req.body.sourceRecipeUrl,
        totalTime: req.body.totalTime
      }
    },
    {
      new: true
    },
    function(err, recipe) {
        if (err || !recipe) {
            console.error("Could not update recipe", req.body.name);
            mongoose.disconnect();
            if (err) {
                return resp.status(500).json({
                    message: 'Internal Server Error'
                })
            }
        }
        console.log("Updated recipe", recipe.name);
        res.status(201).json(recipe);
    });
});


router.delete('/:id', (req, res) => {
	var _id = mongoose.Types.ObjectId(req.params.id);
    Recipes.remove({
        _id: _id
    }, function(err, recipe) {
        if (err || !recipe) {
            console.error("Could not delete recipe", request.body.name);
            mongoose.disconnect();
            return;
        }
        console.log("Deleted recipe", recipe.result);
        res.status(201).json(recipe);
    });
})











module.exports = router;
