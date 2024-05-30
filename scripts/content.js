// content.js


// Checks for password inputs and sends a message.
//document.addEventListener('DOMContentLoaded', function() {
var inputs = document.querySelectorAll('input[type="password"]');
if (inputs.length > 0) {
    chrome.runtime.sendMessage({ passwordFound: true });
} else {
    chrome.runtime.sendMessage({ passwordFound: false });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.type == 'fillPassword') {
        //var passwordInput = document.querySelector('input[type="password"]');
        //passwordInput.value = request.data.password;

        const isUsernameField = (input) => {
            const usernamePatterns = [
                /user(name)?/i,    // Matches 'user' or 'username'
                /login/i,          // Matches 'login'
                /email/i           // Matches 'email'
            ];

            // Check if the input type is email or text
            if (input.type === 'email' || input.type === 'text') {
                const attributes = [input.name, input.id, input.placeholder, input.className];

                // Check each attribute against the username patterns
                for (const pattern of usernamePatterns) {
                    if (attributes.some(attr => pattern.test(attr))) {
                        return true;
                    }
                }
            }

            return false;
        };

        // Function to find the form containing the password input and the username input
        const findLoginForm = () => {
            const passwordFields = document.querySelectorAll('input[type="password"]');

            for (const passwordField of passwordFields) {
                const form = passwordField.closest('form');
                if (form) {
                    const textFields = form.querySelectorAll('input[type="text"], input[type="email"]');
                    const usernameField = Array.from(textFields).find(isUsernameField);

                    if (usernameField) {
                        return { form, usernameField, passwordField };
                    }
                }
            }

            return null;
        };

        const loginForm = findLoginForm();

        if (loginForm) {
            const { form, usernameField, passwordField } = loginForm;

            // Insert your data into the username and password fields
            usernameField.value = request.data.username;
            passwordField.value = request.data.password;
            
            form.submit();
        } else {
            console.log('No login form with both username and password fields found.');
        }
    }
});
//});




