let username;
let password;

document.getElementById('login_form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the username from the form
     username = document.getElementById('username_div').value;
     password = document.getElementById('password_div').value;
     globalThis.username = username;

    // Display a welcome message
    let welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.innerHTML = `Welcome, ${username}!`;
    welcomeMessage.style.display = 'block';

    // Show the entries container and the forms
    document.getElementById('entries-container').style.display = 'block';
    document.querySelector('.form_container').style.display = 'block';
    
    // Optionally, hide the login form after submission
//    document.getElementById('login-container').style.display = 'none';

});


window.printUserData = function(){
    console.log(username,password); 
}

console.log(username);

