//
//Display Page (Page Not Used)
//


browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //console.log(request, sender, sendResponse);
  if (request.text === "test"){
    sendResponse(document.all[0].outerHTML);
  }
});


