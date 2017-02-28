$(document).ready(function() {

$('#js-login-form').submit(function(event) {
	event.preventDefault();
    $('#invalid').addClass('hidden');
	console.log("logging in");
    var userInfo = {
		"username": $('#js-username-input').val(),
		"password": $('#js-password-input').val()
	};
	logIn(userInfo);


})

function logIn(userInfo, username) {
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
       console.log('success');
       window.location.href = "/weeklyview";
     },
     error: function(data) {
     	console.log('error', data);
        $('#invalid').removeClass('hidden');
     }
	});
}





$('#js-signup').click(function(event) {
	
})







});//document.ready end