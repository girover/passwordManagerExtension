// content.js

// Checks for password inputs and sends a message.
//document.addEventListener('DOMContentLoaded', function() {
    var inputs = document.querySelectorAll('input[type="password"]');
    if (inputs.length > 0) {
        chrome.runtime.sendMessage({passwordFound: true});
    } else {
        chrome.runtime.sendMessage({passwordFound: false});
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        
        if (request.type == 'fillPassword') {
            var passwordInput = document.querySelector('input[type="password"]');
            passwordInput.value = request.data.password;
        }
    });
//});




