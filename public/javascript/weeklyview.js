var state = {
	currentUser: "",
	recipesInWeek: [],
	recipesInSearchResults: [],
	myRecipes: []
}

$(document).ready(function() {

var cookie = $.cookie('meal-prep-app');

var correctedCookieId = cookie.substring(3, cookie.length - 1);
getChefName(correctedCookieId);


function getChefName(cookie){
	$.ajax({
	type: "GET",
	dataType: "json",
   	crossdomain: true,
   	headers: {"Access-Control-Allow-Origin": "*"},
   	contentType: "application/json; charset=utf-8",
   	url: '/users/' + cookie,
   	success: function(data){
			var name = data.chefName;
			$('#usernameInTitle').text(name);
    },
    error: function(data) {
    	console.log('error');
    }
	})
}

fillWeeklyView();


//Fill weekly view on log in
function fillWeeklyView() {
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
     	state.recipesInWeek = [];
      data.forEach(function(element) {
       	if(user == element.userId && element.day.length > 0) {
       		state.recipesInWeek.push(element);
       		var assignedColumn = $('#' + element.day.toLowerCase());
	       	var html = '<li  class="inDayColumn"><div class="recipecontainer"><div class="infobox"><i class="fa fa-info-circle infoIconDBRecipe" aria-hidden="true"></i><i class="fa fa-trash recipedelete" aria-hidden="true"></i><div class="areyousure hidden"><p class="deletequestion">Remove from the week?</p><div class="remove">Remove</div><div class="no">No</div><div class="triangle"></div></div></div>';
	       	html += '<p class="recipeName">' + element.title + '</p>';
	       	html += '<p class="totalTime">' + element.totalTime + '</p>';
	       	if(element.image) {
						html += '<img class="recipeImage" src="' + element.image + '">';
	        }
	        html += '<div class="ingredientDropDown"><div class="dropdownarrow arrowup"></div>Ingredients</div>';
	        html += '<ul class="fullscreeningredientlist">';
	        element.ingredients.forEach(function(ingredient) {
	        	html += '<li>' + ingredient + '</li>';
	        });
	        html += '</ul>';
	        html += '<a href="' + element.sourceRecipeUrl + '" target="_blank" class="recipeSourceLink"><p class="recipeSource">Recipe instructions</p></a></div></li>';
	        assignedColumn.append(html);
       	}
      });
     },
    error: function(data) {
    	console.log('error');
    }
	});
}






