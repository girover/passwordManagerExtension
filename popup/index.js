
(async () => {
    const data = await chrome.storage.local.get('pm_token');
    console.log(data);
    if (data && data.pm_token) {
        window.location.href = 'popup.html';
    } else {
        window.location.href = 'login.html';
    }
})() // IIFE




