var tweetQuery;
var popupStatus = false;
var contentStatus = false;
var shortStatus = false;

safari.self.addEventListener("message", handleMessage, false);

function handleMessage(event) {	
	if (window !== window.top) { return; }
	if (event.name === "tweetme") { 
		createContent(event.message);
		openPopup(event.message); 
	}
	else if (event.name === "reconfig-tweetURL") { 
		configTweetURL(event.message); 
	}
	else if (event.name === "reconfig-layout") { 
		configLayout(event.message); 
	}
	else if (event.name === "reconfig-shortButton") { 
		configShortButton(event.message); 
	}
	else if (event.name === "resetShortStatus") { 
		shortStatus = false;
		tweetQuery("#thurlyButton").unbind(); //Reset Click function
	}
}

function openPopup(settings) {
	if (popupStatus === false && window === window.top) {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var popupWidth = tweetQuery("#tweetContainer").width();
		var popupHeight = tweetQuery("#tweetContainer").height();

		tweetQuery("#tweetContainer").css({
			"position": "absolute",
			"top": (0 - (popupHeight + 25)),
			"left": (windowWidth - popupWidth) / 2 
		});

		tweetQuery("#tweetOverlay").show(0).css({"opacity": settings.overlayOpacity });
		tweetQuery("#tweetContainer").fadeIn("slow", function(){
			tweetQuery("#tweetContainer").css({"top": (windowHeight - popupHeight) / 2});
		});

		tweetQuery("#tweetContent").show();

		popupStatus = true;

		tweetQuery("#tweetCloseButton").click(function(){
			closePopup();
		});
	}
}

function closePopup() {
	if (popupStatus === true && window === window.top) {
		var windowHeight = window.innerHeight;
		var popupHeight = tweetQuery("#tweetContainer").height();
	
		tweetQuery("#tweetContainer").fadeOut("slow").css({"top": (0 - (popupHeight + 25))});
		tweetQuery("#tweetOverlay").css({"opacity": 0, "display": "none"});
		tweetQuery("#tweetContent").hide();
		
		popupStatus = false;
	}
}

function createContent(settings) {
	if (contentStatus === false && window === window.top) {		
		tweetQuery = jQuery.noConflict(true);

		// Create Tweet Box Container
		tweetQuery('body').append('<div id="tweetContainer"></div>');
		tweetQuery('#tweetContainer').append('<div id="tweetContent"></div>');
		tweetQuery('#tweetContent').append('<div id="tweetLoading"></div>');
		tweetQuery('#tweetContent').append('<div id="thurlyButton" class="loading"></div>');
		tweetQuery('#tweetContainer').append('<div id="tweetCloseButton"></div>');

		// Create Overlay
		tweetQuery('body').append('<div id="tweetOverlay"></div>');		
		tweetQuery('#tweetOverlay').append('<div id="tweetOverlayText"></div>');		
		tweetQuery("#tweetOverlayText").html('<p id="tweetOverlayText1"><a href="http://safaritweet.com" target="_blank">SafariTweet</a></p><p id="tweetOverlayText2">Developed by <a href="http://joeworkman.net" target="_blank">Joe Workman</a></p>');

		configLayout(settings);		
		configTweetURL(settings);
		
		contentStatus = true;
	}
}

function configShortButton(settings) {
	tweetQuery("#thurlyButton").click(function(){
		// Only redo the short url if it has not been clicked before. 
		if (!shortStatus) { configTweetURL(settings, true); }
		shortStatus = true;
	});
}

function configTweetURL (settings, shortenURL) { 
	var finalURL;
	console.log('Does the Short URL Exist: ' + settings.shortURL)
	
	if (shortenURL && settings.shortURL) {  // Use the short URL but ensure that one exists
		console.log('Using Short URL: ' + settings.shortURL)
		finalURL = settings.shortURL;
	}
	else {
		console.log('Using Page URL: ' + settings.pageURL)
		finalURL = settings.pageURL;
	}
	var tweetURL = "http://safaritweet.com/api?text=" + encodeURI(settings.title) + "&url=" + finalURL + "&label=" + encodeURI(settings.label);
	tweetQuery("#tweetFrame").remove();
	tweetQuery("#tweetContent").prepend('<div id="tweetFrame"><iframe src="'+ tweetURL +'" scroll="no" frameborder=0 width="525px" height="155px"></iframe></div>');	
}

function configLayout (settings) { 
	// Set Background of the Tweet Box
	if (settings.advancedLayout && settings.advancedBackground) {
		//console.log('Advanced Background: ' + settings.advancedBackground);
		tweetQuery("#tweetContainer").removeClass();
		tweetQuery("#tweetContainer").css({ 'background': settings.advancedBackground });		
	}
	else {
		//console.log('Background: ' + settings.background);
		tweetQuery("#tweetContainer").removeClass();
		tweetQuery("#tweetContainer").addClass(settings.background);
	}

	// Set Border Color of the Tweet Box
	if (settings.advancedLayout && settings.advancedBorderColor) {		
		//console.log('Advanced Border Color: ' + settings.advancedBorderColor);
		tweetQuery("#tweetContainer").css({ 'border-color': settings.advancedBorderColor });
	}
	else {
		//console.log('Border Color: ' + settings.borderColor);
		tweetQuery("#tweetContainer").css({ 'border-color': settings.borderColor });
	}

	// Set Color of the Overlay Backdrop
	if (settings.advancedLayout && settings.advancedOverlayColor) {
		//console.log('Advanced Overlay Color: ' + settings.advancedOverlayColor);
		tweetQuery("#tweetOverlay").css({ 'background-color': settings.advancedOverlayColor });
	}
	else {
		//console.log('Overlay Color: ' + settings.overlayColor);
		tweetQuery("#tweetOverlay").css({ 'background-color': settings.overlayColor });
	}

	// Set Border Size of the Tweet Box
	//console.log('Border Size: ' + settings.borderSize);
	tweetQuery("#tweetContainer").css({ 'border-width': settings.borderSize });

	// Adjust the close button to proper position
	var defaultBorderTop = -13;
	var defaultBorderLeft = -15;
	var newBorderTop = defaultBorderTop - (settings.borderSize / 2);
	var newBorderLeft = defaultBorderLeft - (settings.borderSize / 2);
	tweetQuery("#tweetCloseButton").css({ 'top': newBorderTop, 'left': newBorderLeft });

	// Set the Overlay Backdrop Opacity
	//console.log('Overlay Opacity: ' + settings.overlayOpacity);
	tweetQuery("#tweetOverlay").css({"opacity": settings.overlayOpacity });
}