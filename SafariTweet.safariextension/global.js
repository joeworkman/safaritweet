var settings = new Object();
settings.label = safari.extension.settings.label;
settings.background = safari.extension.settings.background;
settings.borderColor = safari.extension.settings.borderColor;
settings.borderSize = safari.extension.settings.borderSize;
settings.overlayColor = safari.extension.settings.overlayColor;
settings.overlayOpacity = safari.extension.settings.overlayOpacity;
settings.advancedLayout = safari.extension.settings.advancedLayout;
settings.advancedBackground = safari.extension.settings.advancedBackground; 
settings.advancedBorderColor = safari.extension.settings.advancedBorderColor; 
settings.advancedOverlayColor = safari.extension.settings.advancedOverlayColor;
settings.urlService = safari.extension.settings.urlService;
settings.bitlyUser = safari.extension.settings.bitlyUser;
settings.bitlyKey = safari.extension.settings.bitlyKey;

if (!settings.title) { settings.title = "Check out this website"; }
if (!settings.label) { settings.label = "Tweet This Webpage"; }
if (!settings.bitlyUser) { settings.bitlyUser = "safaritweet"; }
if (!settings.bitlyKey) { settings.bitlyKey = "R_cc099669ebfd534ff95b72f2437ebdc0"; }

safari.application.addEventListener("command", performCommand, false);
safari.application.addEventListener("validate", validateCommand, false);
safari.extension.settings.addEventListener("change", configChange, false);

function configChange (event) { 
	if (event.key == "label") { 
		settings.label = event.newValue; 
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("reconfig-tweetURL", settings);
	}
	else if (event.key == "urlService") { 
		settings.urlService = event.newValue; 
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("resetShortStatus", settings);
		shortenURL();
	}
	else if (event.key == "bitlyUser") { 
		settings.bitlyUser = event.newValue; 
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("resetShortStatus", settings);
		shortenURL();
	}
	else if (event.key == "bitlyKey") { 
		settings.bitlyKey = event.newValue; 
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("resetShortStatus", settings);
		shortenURL();
	}
	else if (event.key == "background" || event.key == "borderColor" || event.key == "borderSize" || event.key == "overlayColor" || event.key == "overlayOpacity" || event.key == "advancedLayout" || event.key == "advancedBackground" || event.key == "advancedBorderColor" || event.key == "advancedOverlayColor") { 
		settings[event.key] = event.newValue; 
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("reconfig-layout", settings);
	}
}

function shortenURL() {
	var ajaxRequest = new XMLHttpRequest();	
	var apiURL;
	console.log('Checking URL Service: '+ settings.urlService);
	if (settings.urlService == 'thurly') {
		apiURL = "http://thurly.net/api.php?id=" + encodeURI(settings.pageURL);			
	}
	else if (settings.urlService == 'kewe') {
		apiURL = "http://ke-we.net/api.php?id=" + encodeURI(settings.pageURL);			
	}
	else if (settings.urlService == 'bitly') {
		apiURL = "http://api.bit.ly/v3/shorten?login=" + settings.bitlyUser + "&apiKey=" + settings.bitlyKey + "&format=txt&longUrl=" + encodeURI(settings.pageURL);			
	}
	else if (settings.urlService == 'isgd') {
		apiURL = "http://is.gd/api.php?longurl=" + encodeURI(settings.pageURL);			
	}
	else if (settings.urlService == 'jmp') {
		apiURL = "http://api.bit.ly/v3/shorten?domain=j.mp&login=" + settings.bitlyUser + "&apiKey=" + settings.bitlyKey + "&format=txt&longUrl=" + encodeURI(settings.pageURL);			
	}
    ajaxRequest.open("GET", apiURL);
    ajaxRequest.onreadystatechange = function(){
    	if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
			// Wait for the response to come and then turn on the click function in inject.js
			console.log('Found Short URL: ' + ajaxRequest.responseText);
            settings.shortURL = ajaxRequest.responseText;
			safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("reconfig-shortButton", settings);
		} 
    }
	console.log('Querying Thurly...');
    ajaxRequest.send();
}

function validateCommand(event) {
	if (event.command === "tweet") { 
		// Disable the button if there is no URL loaded in the tab. 
		event.target.disabled = !event.target.browserWindow.activeTab.url;
	}
}

function performCommand (event) {
	if (event.command === "tweet") {
		settings.pageURL = safari.application.activeBrowserWindow.activeTab.url;
		settings.title = safari.application.activeBrowserWindow.activeTab.title;
				
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("tweetme", settings);
		
		shortenURL();
	}
}	