$('#logout').on('click', function(event) {
	$.ajax({
     type: "GET",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: '/users/logout/logout',
     success: function(data){
      console.log('success');
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
  $('#yummlyApiRecipe ,#recipeInfo ,#myRecipeModal').addClass('hidden');

});


$('#findARecipeButton').on('click', function(event) {
	$('#yummlyApiRecipe').removeClass('hidden');
	$('#recipeEntryModal ,#recipeInfo ,#myRecipeModal').addClass('hidden');
	hideDropDown();
})

$('.recipecontainer').on('click', function(event) {
	$('#recipeInfo').removeClass('hidden');
})












//Adds a recipe to the database from the recipe entry modal
$('#js-recipe-submit').click(function(event) {
	if($('.filledout').val().length < 1) {
		$('.titlerequired').removeClass('hidden');
		return console.log('Title absent from entry parameters');
	}
	var ingredients = [];
	$('.ingredientEntry').each(function(index, element) {
		if(element.value.length > 0){
			ingredients.push(element.value);
		}
	});
	var recipe = {
		"title": $('#title').val(),
		"ingredients": ingredients,
		"instructions": $('#instructions').val(),
		"day": $('#assignedDay').text(),
		"image": "./public/images/platecover.png",
		"userId": $.cookie('meal-prep-app'),
		"totalTime": $('.preptimeinput').val()
	};
	addRecipe(recipe);
});

$('#addIngredient').click(function(event) {
	$('#ingredientList').append('<li><input type="text" name="ingredient" class="ingredientEntry" placeholder="i.e. etc"></li>');
	var newli = $(this).siblings('#ingredientList').lastChild;
});

function addRecipe(recipe) {
	var url = '/recipes';
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
	$('#yummlyResults').html('<p class="looking">Looking for some awesome recipes!</p><i class="fa fa-spinner fa-pulse fa-4x" aria-hidden="true"></i>');
	var searchTerm = $('#yummlysearch').val();
	var url = "https://api.yummly.com/v1/api/recipes";
	var yummlyApp = {
		"_app_id": '1215d699',
		"_app_key": '8d66fe539bd68dfea2ac78d0e6ef6b6f',
		"q": searchTerm.toLowerCase(),
		'requirePictures': 'true'
	};
	state.recipesInSearchResults = [];
	$.getJSON(url, yummlyApp, function(data) {
		var results = data.matches;
		state.recipesInSearchResults = data.matches;
		var html = "";
		results.forEach(function(object){
			html += '<li class="draggableItem inBinModal yummlyresult">' +
				'<div class="recipecontainer">' +
				'<i class="fa fa-info-circle infoIconBin" aria-hidden="true"></i>' +
				'<p class="recipeName">' + object.recipeName + '</p>' +
				'<img class="recipeImage" src="' + object.smallImageUrls[0] + '">' +
				'<p class="recipeId hidden">' + object.id + '</p>' +
				'<div class="addToWeek"><p>Day</p><div class="weekoptions hidden"><ul><li class="weekoptionli">Su</li><li class="weekoptionli">M</li><li class="weekoptionli">T</li><li class="weekoptionli">W</li><li class="weekoptionli">Th</li><li class="weekoptionli">F</li><li class="weekoptionli">Sa</li></ul></div></div>' +
				'</div>' +
			'</li>';
		});
		$('#yummlyResults').html(html);
		$(".draggableItem", "#yummlyResults").draggable({
				helper: 'clone',
			 	revert: 'invalid'
			});
	});
});












//Displays recipe information for recipes in yummly search results ONLY
$('#yummlyApiRecipe').on('click', '.infoIconBin', function(event) {
	//Open the modal
	$('#recipeInfo').removeClass('hidden');
	$('#groceryListModal').addClass('hidden');
	var recipeId = $(this).siblings('.recipeId').text();
	var url = "https://api.yummly.com/v1/api/recipe/" + recipeId;
	var yummlyApp = {
		"_app_id": '1215d699',
		"_app_key": '8d66fe539bd68dfea2ac78d0e6ef6b6f'
	};
	$.getJSON(url, yummlyApp, function(data) {
		var ingredientLines = data.ingredientLines;
		var ingredients = '';
		ingredientLines.forEach(function(value) {
			ingredients += '<li class="ingredientItem">' + value + '</li>'
		});
		$('#recipeInfo').html(
			'<span class="close">&times;</span>' +
			'<p class="infoModalRecipeName">' + data.name + '</p>' +
			'<p class="infoModalTotalTime">' + data.totalTime + '</p>' +
			'<img class="modalRecipeImage" src="' + data.images[0].hostedLargeUrl + '">' +
			'<ul>' + ingredients + '</ul>' +
			'<a href="' + data.sourceRecipeUrl + '" target="_blank"><p class="yummlyAttribution">Recipe instructions</p></a>'
			);
	});
});





















//My Recipes button opens modal and fills with all recipes in the database
$('#browseRecipesButton').on('click', function(event) {
	$('#myRecipeModal').removeClass('hidden');
  $('#yummlyApiRecipe ,#recipeInfo ,#recipeEntryModal ,#groceryListModal').addClass('hidden');
	//Fill modal with recipes from user
	fillMyRecipes();
	hideDropDown();
});

function fillMyRecipes() {
	$.ajax({
    type: "GET",
    dataType: "json",
    crossdomain: true,
    headers: {"Access-Control-Allow-Origin": "*"},
    contentType: "application/json; charset=utf-8",
    url: '/recipes',
    success: function(data){
      $('#myRecipes').html("");
      if($.cookie('meal-prep-app')){
     		var user = $.cookie('meal-prep-app');
     	}
     	state.myRecipes = [];
     	var html = "";
      data.forEach(function(recipe) {
       	if(user == recipe.userId) {
       		state.myRecipes.push(recipe);
	       	html += '<li class="draggableItem inBinModal"><div class="recipecontainer"><div class="infobox"><i class="fa fa-info-circle infoIconDBRecipe" aria-hidden="true"></i><i class="fa fa-trash recipedelete" aria-hidden="true"></i><div class="areyousure hidden"><p class="deletequestion">Delete from database?</p><div class="delete">Delete</div><div class="no">No</div><div class="triangle"></div></div></div>';
	       	html += '<p class="recipeName">' + recipe.title + '</p>';
	       	if(recipe.image) {
						html += '<img class="recipeImage" src="' + recipe.image + '">';
	        }
	        if(recipe.day.length > 0) {
	        	var Day = recipe.day.charAt(0).toUpperCase() + recipe.day.slice(1);
						html += '<p class="daymarker">' + Day + '</p>';
	        }
	        html += '<div class="addToWeek"><p>Day</p><div class="weekoptions hidden"><ul><li class="weekoptionli">Su</li><li class="weekoptionli">M</li><li class="weekoptionli">T</li><li class="weekoptionli">W</li><li class="weekoptionli">Th</li><li class="weekoptionli">F</li><li class="weekoptionli">Sa</li></ul></div></div>';
	        html += '</div></li>';
	      	};
	      });
	    $('#myRecipes').append(html);
	    $(".draggableItem", "#myRecipes").draggable({
				helper: 'clone',
			 	revert: 'invalid'
			});
      },
    error: function(data) {
    	console.log('error');
    }
	});
}






//Provides recipe information in recipeinfo modal on click of recipe container within myRecipes ONLY
$('#myRecipeModal').on('click', '.infoIconDBRecipe', function(event) {
	//Open the modal
	$('#recipeInfo').removeClass('hidden');
	$('#groceryListModal').addClass('hidden');
	//Get recipe title from p element
	var recipeTitle = $(this).parent().siblings('.recipeName').text();
	$.ajax({
    type: "GET",
    dataType: "json",
    crossdomain: true,
    headers: {"Access-Control-Allow-Origin": "*"},
    contentType: "application/json; charset=utf-8",
    url: '/recipes',
    success: function(data){
     	console.log("Recipe GET successful");
	    data.forEach(function(element) {
	     	if(recipeTitle == element.title) {
	     		recipeInfoModalFill(element);
      	};
     	})
    },
    error: function(data) {
     	console.log('error');
    }
	});
});











//Provides recipe information in recipeinfo modal on click of recipe container within weekly columns ONLY
$('.recipeByDay').on('click', '.infoIconDBRecipe', function(event) {
	//Open the modal
	$('#recipeInfo').removeClass('hidden');
	$('#groceryListModal').addClass('hidden');
	//Get recipe title from p element
	var recipeTitle = $(this).parent().siblings('.recipeName').text();
	state.recipesInWeek.forEach(function(element) {
		if(recipeTitle == element.title){
			recipeInfoModalFill(element);
		}
	})
});




function recipeInfoModalFill(element) {
	var ingredientLines = element.ingredients;
		var ingredients = '';
		ingredientLines.forEach(function(value) {
			ingredients += '<li class="ingredientItem">' + value + '</li>'
		});
		var html = '<span class="close">&times;</span>' +
			'<p class="infoModalRecipeName">' + element.title + '</p>' +
			'<p class="infoModalTotalTime">' + element.totalTime + '</p>' +
			'<img class="modalRecipeImage" src="' + element.image + '">' +
			'<ul class="infoModalIngredients">' + ingredients + '</ul>' +
			'<p class="instructions">' + element.instructions + '</p>'
		if(element.sourceRecipeUrl.length > 0) {
			html += '<a href="' + element.sourceRecipeUrl + '" target="_blank"><p class="yummlyAttribution">Recipe instructions</p></a>'
		};
 		$('#recipeInfo').html(html);
}















//Hides the modal the clicked close button is in.
$('div').on('click', '.close', function(event) {
	$(this).parent('div').addClass('hidden');
});

$('div').on('click', '.myRecipeClose', function(event) {
	$(this).parent().parent().addClass('hidden');
});

$('#entryclose').on('click', function(event) {
	 $('.greybackground').addClass('hidden');
});




//add to week menu options
$('#myRecipeModal').on('click', '.addToWeek', function(event) {
	$(this).children('.weekoptions').removeClass('hidden');
});

$('#yummlyApiRecipe').on('click', '.addToWeek', function(event) {
	$(this).children('.weekoptions').removeClass('hidden');
});

$('#myRecipeModal').on('click', '.weekoptionli', function(event) {
	clickToAddToDay($(this));
	$(this).parent().addClass('hidden');
});

$('#yummlyApiRecipe').on('click', '.weekoptionli', function(event) {
	clickToAddToDay($(this));
	$(this).parent().addClass('hidden');
});

function clickToAddToDay(selectedDay) {
	var shortenedDay = selectedDay.text().toLowerCase();
	var assignedDay = (function() {
		if(shortenedDay == 'su') {
			return 'sunday';
		}
		if(shortenedDay == 'm') {
			return 'monday';
		}
		if(shortenedDay == 't') {
			return 'tuesday';
		}
		if(shortenedDay == 'w') {
			return 'wednesday';
		}
		if(shortenedDay == 'th') {
			return 'thursday';
		}
		if(shortenedDay == 'f') {
			return 'friday';
		}
		if(shortenedDay == 'sa') {
			return 'saturday';
		}
	}) ();
	var name = selectedDay.parent().parent().parent().siblings('.recipeName').text();
	var parentli = selectedDay.parent().parent().parent().parent().parent();
  var id = "";
  var day = assignedDay;
  if(parentli.hasClass("yummlyresult")) {
  	state.recipesInSearchResults.forEach(function(element) {
	  	if(name == element.recipeName) {
	  		id = element.id;
	  	}
  	})
  	console.log("Drag and drop successful");

  	updateOnDrop(id, day);
  }
  if(!parentli.hasClass("yummlyresult")) {
  	var recipeObject = {};
  	state.myRecipes.forEach(function(element) {
  		if(element.title == name) {
  			recipeObject = {
  				'title': element.title,
					'ingredients': element.ingredients,
					'userId': $.cookie('meal-prep-app'),
					'totalTime': element.totalTime,
					'image': element.image,
					'day': day,
					'sourceRecipeUrl': element.sourceRecipeUrl
  			}
  		}
  	})
  	addToDatabase(recipeObject);
  }
}












//Drag and drop JS
$(".draggableItem", "#yummlyResults").draggable({
	helper: 'clone',
 	revert: 'invalid',
 	containment: "document"
});

$(".draggableItem", "#myRecipes").draggable({
	helper: 'clone',
 	revert: 'invalid',
 	containment: "document"
});

$(".recipeByDay").droppable({
	activeClass: "ui-state-default",
	hoverClass: "ui-state-hover",
	drop: function( event, ui ) {
  	var newClone = $(ui.helper).clone();
  	var list = $(this).children('ul');
    var id = newClone.children('.recipecontainer').children('.recipeId').text();
    var day = list.attr("id");
    var draggedItem = ui.draggable;
    if(draggedItem.hasClass("yummlyresult")) {
    	console.log("Drag and drop successful");
    	updateOnDrop(id, day);
    }
    if(!draggedItem.hasClass("yummlyresult")) {
    	var recipeObject = {};
    	var recipeName = draggedItem.children('.recipecontainer').children('.recipeName').text();
    	state.myRecipes.forEach(function(element) {
    		if(element.title == recipeName) {
    			recipeObject = {
    				'title': element.title,
						'ingredients': element.ingredients,
						'userId': $.cookie('meal-prep-app'),
						'totalTime': element.totalTime,
						'image': element.image,
						'day': day,
						'sourceRecipeUrl': element.sourceRecipeUrl
    			}
    		}
    	})
    	addToDatabase(recipeObject);
    }
  }
});

$('#myRecipeModal').on('dragstart', '.draggableItem', function(event) {
	$('#myRecipeModal').addClass('js-scrollToggle');
})

$('#myRecipeModal').on('mouseup', '.draggableItem', function(event) {
	$('#myRecipeModal').removeClass('js-scrollToggle');
})

$('#yummlyApiRecipe').on('dragstart', '.draggableItem', function(event) {
	$('#yummlyApiRecipe').addClass('js-scrollToggle');
})

$('#yummlyApiRecipe').on('mouseup', '.draggableItem', function(event) {
	$('#yummlyApiRecipe').removeClass('js-scrollToggle');
})



function updateOnDrop(id, day) {
	var recipeId = id;
	var url = "https://api.yummly.com/v1/api/recipe/" + recipeId;
	var yummlyApp = {
		"_app_id": '1215d699',
		"_app_key": '8d66fe539bd68dfea2ac78d0e6ef6b6f'
	};
	$.getJSON(url, yummlyApp, function(data) {
		var recipeObject = {
			'title': data.name,
			'ingredients': data.ingredientLines,
			'userId': $.cookie('meal-prep-app'),
			'totalTime': data.totalTime,
			'image': data.images[0].hostedLargeUrl,
			'day': day,
			'sourceRecipeUrl': data.source.sourceRecipeUrl
		};
		addToDatabase(recipeObject);

	});
}

function addToDatabase(recipeObject) {
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
      $('.clearOnDrop').html("");
		fillWeeklyView();
		fillMyRecipes();
     },
     error: function(err) {
     	console.log('Error');
     	console.log(err);
     }
	});
}


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
      if (openDropdownclassList.contains('show')) {
        openDropdown.classList.remove('show')
        openDropdown.setAttribute("aria-hidden", "true");
      }
    }
  }
}








