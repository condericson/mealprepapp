var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

var should = chai.should();

chai.use(chaiHttp);


// Recipe Tests

//Recipe POST, PUT, and DELETE
describe('creation, editing, and delete of recipe', function() {
  var workingId = "";
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should add a recipe on POST', function() {
  const newRecipe = {
    title: "Test Lasagna",
    userId: "58c712cb0a63582330158ceb",
    image: "./public/images/platecover.png",
    totalTime: "20 min",
    sourceRecipeUrl: "",
    day: "monday",
    instructions: "Test this recipe",
    ingredients: [
      "pasta",
      "tomatoes",
      "love"
    ]
  };
  return chai.request(app)
    .post('/recipes')
    .send(newRecipe)
    .then(function(res) {
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
      workingId = res.body._id;
    })
    .catch(function(err) {
      console.log("RECIPE POST TEST ERR", err);
    })

  });

  it('should update recipes on PUT', function() {
    const updateData = {
      title: "Test Lasagna2",
      userId: "j:\"58c712cb0a63582330158ceb\"",
      image: "./public/images/platecover.png",
      totalTime: "21 min",
      sourceRecipeUrl: "",
      day: "tuesday",
      instructions: "Test this recipe again",
      ingredients: [
        "pasta",
        "tomatoes",
        "love",
        "more love"
      ]
    };
    return chai.request(app)
      .put(`/recipes/` + workingId)
      .send(updateData)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
      });
  });

  it('should delete recipe on DELETE', function() {
    return chai.request(app)
    .delete(`/recipes/` + workingId)
    .then(function(res) {
      res.should.have.status(201);
    });
  });
});





// User Tests


//User POST, GET, PUT, and DELETE
describe('Users', function() {
  var userId = "";
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should create a user on POST', function() {
    const newUser = {
      username: "test user",
      password: "test password",
      chefName: "Test McTester"
    }
  console.log(newUser);

    return chai.request(app)
      .post('/users')
      .send(newUser)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(
            '_id', 'username', 'chefName', 'password', '__v');
        userId = res.body._id;
        console.log("LOG OF ID", res.body._id)
      })
      /*.catch(function(err) {
        console.log("CAUGHT ERR", err);
      });*/
  });
  it('should return specific user on GET', function() {
    return chai.request(app)
      .get('/users/' + userId)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(
          '_id', 'username', 'chefName', 'password', '__v');
      });
  });

  it('should update user on PUT', function() {
    const updatedUser = {
      username: "test user's brother",
      password: "test password's password",
      chefName: "Test Tester McFaceTest"
    };
    return chai.request(app)
      .put(`/users/` + userId)
      .send(updatedUser)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
      });
  });

  it('should delete specific user on DELETE', function() {
    return chai.request(app)
      .delete('/users/' + userId)
      .then(function(res) {
        res.should.have.status(201);
      })
  })
});


