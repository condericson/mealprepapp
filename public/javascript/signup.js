$(document).ready(function() {

$('#js-signup-button').click(function(event) {
	event.preventDefault();
     console.log("adding user");
	var user = {
		"username": $('#username').val(),
		"password": $('#password').val(),
		"chefName": $('#chefName').val()
	}	
	addUser(user);
});

function addUser(user) {
     var url = '/users';
	console.log(url);
	$.ajax({
          type: "POST",
          dataType: "json",
          crossdomain: true,
          headers: {"Access-Control-Allow-Origin": "*"},
          contentType: "application/json; charset=utf-8",
          url: url,
          data: JSON.stringify(user),
          success: function(data){
            console.log(data);
            window.location.href = "/index";
          },
          error: function(data) {
          	console.log('ajax broke');
          }
     });
}

});//document.ready end