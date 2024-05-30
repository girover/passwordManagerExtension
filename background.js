// background.js
// Listen for clicks on the browser action icon

var foundPassword = null;

// Execute content.js on tab change
chrome.tabs.onActivated.addListener((activeInfo) => {
    
    chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ['scripts/content.js']
    });
});

chrome.action.onClicked.addListener(() => {
    console.log('Browser action icon clicked background.js');
});

// Listens for messages from content.js
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    
    if (request.passwordFound !== undefined) 
        if(request.passwordFound){
            console.log('Password field detected! background.js');
            setBadge();
            await fetchSiteData(sender.tab.url);
        }else{
            console.log('No password field detected. background.js');
            clearBadge();
            foundPassword = null;
        }
});

// Listen for popup.js messages
chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
    if (message.type === 'getData') {
        await sendResponse({data: JSON.stringify(foundPassword)});
    }
});


const setBadge = () => {
    chrome.action.setBadgeText({text: '1'});
    chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
};

const clearBadge = () => {
    chrome.action.setBadgeText({text: ''});
};


const fetchSiteData = async (siteUrl) => {
    let url = `http://localhost:3300/api/passwords/site/url/?search=${siteUrl}`;
    try {
        const response = await fetch(url, {
          method: 'GET',  // or 'POST', 'PUT', etc.
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        foundPassword = {
            found: true,
            site: data.data.site,
            username: data.data.username,
            password: data.data.password
        }      
    } catch (error) {
        console.error('Fetch error:', error);
      }
}
