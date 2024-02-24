//Profile (User) Page
import React, { Component } from 'react';

let currentAccountTest;
let currentTestNumber;
let currentTest;
let currentAccount;
let testIsEmpty = false;
let allTest;

//Determine Login State and Logout if necessary
function checkLoginStatus(){
  let cookieContent = document.cookie.split('; ');
  // console.log(cookieContent);
  // console.log(document.cookie);
  try{
    let loggedIn = cookieContent.find(row => row.startsWith('Login='));
    loggedIn = loggedIn.substring(6);
  }catch(exception){
    document.cookie = 'Login=false';
  }
  cookieContent = document.cookie.split('; ');
  let loggedIn = cookieContent.find(row => row.startsWith('Login='));
  loggedIn = loggedIn.substring(6);
  if (loggedIn === "false"){
    document.cookie = 'Login=false';
    console.log("User Supposed To Be Logged Out");
    document.location.href = 'http://localhost:3000/login';
  }
}

class Profile extends Component {
  constructor(){
    super();
    this.state = 
    {
      data: null
    };
  }

  //Move Test Selection
  async changeTest(direction){//Function For Updating HTML 
    //Find Correct Test Name
    await fetch("http://localhost:3001/refreshData", {method: "POST",headers: {"Content-Type": "text/plain"},body: ""});//Update Data
    let finalResponse = "";
    await fetch("http://localhost:3001/selectAllTest", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {return data.json()})
    .then(data => {console.log(data); finalResponse = data})
    .catch(error => console.log(error));
    allTest = finalResponse;
    //Display Test
    currentTestNumber += direction;
    if (testIsEmpty){//No Tests
      document.getElementById("testNameDisplay").innerHTML = "No Tests Available";
      document.getElementById("takeTest").disabled = true;
      document.getElementById("next").disabled = true;
      document.getElementById("back").disabled = true;
      return 0;
    }else if (currentTestNumber>currentAccountTest.length){//Reached End Of List
      currentTestNumber = 1;
    }else if (currentTestNumber <= 0){//Reached Beginning Of List
      currentTestNumber = currentAccountTest.length;
    }
    document.getElementById("takeTest").disabled = false;
    document.getElementById("next").disabled = false;
    document.getElementById("back").disabled = false;
    currentTest = currentAccountTest[currentTestNumber-1];
    console.log(currentAccountTest)
    //Find Correct Test Name
    let possibleTest = "";
    for (let nextTest of allTest){
      if (nextTest.ID === parseInt(currentTest)){
        possibleTest = nextTest.Name;
        break;
      }
    }
    //console.log(currentTestNumber);
    document.getElementById("testNameDisplay").innerHTML = possibleTest;
    // document.getElementById("hiddendisplay").value = currentTest.toString();
  }
  
  //Take Selected Test
  takeTest(){
    document.cookie = `Test=${currentTest}`;
    console.log(currentTest);
    document.location.href = "http://localhost:3000/test";
  }

  //Log Out Of Account
  logout(){
    document.cookie = 'Login=false';
    checkLoginStatus();
  }

  //Select All Entries From Accounts
  selectAllAccount = async () => {
    let finalResponse = "";
    await fetch("http://localhost:3001/selectAllAccount", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {console.log(data); return data.json()})
    .then(data => {finalResponse = data})
    .catch(error => console.log(error));
    return finalResponse;
  }

  //Select All Entries From Tests
  selectAllTest = async (e) => {
    e.preventDefault();
    let finalResponse = "";
    await fetch("http://localhost:3001/selectAllTest", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {console.log(data); return data.json()})
    .then(data => {finalResponse = data})
    .catch(error => console.log(error));
    console.log(finalResponse);
    return finalResponse;
  }

  //Default Setup Upon Load
  async componentDidMount(){
    let allAccount = await this.selectAllAccount();
    document.cookie = "Login=true";
    setTimeout(() => {document.cookie = "Login=false"}, 1800000);
    let accountIDRow = document.cookie.split("; ").find(row => row.startsWith('Account=')).substring(8);
    for (let x of allAccount){//Account Matching
      if (x["ID"].toString() === accountIDRow.toString()){
        //console.log("Account Detected");
        currentAccount = x;
      }
    }
    currentAccountTest = currentAccount["Tests"].split(":");
    if ((currentAccount["Tests"] === '')||(currentAccount["Tests"] === ' ')){//Detect If There Are Empty Tests
      testIsEmpty = true;
    }
    currentTestNumber = 1;
    currentTest = currentAccountTest[0];
    document.getElementById("welcomeText").innerHTML = `Welcome ${currentAccount["Username"]}`;
    await this.changeTest(0);
    setInterval(checkLoginStatus, 5000);
  }

