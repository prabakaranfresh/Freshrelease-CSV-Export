(function () {
    var validUrlPattern = new RegExp(/\.freshrelease.com/g), validUrl;
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        validUrl = validUrlPattern.test(tabs[0].url);
        var showid = (validUrl) ? 'valid_url' : 'invalid_url';
        document.getElementById(showid).className = '';

    });
})();