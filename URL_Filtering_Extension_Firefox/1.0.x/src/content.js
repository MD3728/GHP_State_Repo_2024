// Listen for messages
// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   // If the received message has the expected format...
//   if (msg.text === 'report_back') {
//       // Call the specified callback, passing
//       // the web-page's DOM content as argument
//       sendResponse(document.all[0].outerHTML);
//       document.location.href = "https://www.google.com/";
//   }
// });

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //console.log(request, sender, sendResponse);
  if (request.text === "test"){
    sendResponse(document.all[0].outerHTML);
  }
});