let username;
let password;
let is_moderator = false;


let logged = false;
is_moderator = false;
globalThis.is_moderator = is_moderator;
import { supabase } from "./script.js";
if (document.cookie) {
    logged = getCookieValue('logged')
    if (logged == 'true') {
        is_moderator = getCookieValue('is_moderator')
        globalThis.is_moderator = is_moderator;
        username = getCookieValue('username')
        password = getCookieValue('password')
    }

}


window.loginUser = async function (username, password) {
    // Query Supabase to check if user exists
    const { data: users, error } = await supabase
        .from('users')  // The table name 'users' is correct
        .select('*')  // Select all columns
        .eq('user_email', username);  // Match the column 'user_email' with the input username

    if (error) {
        console.error('Error fetching user:', error);
        return null
    } else {
        console.log('User found:', users);
    }


    // Check if user exists and if password matches
    if (users[0]) {
        if (users[0].user_password === password) {
            console.log('Login successful');
            return users;  // Return user data if successful
        }
        else {
            console.log('USER OR PASSWORD INCORRECT');
            console.log(users);
            console.log(users[0].user_password);
            console.log(password);
            return 2
        }
    }
}


document.getElementById('login_form').addEventListener('submit', async function (event) {
    event.preventDefault();

    username = document.getElementById('username_div').value;
    password = document.getElementById('password_div').value;


    let welcomeMessage = document.getElementById('welcome-message');
    let user_data = await loginUser(username, password)

    if (user_data && user_data.length > 0) {

        alert(`Bem-vindo, ${user_data[0].user_full_name}!`);
        logged = true;
        console.log('LOGIN INFO:', user_data);
        document.cookie = "username=" + username;
        document.cookie = "password=" + password;
        document.cookie = "is_moderator=" + user_data[0].user_is_moderator;
        document.cookie = "logged=" + logged;
        window.location.reload();

    } else if (user_data == 2) { // password is wrong but user exists
        welcomeMessage.innerHTML = `Incorrect password`;
    } else { // user does not exist
        welcomeMessage.innerHTML = `User does not exist`;
    }
    // Display a welcome message


    welcomeMessage.style.display = 'block';

    // Show the entries container and the forms
    // document.getElementById('entries-container').style.display = 'block';
    //document.querySelector('.form_container').style.display = 'block';


});


window.printUserData = function () {
    console.log(username, password);
}

if (logged == 'true') {
    console.log(logged)
    document.getElementById('password_div').style.display = 'none'
    document.getElementById('username_div').style.display = 'none'
    document.getElementById('login_submit').style.display = 'none'
    document.getElementById('signout_submit').style.display = 'block'
    document.getElementById('user_reg').style.display = 'block'
    document.getElementById('login_form_welcome').style.display = 'block'
    document.getElementById('login_form_welcome').innerHTML = `Welcome, ${username}!`;
    const labels = document.getElementById('login_form').getElementsByTagName('label');
    for (let label of labels) {
        label.style.display = 'none';
    }

}


document.getElementById('signout_submit').addEventListener('click', function () {
    logged = false
    document.cookie = "logged=" + logged;
    location.reload();  // Reloads the page
});
console.log('logged ' + logged)
console.log('username ' + username)
console.log('password ' + password)
console.log('User is moderator? ' + is_moderator)


if (window.location.pathname === "/index.html") {

    if (globalThis.is_moderator == "true"){

    document.getElementById('delete_book').style.display = 'block';
    document.getElementById('add_book').style.display = 'block';
    document.getElementById('rental-form').style.display = 'block';
}
    // Load the first page on initial load
    window.loadPage();
}