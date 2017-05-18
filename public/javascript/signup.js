$(document).ready(function() {


$('.login').on('click', function(event) {
  window.location.href = "/login"
})




$('.signupform').on('submit', function(event) {
	event.preventDefault();
  $('#invalid').addClass('hidden');
  $('#alreadytaken').addClass('hidden');
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
  $('.entrybutton').html('<i class="fa fa-spinner fa-pulse fa-1x" aria-hidden="true"></i>');
	addUser(user);
});

function addUser(user) {
  var url = '/users';
  var usercredentials = user;
	$.ajax({
    type: "POST",
    dataType: "json",
    crossdomain: true,
    headers: {"Access-Control-Allow-Origin": "*"},
    contentType: "application/json; charset=utf-8",
    url: url,
    data: JSON.stringify(user),
    success: function(data){
      var userInfo = {
        "username": data.username,
        "password": usercredentials.password
      }
      logIn(userInfo);
    },
    error: function(data) {
    	console.log("Invalid user or user already taken.");
      $('#alreadytaken').removeClass('hidden');
      $('.entrybutton').html("Let's get preppin'!");
      $('input').val('');
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


$('.signup').click(function() {
    $('html,body').animate({
        scrollTop: $(".signupform").offset().top},
        'slow');
});

});//document.ready end