//To make grocery list
$('#groceryListButton').on('click', function(event) {
  	$('#yummlyApiRecipe ,#recipeInfo ,#recipeEntryModal ,#groceryListModal').addClass('hidden');
		var recipes = state.recipesInWeek;
		var list = [];
		var html = "";
		recipes.forEach(function(element) {
			list = list.concat(element.ingredients);
		})
		list.forEach(function(ingredient) {
			html += '<li><i class="fa fa-square-o" aria-hidden="true"></i> ' + ingredient + '</li>';
		});
		$('#groceryList').html(html);
		$('#groceryListModal').removeClass('hidden');
		hideDropDown();
});









//Are you sure question box functions
$('.recipeByDay').on('click', '.recipedelete', function(event) {
	$(this).siblings($('.areyousure')).removeClass('hidden');
});

$('.recipeByDay').on('click', '.no', function(event) {
	$(this).parent($('.areyousure')).addClass('hidden');
});

$('#myRecipes').on('click', '.recipedelete', function(event) {
	$(this).siblings($('.areyousure')).removeClass('hidden');
});

$('#myRecipes').on('click', '.no', function(event) {
	$(this).parent($('.areyousure')).addClass('hidden');
});
















$('.recipeByDay').on('click', '.remove', function(event) {
	console.log('removing recipe from day');
	var recipeName = $(this).parent().parent().siblings('.recipeName').text();
	var id = "";
	var recipeObject = {};
	state.recipesInWeek.forEach(function(element){
		if(recipeName == element.title) {
			id = element._id;
			recipeObject = {
				'title': element.title,
				'ingredients': element.ingredients,
				'userId': $.cookie('meal-prep-app'),
				'totalTime': element.totalTime,
				'image': element.image,
				'day': "",
				'sourceRecipeUrl': element.sourceRecipeUrl,
				'instructions': element.instructions

			};
		};
	});
	var url = '/recipes/' + id;
	removeDay(url, recipeObject);
	$('.clearOnDrop').html("");
	/*fillWeeklyView();
	fillMyRecipes();*/
	$(this).parent().parent().parent().parent().remove();
})


