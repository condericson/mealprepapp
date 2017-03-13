var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

var should = chai.should();

chai.use(chaiHttp);


describe('Recipes', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
   it('should list recipes on GET', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'title', 'ingredients', 'instructions', 'userId', 'day', 'image', 'sourceRecipeUrl', 'totalTime', '_id', '__v', 'date');
        });
      });
  });
});





/*describe('index page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});*/

/*describe('Users', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should list users on GET', function() {
    return chai.request(app)
      .get('/users')
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'id', 'username', 'chefName', 'password');
        });
      });
  });
});*/


describe('creation, editing, and delete of recipe', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should add a recipe on POST', function() {
  const newRecipe = {
    title: "Test Lasagna",
    userId: "j:\"58c712cb0a63582330158ceb\"",
    image: "./public/images/platecover.png",
    totalTime: "20 min",
    sourceRecipeUrl: "",
    day: "monday",
    instructions: "Test this recipe",
    ingredients: [
      "pasta",
      "tomatos",
      "love"
    ]
  };
  return chai.request(app)
    .post('/recipes')
    .send(newRecipe)
    .then(function(res) {
 			console.log(res.body);
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.include.keys(
      	"_id", 
      	"title",
      	"userId",
      	"image",
      	"totalTime",
      	"__v",
      	"sourceRecipeUrl",
    		"day",
    		"date",
    		"instructions",
    		"ingredients"
    	);
      res.body._id.should.not.be.null;
    });
	});
/*
  it('should update recipes on PUT', function() {
    const updateData = {
      name: 'foo',
      checked: true
    };
    return chai.request(server)
      // first have to get so we have an idea of object to update
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(server)
          .put(`/shopping-list/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateData);
      });
  });*/




});


/*

it('should add an item on POST', function() {
  const newItem = {name: 'coffee', checked: false};
  return chai.request(server)
    .post('/shopping-list')
    .send(newItem)
    .then(function(res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.include.keys('id', 'name', 'checked');
      res.body.id.should.not.be.null;
      // response should be deep equal to `newItem` from above if we assign
      // `id` to it from `res.body.id`
      res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
    });
});


it('should update items on PUT', function() {
    const updateData = {
      name: 'foo',
      checked: true
    };
    return chai.request(server)
      // first have to get so we have an idea of object to update
      .get('/shopping-list')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(server)
          .put(`/shopping-list/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateData);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(server)
      // first have to get so we have an `id` of item
      // to delete
      .get('/shopping-list')
      .then(function(res) {
        return chai.request(server)
          .delete(`/shopping-list/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });








*/



console.log('test');

/*

describe('User Creation', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  var newUser = {
    'username': 'test',
    'password': 'testpassword',
    'chefName': 'Tester Smith'
  }
  $.ajax({
     type: "POST",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     data: JSON.stringify(newUser),
     success: function(data){
     	console.log(data);
     	console.log('success');
     },
     error: function(err) {
     	console.log('Error');
     	console.log(err);
     }
	});
   it('should list recipes on GET', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'title', 'ingredients', 'instructions', 'userId', 'day', 'image', 'sourceRecipeUrl', 'totalTime', '_id', '__v', 'date');
        });
      });
  });


   $.ajax({
     type: "DELETE",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     success: function(data){
     	$('.clearOnDrop').html("");
			fillWeeklyView();
     	fillMyRecipes();
      console.log('success');

     },
     error: function(err) {
     	console.log('Error');
     	console.log(err);

     }
	});

});





var newUser = {
    'username': 'test',
    'password': 'testpassword',
    'chefName': 'Tester Smith'
  }
  $.ajax({
     type: "POST",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     data: JSON.stringify(newUser),
     success: function(data){
     	console.log(data);
     	console.log('success');
     },
     error: function(err) {
     	console.log('Error');
     	console.log(err);
     }
	});







$.ajax({
     type: "DELETE",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     success: function(data){
     	$('.clearOnDrop').html("");
			fillWeeklyView();
     	fillMyRecipes();
      console.log('success');

     },
     error: function(err) {
     	console.log('Error');
     	console.log(err);

     }
	});*/