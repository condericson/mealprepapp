/*const moment = require('moment');*/

var state = {
	currentUser: "",
	recipesInWeek: [],
	recipesInSearchResults: [],
	myRecipes: []
}

$(document).ready(function() {





//Fill weekly view on log in
$.ajax({
     type: "GET",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: '/recipes',
     success: function(data){
     	if($.cookie('meal-prep-app')){
     		var user = $.cookie('meal-prep-app');
     	}
     	/*state.recipesInWeek = data;
       data.forEach(function(element) {
       		var assignedColumn = $('#' + element.day.toLowerCase());
	       	var html = '<li  class="inDayColumn"><div class="recipecontainer">';
	       	if(element.image) {
						html += '<img class="recipeImage" src="' + element.image + '">';
	        }
	        if(element.title.length > 30) {
	        	var shortenedName = element.title.substring(0,30);
	        	html += '<p class="recipeName">' + shortenedName + '...</p>' + '</div>';
	        }
	        if(element.title.length <= 30) {
	        	html += '<p class="recipeName">' + element.title + '</p>' + '</div></li>';
	        }
	        assignedColumn.append(html);
       	
      });*/
    },
    error: function(data) {
    	console.log('error');
    }
	});





$('#logout').on('click', function(event) {
	$.ajax({
     type: "GET",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: '/users/logout',
     success: function(data){
      console.log('success');
      console.log($.cookie(`meal-prep-app`));
      window.location.href = 'index.html';
     },
     error: function(err) {
     	console.log(err);
     }
	});
})









//event listener that is attached to each day column and will assign a day to DOM in recipe entry modal
$('.addARecipeButton').on('click', function(event) {
	var	assignedDay = $(this).siblings('.weekday').text();
	assignedDay = assignedDay.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
  });
  $('#assignedDay').text(assignedDay);
  $('#recipeEntryModal').removeClass('hidden');
  $('#recipeEntryModal').parent().removeClass('hidden');
  $('#yummlyApiRecipe ,#recipeInfoModal ,#myRecipeModal').addClass('hidden');
  
});


$('#findARecipeButton').on('click', function(event) {
	$('#yummlyApiRecipe').removeClass('hidden');
})

$('.recipecontainer').on('click', function(event) {
	$('#recipeInfo').removeClass('hidden');
})












//Adds a recipe to the database from the recipe entry modal
$('#js-recipe-submit').click(function(event) {
	console.log("adding recipe");
	var ingredients = [];
	$('.ingredientEntry').each(function(index, element) {
		if(element.value.length > 0){
			ingredients.push(element.value);	
		}
	});
	console.log(ingredients);
	var recipe = {
		"title": $('#title').val(),
		"ingredients": ingredients,
		"instructions": $('#instructions').val(),
		"day": $('#assignedDay').text(),
		"image": "./public/images/platecover.png"
	};
	addRecipe(recipe);
});

$('#addIngredient').click(function(event) {
	$('#ingredientList').append('<li><input type="text" name="ingredient"></li>');
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
       	location.reload();
     },
     error: function(data) {
     	console.log('error');
     }
	});
}












//Yummly API code with search
$('#js-yummly-search').submit(function(event) {
	event.preventDefault();
	$('#yummlyResults').append('<p>Looking for some awesome recipes!</p>');
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
		var results = data.matches;
		state.recipesInSearchResults = data.matches;
		var html = "";
		results.forEach(function(object){
			html += '<li class="inBinModal">' + 
				'<div class="recipecontainer">' + 
					'<img class="recipeImage" src="' + object.smallImageUrls[0] + '">' +
					'<p class="recipeName">' + object.recipeName + '</p>' + 
					'<div class="idDiv"><p class="hidden recipeId">' + object.id + '</p></div></div>' + 
				'</div>' + 
			'</li>';
			
			
		});
		$('#yummlyResults').html(html);
		$("li", "#yummlyResults").draggable({
				helper: 'clone',
			 	revert: 'invalid'
			});
	});
});












//Displays recipe information for recipes in yummly search results ONLY
$('#yummlyApiRecipe').on('click', '.recipecontainer', function(event) {
	//Open the modal
	$('#recipeInfo').removeClass('hidden');

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
			'<a href="' + data.sourceRecipeUrl + '" target="_blank"><p class="yummlyAttribution">Checkout the recipe instructions, powered by Yummly!</p></a>'
			);
	});
});





















//My Recipes button opens modal and fills with all recipes in the database
$('#browseRecipesButton').on('click', function(event) {
	$('#myRecipeModal').removeClass('hidden');
  $('#yummlyApiRecipe ,#recipeInfoModal ,#recipeEntryModal ,#groceryListModal').addClass('hidden');
	//Fill modal with recipes from user
	$.ajax({
     type: "GET",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: '/recipes',
     success: function(data){
      $('#myRecipes').html("");
       data.forEach(function(element) {
       	var html = '<li class="inBinModal"><div class="recipecontainer">';
       	if(element.image) {
					html += '<img class="recipeImage" src="' + element.image + '">';
        }
        if(element.title.length > 30) {
        	var shortenedName = element.title.substring(0,30);
        	html += '<p class="shortenedName">' + shortenedName + '...</p><p class="recipeName hidden">' + element.title + '</p>' + '</div>';
        }
        if(element.title.length <= 30) {
        	html += '<p class="recipeName">' + element.title + '</p>' + '</div></li>';
        }
        $('#myRecipes').append(html);
      });
      
    },
    error: function(data) {
    	console.log('error');
    }
	});
});






