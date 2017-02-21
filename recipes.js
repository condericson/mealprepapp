const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {Recipes} = require('./models/recipeModel');

const jsonParser = bodyParser.json();
router.use(morgan('common'));

router.get('/', (req,res) => {
	Recipes.find(function(err, recipe) {
		if(err) {
			res.status(500).json({"message": "Error!"});
		}
		res.status(201).json(recipe);
	})
});

router.post('/', jsonParser, (req, res) => {
	/*const requiredFields = ['title','ingredients','instructions', 'cookware','userid','date'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
      		console.error(message);
      		return res.status(400).send(message);
		}
	}*/
	Recipes.create({
		'title': req.body.title,
		'ingredients': req.body.ingredients,
		'instructions': req.body.instructions,
		'cookware': req.body.cookware,
        'day': req.body.day
	}, function(err, recipe){
		if(err) {
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
        cookware: req.body.cookware,
        instructions: req.body.instructions,
        ingredients: req.body.ingredients,
        day: req.body.day
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