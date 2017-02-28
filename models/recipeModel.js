const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  ingredients: {
    type: Array,
    required: true
  },
  instructions: {
    type: String,
    default: ""
  },
  cookware: {
    type: String,
    default: ""
  },
  userid: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  day: {
    type: String,
    default: "",
    required: true
  },
  image: {
    type: String
  },
  sourceRecipeUrl: {
    type: String,
    default: ""
  }
});

const Recipes = mongoose.model('recipes', RecipeSchema);

module.exports = {Recipes};



/*
{
  'title': 'lasagna',
  'ingredients': ['pasta', 'tomato sauce', 'beef'],
  'instructions': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur nulla alias, iure aliquid ducimus ipsa illo? Reiciendis debitis officiis excepturi. Iusto porro voluptas reprehenderit aut consequatur distinctio neque, quisquam cum!'
  'cookware': 'oven, stuff, pan',
  'userid': 'elrihjo823u42neiukdn283hf',
  'date': 2/14/2017
}
*/