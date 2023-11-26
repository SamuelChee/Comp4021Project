// metalmayhemUI.js

// Set the page title
document.title = 'Metal Mayhem';

// Display error messages
function showError(message) {
const errorElement = document.getElementById('error-message');
errorElement.textContent = message;
errorElement.style.display = 'block';
}

// Hide error messages
function hideError() {
const errorElement = document.getElementById('error-message');
errorElement.style.display = 'none';
}

// Successful registration
function handleRegistrationSuccess() {
const successMessage = 'Registration successful. You can now sign in.';
showError(successMessage);
}

// Successful login
function handleLoginSuccess() {
// Go to Gaming Page!!
window.location.href = 'gaming.html';
}

// Handle form submission
function handleSubmit(event) {
event.preventDefault(); // Prevent form submission

// Get username and password
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;

hideError();

// Determine whether it's a registration or login form
const isRegistrationForm = event.target.id === 'signup-form';

// Valid Check
if (username.trim() === '' || password.trim() === '') {
showError('Username and password are required');
return;
}

// Communicate with the server 
if (isRegistrationForm) {
Registration.register(username, password, handleRegistrationSuccess, showError);
} else {
Authentication.signin(username, password, handleLoginSuccess, showError);
}
}

// Form submissions with listener
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', handleSubmit);

const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', handleSubmit);

// UI here

// Get the login/signup container element
//Add the login-signup-container in HTML please <-- and the css 
const loginSignupContainer = document.getElementById('login-signup-container');


const titleElement = document.createElement('h1');
titleElement.textContent = 'Metal Mayhem';

// Login form here
const loginFormElement = document.createElement('form');
loginFormElement.id = 'login-form';

// Signup form here
const signupFormElement = document.createElement('form');
signupFormElement.id = 'signup-form';
signupFormElement.style.display = 'none';

// Put those form into the container
loginSignupContainer.appendChild(titleElement);
loginSignupContainer.appendChild(loginFormElement);
loginSignupContainer.appendChild(signupFormElement);

// Show the sign-up form
function showSignUpForm() {
loginFormElement.style.display = 'none';
signupFormElement.style.display = 'block';
}

// Show the login form 
function showLoginForm() {
signupFormElement.style.display = 'none';
loginFormElement.style.display = 'block';
}

// Sign-up link with listener
const signUpLink = document.getElementById('sign-up-link');
signUpLink.addEventListener('click', showSignUpForm);

// Login link with listener
const loginLink = document.getElementById('login-link');
loginLink.addEventListener('click', showLoginForm);