function removeDay(url, recipeObject) {
	$.ajax({
     type: "PUT",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     data: JSON.stringify(recipeObject),
     success: function(data){
     	console.log(data);
     	console.log('success');
     	fillWeeklyView();
     	fillMyRecipes();
     },
     error: function(err) {
     	console.log('Error');
     	console.log(err);
     }
	});
}





$('#myRecipes').on('click', '.delete', function(event) {
	var recipeName = $(this).parent().parent().siblings('.recipeName').text();
	var id = "";
	state.myRecipes.forEach(function(element){
		if(recipeName == element.title) {
			id = element._id;
		}
	});
	var url = '/recipes/' + id;
	deleteRecipeFromDatabase(url);
	/*$(this).parent().parent().parent().parent().remove();*/
})

function deleteRecipeFromDatabase(url) {
	$.ajax({
     type: "DELETE",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     success: function(data){
     	/*location.reload();*/
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
}

$('.recipeByDay').on('click', '.ingredientDropDown', function(event) {
	$('.dropdownarrow').toggleClass('arrowup');
	$('.dropdownarrow').toggleClass('arrowdown');
	$('.fullscreeningredientlist').toggleClass('displayed');
})

function hideDropDown() {
	document.getElementById('dropdown').style.display = 'none';
}



});//document.ready end
