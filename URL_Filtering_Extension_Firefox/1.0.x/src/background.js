//
// Word URL Checking Program
//

// List with blocked words and phrases (Websites)
let worldBlockListWeb = [

  // Insert most recent words that need to be blocked
  // Format should be: ["word1", "word2"] etc.
  "Someword",
  "Some other word",
  "etc."

];

// List with blocked words and phrases (Local Files)
let worldBlockListLocal = [

  // Insert most recent words that need to be blocked
  // Format should be: ["word1", "word2"] etc.
  "Someword",
  "Some other word",
  "etc."

];

// The following words will not be checked
let exemptWords = [

  // Insert most recent words that need to be blocked
  // Format should be: ["word1", "word2"] etc.
  "Someword",
  "Some other word",
  "etc."

];

// Timing Methods
let unblockedTime = [[8,40,8,50]];//8:40 -> 8:50 (Starting time inclusive, ending time exclusive)
let canCurrentlyBlock = true;

function parseTime(){
  let currentTime = new Date(new Date().getTime()).toLocaleTimeString().split(":");
  let currentHour = parseInt(currentTime[0]);
  let currentMinute = parseInt(currentTime[1]);
  let currentSecond = parseInt(currentTime[2].slice(0,2));
  if (currentTime[2][3] === "P"){
    currentHour += 12;
  }
  // console.log("Current Hour: " + currentHour)
  // console.log("Current Time: " + currentTime);
  for (let unblockFrame of unblockedTime){
    if ((parseInt(currentHour) >= unblockFrame[0])&&(parseInt(currentHour) <= unblockFrame[2])
    &&(parseInt(currentMinute) >= unblockFrame[1])&&(parseInt(currentMinute) < unblockFrame[3])){
      return true; // Within Time Period
    }
  }
  return false; // Outside of Time Period
}

setInterval(parseTime, 2000);

// URL Checking Methods (Websites)
let currentURL = "";
function checkURL(currentWord, tabs){
  if ((currentWord.length > 3)&&(canCurrentlyBlock)){// Word Set Contrasints
    // console.log(currentWord);
    // Check for blocked words on web pages
    if ((currentURL.includes(currentWord))&&(!exemptWords.includes(currentWord))){
      console.log(`Page Blocked Due To Word: ${currentWord}`);//Redirect
      let updating = browser.tabs.update(tabs[0].id, {
        active: true,
        url: "https://www.google.com/"
      });
      canCurrentlyBlock = false;
      console.log("Next Block Delayed 800ms")
      setTimeout(() => {canCurrentlyBlock = true;}, 800);
    }
  }
}
// URL Randomization Methods
// Parameters: tabs is simply "tabs" from the browser getting passed on to perform checkURL
function sliceAnother(startingIndex, numIteration, maxIteration, startingWord, wordLength, tabs){
  numIteration++;
  for (let a = startingIndex; a < startingWord.length; a++){//Replace maxIteration numIteration wordLength - maxIteration
    let finalWord = startingWord.slice(0,a) + startingWord.slice(a+1);
    //console.log(finalWord); 
    checkURL(finalWord, tabs);
    if (numIteration < maxIteration){
      sliceAnother(a+1, numIteration, maxIteration, finalWord, wordLength, tabs);
    }
  }
}

// URL Redirection/Blocking Methods (Web)
function checkPage(){
  if ((!parseTime())&&(canCurrentlyBlock === true)){
    browser.tabs.query({active: true, currentWindow: true}, function(tabs){
      console.log(tabs[0].url);
      currentURL = tabs[0].url.toLowerCase().replace(/[^a-zA-Z]/gi, '');
      if ((currentURL.slice(0,4) === "file")||(currentURL.slice(0,5) === "about")){// Check for blocked words on local files
        // Parse all the words
        for (let currentWord of worldBlockListLocal){
          // Check the entire word
          checkURL(currentWord.replace(/[^a-zA-Z]/gi, ''), tabs);
          // Check the fragments of the word
          let wordLength = currentWord.length;
          let pErrorCorrection = Math.floor((currentWord.length-1)/5);//5,10
          let errorCorrectionNum = (pErrorCorrection > 2) ? 2 : pErrorCorrection; // Limit corrections to 2
          //console.log(errorCorrectionNum);
          let finalWord = currentWord.toLowerCase().replace(/[^a-zA-Z]/gi, '');
          sliceAnother(0, 0, errorCorrectionNum, finalWord, finalWord.length, tabs); // Start Recursion
        }
      }else{// Check for blocked words on websites
        // Parse all the words
        for (let currentWord of worldBlockListWeb){
          // Check the entire word
          checkURL(currentWord.replace(/[^a-zA-Z]/gi, ''), tabs);
          // Check the fragments of the word
          let wordLength = currentWord.length;
          let pErrorCorrection = Math.floor((currentWord.length-1)/5);//5,10
          let errorCorrectionNum = (pErrorCorrection > 2) ? 2 : pErrorCorrection; // Limit corrections to 2
          //console.log(errorCorrectionNum);
          let finalWord = currentWord.toLowerCase().replace(/[^a-zA-Z]/gi, '');
          sliceAnother(0, 0, errorCorrectionNum, finalWord, finalWord.length, tabs); // Start Recursion 
        }
      }
    });
  }
}

// Browser Activation Methods
browser.tabs.onActivated.addListener(() => {
  //console.log("onActivated Listener Running");
  checkPage();
});

browser.tabs.onUpdated.addListener(() => {
  //console.log("onUpdated Listener Running");
  checkPage();
});