//Provides recipe information in recipeinfo modal on click of recipe container within myRecipes ONLY
$('#myRecipeModal').on('click', '.recipecontainer', function(event) {
	//Open the modal
	$('#recipeInfo').removeClass('hidden');
	//Get recipe title from p element
	var recipeTitle = $(this).children('.recipeName').text();
	console.log(recipeTitle);

	$.ajax({
     type: "GET",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: '/recipes',
     success: function(data){
     	console.log("Recipe GET successful");
     	
     	console.log(data);
	    data.forEach(function(element) {
	     	if(recipeTitle == element.title) {
	     		var ingredientLines = element.ingredients;
					var ingredients = '';
					ingredientLines.forEach(function(value) {
						ingredients += '<li class="ingredientItem">' + value + '</li>'
					});
					var html = '<span class="close">&times;</span>' + 
						'<img class="modalRecipeImage" src="' + element.image + '">' +
						'<p class="insideModalRecipeName">' + element.title + '</p>' +
						'<ul>' + ingredients + '</ul>' + 
						'<p class="instructions">' + element.instructions + '</p>'
					if(element.sourceRecipeUrl.length > 0) {
						html += '<a href="' + element.sourceRecipeUrl + '" target="_blank"><p class="yummlyAttribution">Checkout the recipe instructions, powered by Yummly!</p></a>'
					};
	     		$('#recipeInfo').html(html);
       };
     })
     },
     error: function(data) {
     	console.log('error');
     }
	});
});











//Provides recipe information in recipeinfo modal on click of recipe container within weekly columns ONLY
$('.recipeByDay').on('click', '.recipecontainer', function(event) {
	//Open the modal
	$('#recipeInfo').removeClass('hidden');
	//Get recipe title from p element
	var recipeTitle = $(this).children('.recipeName').text();
	console.log(recipeTitle);

	$.ajax({
     type: "GET",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: '/recipes',
     success: function(data){
     	console.log("Recipe GET successful");
     	
     	console.log(data);
	    data.forEach(function(element) {
	     	if(element.title.length > 30) {
	     		var shortenedName = element.title.substring(0,30)
	     	}
	     	if(recipeTitle == element.title || recipeTitle == shortenedName) {
	     		var ingredientLines = element.ingredients;
					var ingredients = '';
					ingredientLines.forEach(function(value) {
						ingredients += '<li class="ingredientItem">' + value + '</li>'
					});
					var html = '<span class="close">&times;</span>' + 
						'<img class="modalRecipeImage" src="' + element.image + '">' +
						'<p class="insideModalRecipeName">' + element.title + '</p>' +
						'<ul>' + ingredients + '</ul>' + 
						'<p class="instructions">' + element.instructions + '</p>'
					if(element.sourceRecipeUrl.length > 0) {
						html += '<a href="' + element.sourceRecipeUrl + '" target="_blank"><p class="yummlyAttribution">Checkout the recipe instructions, powered by Yummly!</p></a>'
					};
	     		$('#recipeInfo').html(html);
       };
     })
     },
     error: function(data) {
     	console.log('error');
     }
	});
});




















//Hides the modal the clicked close button is in.
$('div').on('click', '.close', function(event) {
	$(this).parent('div').addClass('hidden');
});

$('#entryclose').on('click', function(event) {
	 $('.greybackground').addClass('hidden');
});















//Drag and drop JS
$("li", "#yummlyResults").draggable({
	helper: 'clone',
 	revert: 'invalid',
 	containment: "document"
});

$(".recipeByDay")/*.find("ul")*/.droppable({
	activeClass: "ui-state-default",
	hoverClass: "ui-state-hover",
	drop: function( event, ui ) {
	  	var newClone = $(ui.helper).clone();
	  	newClone.css("position", "static");
	  	newClone.addClass('inDayColumn');
	  	var list = $(this).find('ul');
	    list.append(newClone);
	    var id = ui.draggable.first().children(":first").find(".idDiv").find("p").text();
	    var day = list.attr("id");
	 		updateOnDrop(id, day);
  }
});


function updateOnDrop(id, day) {
	var recipes = state.recipesInSearchResults;
	var recipe;
	recipes.forEach(function(element) {
		if(id == element.id) {
			recipe = element;
			return;
		}
	});
	var image = recipe.imageUrlsBySize["90"];
	recipeObject = {
		"title": recipe.recipeName,
		"ingredients": recipe.ingredients,
		"day": day,
		"image": image,
	};
	
	$.ajax({
     type: "POST",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: "/recipes",
     data: JSON.stringify(recipeObject),
     success: function(data){
       console.log('success');
     },
     error: function(data) {
     	
     	console.log('Error');
     }
	});
};


//Need to add get function for myRecipeModal









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








//To make grocery list
$('#groceryListButton').on('click', function(event) {
  	$('#yummlyApiRecipe ,#recipeInfoModal ,#recipeEntryModal ,#myRecipeModal').addClass('hidden');
		var recipes = state.recipesInWeek;
		var list = [];
		recipes.forEach(function(element) {
			list = list.concat(element.ingredients);
		})
		var html = "";
		list.forEach(function(element) {
			html += '<li>' + element + '</li>';
		})
		$('#groceryList').html(html);
		$('#groceryListModal').removeClass('hidden');
})











});//document.ready end


	




/*

all days of week in array
moment.js figure out what day it is

how many days forward and backward
build calendar with moment
attach day with moment
fill in each div based on what day of week recipe is for*/
