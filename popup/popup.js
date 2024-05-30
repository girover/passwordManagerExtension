document.addEventListener('DOMContentLoaded', function () {

    const openTab = async (url) => {
        let tab = await chrome.tabs.create({ url: url });
        return tab;
    };
    
    var webAppButton = document.getElementById('btn-web-app');
    var generatorButton = document.getElementById('btn-generator');
    var vaultButton = document.getElementById('btn-vault');
    var logoutButton = document.getElementById('btn-logout');
    var message = document.getElementById('message');
    var searchForm = document.getElementById('search-form');
    var searchInput = document.getElementById('search');
    var tablePasswords = document.getElementById('table-passwords-tbody');

    webAppButton.addEventListener('click', () => {
        
        openTab('http://localhost:3000');
    });
    vaultButton.addEventListener('click', async () => {
        await fetchVauldData();
    });
    generatorButton.addEventListener('click', () => {
        
    });

    logoutButton.addEventListener('click', async () => {
        chrome.storage.local.remove('pm_token');
        window.close();
        chrome.action.setBadgeText({text: ''});
    });

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        await fetchSiteData();
    });

    const fetchSiteData = async () => {
        tablePasswords.innerHTML = '';
        //let url = `http://localhost:3300/api/passwords/site/url/?search=${searchInput.value}`;
        let url = `http://localhost:3300/api/passwords/name/${searchInput.value}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            if (data.data) {

                if(Array.isArray(data.data)){
                    data.data = data.data[0];
                }

                var tr = document.createElement('tr');

                var tdSite = document.createElement('td');
                var tdUsername = document.createElement('td');
                var tdPassword = document.createElement('td');
                var tdSubmitButton = document.createElement('td');
                var submitButton = document.createElement('button');
                submitButton.classList.add('btn', 'btn-sm', 'btn-dark');
                submitButton.innerText = 'submit';

                tdSite.innerText = data.data.site;
                tdUsername.innerText = data.data.username;
                tdPassword.innerText = '*'.repeat(data.data.password.length);
                // tdPassword.innerText = data.data.password;
                tdSubmitButton.appendChild(submitButton);
                submitButton.addEventListener('click', () => {
                    // Send data to content.js
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { type: 'fillPassword', data: data.data });
                    });
                });

                tr.appendChild(tdSite);
                tr.appendChild(tdUsername);
                tr.appendChild(tdPassword);
                tr.appendChild(tdSubmitButton);

                tablePasswords.appendChild(tr);
            } else {
                message.textContent = 'No password input detected.';
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    const fetchVauldData = async () => {
        tablePasswords.innerHTML = '';
        let url = `http://localhost:3300/api/passwords`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log(data.data); // Array of passwords
            if (data.data && data.data.length > 0) {
                data.data.forEach((password) => {
                
                var tr = document.createElement('tr');

                var tdSite = document.createElement('td');
                var tdUsername = document.createElement('td');
                var tdPassword = document.createElement('td');
                var tdAction = document.createElement('td');
                var actionButton = document.createElement('button');
                actionButton.classList.add('btn', 'btn-sm', 'btn-dark');
                actionButton.innerText = 'copy';
                // var tdSubmitButton = document.createElement('td');
                // var submitButton = document.createElement('button');
                // submitButton.classList.add('btn', 'btn-sm', 'btn-dark');
                // submitButton.innerText = 'submit';

                tdSite.innerText = password.site;
                tdUsername.innerText = password.username;
                tdPassword.innerText = '*'.repeat(password.password.length);
                tdAction.appendChild(actionButton);
                // tdPassword.innerText = data.data.password;
                // tdSubmitButton.appendChild(submitButton);
                // submitButton.addEventListener('click', () => {
                //     // Send data to content.js
                //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                //         chrome.tabs.sendMessage(tabs[0].id, { type: 'fillPassword', data: data.data });
                //     });
                // });

                tr.appendChild(tdSite);
                tr.appendChild(tdUsername);
                tr.appendChild(tdPassword);
                tr.appendChild(tdAction);
                // tr.appendChild(tdSubmitButton);

                tablePasswords.appendChild(tr);
                });
            } else {
                message.textContent = 'No password input detected.';
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    // popup.js

    // Ask content script to check for passwords again (useful if popup is opened after the page has already loaded)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        
        var currentTab = tabs[0];
        if (currentTab) {
            searchInput.value = currentTab.url;
        }

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['scripts/content.js']
        });
    });

    // Ask background script for the current data
    chrome.runtime.sendMessage({ type: 'getData' }, (response) => {
        if (response && response.data) {
            let data = JSON.parse(response.data);
            console.log(data);
            var tr = document.createElement('tr');

            var tdSite = document.createElement('td');
            var tdUsername = document.createElement('td');
            var tdPassword = document.createElement('td');
            var tdSubmitButton = document.createElement('td');
            var submitButton = document.createElement('button');
            submitButton.classList.add('btn', 'btn-sm', 'btn-dark');
            submitButton.innerText = 'Submit';

            tdSite.innerText = data.site;
            tdUsername.innerText = data.username;
            tdPassword.innerText = '*'.repeat(data.password.length);
            // tdPassword.innerText = data.password;
            tdSubmitButton.appendChild(submitButton);
            submitButton.addEventListener('click', () => {

                // Send data to content.js
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'fillPassword', data: data });
                });
            });

            tr.appendChild(tdSite);
            tr.appendChild(tdUsername);
            tr.appendChild(tdPassword);
            tr.appendChild(tdSubmitButton);

            tablePasswords.appendChild(tr);
        }
    });

});




