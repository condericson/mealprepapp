$(document).ready(function() {


$('.login').on('click', function(event) {
  window.location.href = "/login"
})




$('.signupform').on('submit', function(event) {
	event.preventDefault();
  console.log("adding user");
  if($('#username').val().length < 1 || $('#password').val().length < 1 || $('#chefName').val().length < 1) {
    $('#invalid').removeClass('hidden');
    return console.log("sign up values not entered");
  }
	var user = {
		"username": $('#username').val(),
		"password": $('#password').val(),
		"chefName": $('#chefName').val()
	}
	addUser(user);
});

function addUser(user) {
  var url = '/users';
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
      var userInfo = {
        "username": data.username,
        "password": data.password
      }
      logIn(userInfo)
    },
    error: function(data) {
    	console.log('ajax broke');
    }
     });
}

function logIn(userInfo) {
  var url = '/users/login';
  $.ajax({
     type: "POST",
     dataType: "json",
     crossdomain: true,
     headers: {"Access-Control-Allow-Origin": "*"},
     contentType: "application/json; charset=utf-8",
     url: url,
     data: JSON.stringify(userInfo),
     success: function(data){
        console.log(data);
        console.log('success');
        event.preventDefault();
        window.location.href = "/weeklyview";
     },
     error: function(data) {
      console.log('error', data);
        $('#invalid').removeClass('hidden');
     }
  });
}

});//document.ready end
