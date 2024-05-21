document.addEventListener('DOMContentLoaded', function () {

    var loginForm = document.getElementById('login-form');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        var username = usernameInput.value;
        var password = passwordInput.value;
        /**
         * Check if the username and password are correct.
         * This will be a simulation of a login request to the server.
         * In a real-world scenario, you would send the username and password to the server
         * but the pm_token must be the same of the user on the server.
         */
        if(username === 'majed' && password === '1234'){
            chrome.runtime.sendMessage({login: true});
            await chrome.storage.local.set({pm_token:'1234'});
            const data = await chrome.storage.local.get('pm_token');
            console.log(data.pm_token);
            window.location.href = 'popup.html';
        }
    });

});




