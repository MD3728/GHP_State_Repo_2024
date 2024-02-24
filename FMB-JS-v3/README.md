# FMB JS

<!-- Top of README -->
<a name="readme-top"></a>

<!-- Title -->
<br />
<div align="center">
  <h3 align="center">FMB</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About</a></li>
    <li><a href="#getting-started">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About
Project Link: [https://github.com/MD3728/FMB-JS-v3](https://github.com/MD3728/FMB-JS-v3)
<p align = "right">(<a href="#readme-top">back to top</a>)</p>
An updated version of my full stack project built on React and Node.js    
Version 2.0.0             


# Built With

* ReactJS
* Bootstrap 5.2
* JQuery

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
### Getting Started and Installation
Follow the steps below to run the project locally.    

<h1>Instructions for Setting Up React:</h1>

1. Download the entire repository and unzip it
2. Install the latest version of node.js if you have not already
3. Install React by running "npm install -g create-react-app"     
4. Create a new folder and run "npx create-react-app appName"
5. Move downloads to their corresponding location as they show up in the original zip file
6. Inside of the root directory run:
    * npm install express
    * npm install cors
    * npm install mysql    
7. Inside of client directory (the folder should follow whatever appName you set) run:     
    * npm install bootstrap
    * npm install jquery
    * npm install react-router-dom       
8. Start the development server by running "npm start" in client folder    

<h1>Instructions for Setting Up the Database:</h1><br/>

1. Make sure you have MySQL downloaded from Oracle's website, note that this project will make use of the root account
2. Run the following commands to create a template table:

CREATE DATABASE siteDatabase;    
CREATE TABLE Accounts (ID INTEGER PRIMARY KEY AUTO_INCREMENT, Username TEXT, Password TEXT, Tests TEXT);    
CREATE TABLE Tests (ID INTEGER PRIMARY KEY AUTO_INCREMENT, Name TEXT, Questions TEXT);    
CREATE TABLE Questions (ID INTEGER PRIMARY KEY AUTO_INCREMENT, Type INTEGER, Question TEXT, Answer TEXT, AnswerChoice TEXT);  
INSERT INTO Accounts (Username, Password, Tests) VALUES ('admin','123456','1');    
INSERT INTO Tests (Name, Questions) VALUES ('Math Test','1:2:4');      
INSERT INTO Questions (Type, Question, Answer, AnswerChoice) VALUES (1,'What Is 1+1?','2','');      
INSERT INTO Questions (Type, Question, Answer, AnswerChoice) VALUES (2,'What Is 1+2?','C','1:2:3:4:5');     
INSERT INTO Questions (Type, Question, Answer, AnswerChoice) VALUES (2,'What Is 1+3?','D','1:2:3:4:5');     
INSERT INTO Questions (Type, Question, Answer, AnswerChoice) VALUES (3,'What Is 1+4?','c:d','1:2:5:5:6:7');       

<h1>Debugging:</h1><br/>
<strong>If authentication for mysql does not work...</strong>     
Go To mysql workbench and select database "sitedatabase" and enter (Create the database if it doesn't exist)     
Run ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'whatever the password is';     

<strong>Instructions If MySQL Stops Working (ServiceDisabled)...</strong> 

1. Go To Services As Administrator    
2. Find Service (mysql80 OR mysql57)    
3. Select Run Type Automatic     
4. Run/Restart Service    

<strong>If that doesn't work...</strong>      

1. Delete MySQL Service    
2. Reinstall in bin of server    
3. Reinitiate in bin of server    
4. Go To Services To Restart Service    
5. Reconfigure installer as necessary    

# Deploying To Github Pages:
<strong>IMPORTANT: Server will not work on github pages</strong><br />
Create public github repository    
Install gh-pages: npm install --save gh-pages     
Modify package.json    
1. Add "homepage":"http://MD3728.github.io/app-name"
2. Inside of scripts tag, add "predeploy": "npm run build", "deploy": "gh-pages -d build", and modify "build": "react-scripts build && copy build\\index.html build\\404.html"
3. Change router tag (from react-router-dom) to "BrowserRouter basename = {process.env.PUBLIC_URL}"

Run Commands in client folder
1. git init 
2. git remote remove origin    (if it already exists)
3. git remote add origin https://github.com/MD3728/Sandbox-React-JS.git
4. npm run deploy    

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ROADMAP
## Upcoming Features

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ACKNOWLEDGMENTS
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->
