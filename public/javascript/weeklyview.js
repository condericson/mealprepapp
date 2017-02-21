/*const moment = require('moment');*/
$(document).ready(function() {

var state = {
	currentUser: ""
}



$.ajax({
     type: "GET",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: '/recipes',
     success: function(data){
       data.forEach(function(element) {
       	var assignedColumn = $('#' + element.day.toLowerCase());
       	var html = '<div class="recipecontainer">';
       	if(element.image) {
					html += '<img class="recipeImage" src="' + element.image + '">';
        }
        html += '<p class="recipeName">' + element.title + '</p>' + '</div>';
        assignedColumn.append(html);
      });
    },
    error: function(data) {
    	console.log('error');
    }
	});



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


//Yummly API code
$('#js-yummly-search').submit(function(event) {
	event.preventDefault();
	var searchTerm = $('#yummlysearch').val();
	console.log("Looking for recipes that contain", searchTerm);
	var url = "http://api.yummly.com/v1/api/recipes";
	var yummlyApp = {
		"_app_id": '1215d699',
		"_app_key": '8d66fe539bd68dfea2ac78d0e6ef6b6f',
		"q": searchTerm.toLowerCase(),
		'requirePictures': 'true'
	};
	$.getJSON(url, yummlyApp, function(data) {
		console.log(data);
		var results = data.matches;
		results.forEach(function(object){
			$('#yummlyApiRecipe').append(
			'<div class="recipecontainer">' + 
				'<img class="recipeImage" src="' + object.smallImageUrls[0] + '">' +
				'<p class="recipeName">' + object.recipeName + '</p>' + 
				'<div class="idDiv"><p class="hidden recipeId">' + object.id + '</p></div></div>' + 
			'</div>'
			);
		});
		
	});
});

//Displays recipe information in modal 
$('#yummlyApiRecipe').on('click', '.recipecontainer', function(event) {
	//Open the modal
	var modal = document.getElementById('recipeInfoModal');
	modal.style.display = "block";

	//Get recipe specific info
	var recipeId = $(this).children($('.idDiv')).children($('.recipeId')).text();
	recipeId = recipeId.replace(/\s+/g, '-')
	console.log("Looking for recipe with ID", recipeId);
	var url = "http://api.yummly.com/v1/api/recipe/" + recipeId;
	console.log(url);
	var yummlyApp = {
		"_app_id": '1215d699',
		"_app_key": '8d66fe539bd68dfea2ac78d0e6ef6b6f'
	};
	$.getJSON(url, yummlyApp, function(data) {
		console.log(data);
		//Put recipe info into modal
		var ingredientLines = data.ingredientLines;
		var ingredients = '';

		ingredientLines.forEach(function(value) {
			ingredients += '<li class="ingredientItem">' + value + '</li>'
		});
		$('#recipeInfo').html(
			'<span class="close">&times;</span>' + 
			'<img class="modalRecipeImage" src="' + data.images[0].hostedLargeUrl + '">' +
			'<p class="insideModalRecipeName">' + data.name + '</p>' +
			'<ul>' + ingredients + '</ul>' +
			'<a href="' + data.source.sourceRecipeUrl + ' target="_blank"><p class="yummlyAttribution">' + data.attribution.text + '</p></a>'
			);
	});
});


//Recipe info modal JS
$('#recipeInfo').on('click', '.close', function(event) {
	var modal = document.getElementById('recipeInfoModal');
	modal.style.display = "none"
})

window.onclick = function(event) {
  var modal = document.getElementById('recipeInfoModal'); 
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


//Drag and drop JS
//NEED TO FIND A WAY TO ADD RECIPES TO DATABASE ON DROP!

$( ".recipecontainer" ).draggable({
	helper: 'clone',
 	revert: 'invalid'
});
$( ".recipeByDay" ).droppable({
	activeClass: "ui-state-default",
  hoverClass: "ui-state-hover",
  drop: function( event, ui ) {
  	var newClone = $(ui.helper).clone();
  	newClone.css("position", "static");
  	newClone.addClass('inDayColumn');
    $(this).after(newClone);
  }
});

/*$(function() {
    $(".draggable img").draggable({ 
        revert: "invalid",
        helper: "clone" 
    });   
    $("#droppable").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        drop: function(event, ui) {
            var newClone = $(ui.helper).clone();
            $(this).after(newClone);
        }
	});
});*/





//dropdown 
$("#dropdown-button").on('click', function(event) {
  $('#dropdown').toggle("show");

});


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-button')) {
    var dropdowns = $(".dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}







});//document.ready end


	




/*

all days of week in array
moment.js figure out what day it is

how many days forward and backward
build calendar with moment
attach day with moment
fill in each div based on what day of week recipe is for*/
