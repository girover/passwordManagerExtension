document.addEventListener('DOMContentLoaded', function () {

    var webAppButton = document.getElementById('btn-web-app');
    var generatorButton = document.getElementById('btn-generator');
    var vaultButton = document.getElementById('btn-vault');
    var logoutButton = document.getElementById('btn-logout');
    var message = document.getElementById('message');
    var searchForm = document.getElementById('search-form');
    var searchInput = document.getElementById('search');
    var tablePasswords = document.getElementById('table-passwords-tbody');

    webAppButton.addEventListener('click', () => {
        searchInput.value = 'Web App';
    });
    vaultButton.addEventListener('click', () => {
        searchInput.value = 'Vault';
    });
    generatorButton.addEventListener('click', () => {
        searchInput.value = 'Generator';
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
        let url = `http://localhost:3300/api/passwords/site/url/?search=${searchInput.value}`;
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
                var tr = document.createElement('tr');

                var tdSite = document.createElement('td');
                var tdUsername = document.createElement('td');
                var tdPassword = document.createElement('td');
                var tdFillButton = document.createElement('td');
                var fillButton = document.createElement('button');
                fillButton.classList.add('btn', 'btn-sm', 'btn-dark');
                fillButton.innerText = 'fill';

                tdSite.innerText = data.data.site;
                tdUsername.innerText = data.data.username;
                tdPassword.innerText = '*'.repeat(data.data.password.length);
                // tdPassword.innerText = data.data.password;
                tdFillButton.appendChild(fillButton);
                fillButton.addEventListener('click', () => {
                    // Send data to content.js
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { type: 'fillPassword', data: data.data });
                    });
                });

                tr.appendChild(tdSite);
                tr.appendChild(tdUsername);
                tr.appendChild(tdPassword);
                tr.appendChild(tdFillButton);

                tablePasswords.appendChild(tr);
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
            var tdFillButton = document.createElement('td');
            var fillButton = document.createElement('button');
            fillButton.classList.add('btn', 'btn-sm', 'btn-dark');
            fillButton.innerText = 'fill';

            tdSite.innerText = data.site;
            tdUsername.innerText = data.username;
            tdPassword.innerText = '*'.repeat(data.password.length);
            // tdPassword.innerText = data.password;
            tdFillButton.appendChild(fillButton);
            fillButton.addEventListener('click', () => {
                // Send data to content.js
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'fillPassword', data: data });
                });
            });

            tr.appendChild(tdSite);
            tr.appendChild(tdUsername);
            tr.appendChild(tdPassword);
            tr.appendChild(tdFillButton);

            tablePasswords.appendChild(tr);

            //chrome.runtime.sendMessage({ type: 'insertDataToForm', data: data});
            // Send data to content.js
            // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            //   chrome.tabs.sendMessage(tabs[0].id, { type: 'fillPassword', data: data });
            // });
        }
    });

});




