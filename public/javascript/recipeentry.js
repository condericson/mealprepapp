$(document).ready(function() {

$('#js-recipe-submit').click(function(event) {
	console.log("adding recipe");
	var ingredients = [];
	$('ul li').each(function(index, element) {
		var value = $(this).find("input");
		ingredients.push($(value).val());
	});
	console.log(ingredients);
	var recipe = {
		"title": $('#title').val(),
		"cookware": $('#cookware').val(),
		"ingredients": ingredients,
		"instructions": $('#instructions').val()
	}	
	addRecipe(recipe);
});

$('#addIngredient').click(function(event) {
	$('ul').append('<li><input type="text" name="ingredient"></li>');
});

function addRecipe(recipe) {
	var url = '/recipes';
	console.log(url);
	$.ajax({
     type: "POST",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     data: JSON.stringify(recipe),
     success: function(data){
       console.log('success');
     },
     error: function(data) {
     	console.log('error');
     }
	});
}






















});