  //Create Page (Account Type Feature Currently Not Available)
  render(){
    // let cookieContent = document.cookie.split("; ")
    // if (cookieContent.find(row => row.startsWith('AccountType=')).substring(6) === 1) {//If Admin
    return(
      <div>
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-sm bg-dark">
          <div className="container-fluid">
            <ul className="navbar-nav" id = "generalNav">
              <li id = "profileNav" className = "nav-item">
                <a className = "text-light nav-link btn-dark" href="/profile">Profile</a>
              </li>
              <li id = "homeNav" className = "nav-item">
                <a className = "text-light nav-link btn-dark" href="/">Home</a>
              </li>
              <li id = "editNav" className="nav-item dropdown btn-dark text-dark">
                <a className="nav-link dropdown-toggle text-light" href="/profile" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Database
                </a>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                  <li><a className="dropdown-item" href="/modify_account">Edit Accounts</a></li>
                  <li><a className="dropdown-item" href="/modify_test">Edit Tests</a></li>
                  <li><a className="dropdown-item" href="/modify_question">Edit Questions</a></li>
                </ul>
              </li>
              <li id = "logOutNav" className = "nav-item">
                <input type = "submit" className = "btn text-light nav-link btn-dark" onClick = {this.logout} value = "Log Out" />
              </li>
            </ul>
          </div>
        </nav>
        {/* User Interface */}
        <div id = "generalDiv" className = "row">
          <h6 id = "welcomeText">Welcome</h6>    
          <div className = "col-sm-2">        

          </div>  
          {/* Test Information (Left) */}
          <div id = "testInfoDiv" className = "col-sm-4 middleSection align-items-center justify-content-center">        
            <div id = "testSelectDiv" className='standardBox'>
              <div id = "navigationButtons">
                <input type = "submit" name = "Next" id = "next" value = "Next" onClick = {() => {this.changeTest(1)}}/>
                <input type = "submit" name = "Back" id = "back" value = "Back" onClick = {() => {this.changeTest(-1)}}/>
              </div>
              <p id = "selectTestText">Select A Test <br /> To Take:</p>
              <div id = "testNameDisplay"></div>
              <input type = "submit" name = "Start" id = "takeTest" value = "Take Test" onClick = {this.takeTest}/>
            </div>
          </div>    

          {/* Administrative Information (Right) */}
          <div id = "managementInfoDiv" className = "col-sm-4 middleSection align-items-center justify-content-center">  
            <div id = "managementOptionDiv" className='standardBox'>
              <h6 id = "adminText">Administrative Tools</h6> 
              <form action = "http://localhost:3000/modify_account">
                <input type = "submit" id = "modifyAccount" value = "Modify Accounts"/> 
              </form>
              <form action = "http://localhost:3000/modify_test">
                <input type = "submit" id = "modifyTest" value = "Modify Tests"/> 
              </form>
              <form action = "http://localhost:3000/modify_question">
                <input type = "submit" id = "modifyQuestion" value = "Modify Questions"/> 
              </form> 
            </div>
          </div>
          <div className = "col-sm-2">   

          </div>
        </div>
        {/* Footer */}
        <nav className="navbar navbar-expand-sm bg-dark" id = "footerContainer">
        <div className="container-fluid">
          <ul className="navbar-nav" id = "bottomNav">
            <li className = "nav-item">
              <label id = "footerNote">FMB JS v.3.0.0</label>
            </li>
          </ul>
        </div>
        </nav>
      </div>
    );
    // }else{//If Regular Account
    //   return (
    //     <div>
    //       <title>Profile Page</title>
    //       <h6 id = "welcomeText">Welcome Placeholder User</h6>    
    //       <input type = "submit" name = "Next" id = "next" value = "Next" onClick = {() => {this.changeTest(1)}}/>
    //       <input type = "submit" name = "Back" id = "back" value = "Back" onClick = {() => {this.changeTest(-1)}}/>
    //       <input type = "submit" name = "Logout" id = "logout" value = "Log Out" onClick = {this.logout}/> 
    //       <input type = "submit" name = "Start" id = "takeTest" value = "Take Test"/>
    //       <p id = "selectText">Select A Test:</p>
    //       <div id = "display"></div>
    //     </div>
    //   );
    // }
  }
}

export default Profile;

