# URL Filtering - Firefox Extension
<strong>Version 1.0.2</strong>     
<strong>Last Updated: 2/22/2024</strong>       

# Description
A simple web extension that blocks the words in the url set by the first array inside the program.          
<strong>This version is only for Firefox Developer, Nightly, or ESR versions</strong>

# Purpose 
<ul>
  <li>
  Program can block words in web page URLs listed inside of the background.js file    
  </li>
  <li>
  Blocked pages with these words will be redirected to <a href="url">https://www.google.com/</a>    
  </li>
  <li>
  Variations of the words will also be blocked, and all non-alphanumeric characters will be removed from the URL before checking for blocked words.
  </li>
</ul>

# Usage
<ol>
  <li>
  Edit the list inside of background.js to manage which words are blocked  
  </li> 
  <li> 
  Load Extension unpacked into Firefox browser for testing   
  </li>
  <li>
  Extension will block automatically and cannot be stopped unless it is disabled   
  </li>
  <li>
  Force install the extension if necessary using policies.json (Example is in the root directory) inside of the distribution folder in Program Files/Firefox
  </li>
</ol>

# Issues
<ul>
  <li>
  Some combinations of words will cause issues with popular websites, especially logins. Make sure to test the extension and determine the exceptions list. 
  </li>
  <li>
  The extension has a delay between loading webpages to prevent infinite reloading. This delay can be adjusted in the background.js file.
  </li>
</ul> 


