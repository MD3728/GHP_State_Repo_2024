//Account Edit Page
import React, { Component } from 'react';

let currentAccountNumber = 1;
let currentAccount = null;
let allAccount = "";

//Determine Login State and Account Type and Logout/Kick if necessary
function checkLoginStatus(){
  let cookieContent = document.cookie.split('; ');
  // console.log(cookieContent);
  console.log(document.cookie);
  //Check and assign login
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
  //Check profile type

}

class ModifyAccount extends Component {
  constructor(){
    super();
    this.state = 
    {
      data: null
    };
  }

  //Log Out Of Account
  logout(){
    document.cookie = 'Login=false';
    checkLoginStatus();
  }

  //Method For Changing Current Editing Account
  async switchAccount(increment){
    await fetch("http://localhost:3001/refreshData", {method: "POST",headers: {"Content-Type": "text/plain"},body: ""});//Update Data
    let finalResponse = "";
    await fetch("http://localhost:3001/selectAllAccount", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {return data.json()})
    .then(data => {console.log(data); finalResponse = data})
    .catch(error => console.log(error));
    allAccount = finalResponse;
    let accountLength = allAccount.length;
    currentAccountNumber += increment;
    if (currentAccountNumber > accountLength){//Index Limit Checking
      currentAccountNumber = accountLength;
    }else if (currentAccountNumber < 1){
      currentAccountNumber = 1;
    }
    console.log(currentAccountNumber);
    currentAccount = allAccount[currentAccountNumber-1];
    document.getElementById("idBox").value = currentAccount.ID;
    document.getElementById("usernameBox").value = currentAccount.Username;
    document.getElementById("passwordBox").value = currentAccount.Password;
    document.getElementById("testBox").value = currentAccount.Tests;
    switch (currentAccount.Type){
      case 1://Admin
        document.getElementById("adminTypeButton").checked = true;
        break;
      case 2://Teacher
        document.getElementById("teacherTypeButton").checked = true;
        break;
      case 3://Student
        document.getElementById("studentTypeButton").checked = true;
        break;
      default:
        console.log("Nonexistent Account Type, Contact Administrator");
    }
  }

  //Update Account Attributes
  updateAccount(){
    let finalType = 3;//Account Type
    if (document.getElementById("adminTypeButton").checked){//Admin
      finalType = 1;
    }else if (document.getElementById("teacherTypeButton").checked){//Teacher
      finalType = 2;
    }else if (document.getElementById("studentTypeButton").checked){//Student
      finalType = 3;
    }
    let sqlQuery = `UPDATE Accounts SET Type = ${finalType}, Username = '${document.getElementById("usernameBox").value}', Password = '${document.getElementById("passwordBox").value}', Tests = '${document.getElementById("testBox").value}' WHERE ID = ${parseInt(document.getElementById("idBox").value)};`
    fetch("http://localhost:3001/queryCommand", {
      method: "POST",
      headers: {"Content-Type": "text/plain"},
      body: sqlQuery
    });
    alert("Update Successful");
    this.switchAccount(0);
  }
  
  //Prepare To Create Account
  newAccount(){
    document.getElementById("idBox").value = "";
    document.getElementById("usernameBox").value = "";
    document.getElementById("passwordBox").value = "";
    document.getElementById("testBox").value = "";
    document.getElementById("adminTypeButton").checked = false;
    document.getElementById("teacherTypeButton").checked = false;
    document.getElementById("studentTypeButton").checked = false;
    document.getElementById("buttonDiv").style.display = "none";
    document.getElementById("confirmAddDiv").style.display = "block";
  }

  //Add Account (With Query)
  addAccount(){
    let finalType;//Account Type
    if (document.getElementById("adminTypeButton").checked){//Admin
      finalType = 1;
    }else if (document.getElementById("teacherTypeButton").checked){//Teacher
      finalType = 2;
    }else{//Student or Default
      finalType = 3;
    }
    let sqlQuery = `INSERT INTO Accounts (Type, Username, Password, Tests) VALUES (${finalType}, '${document.getElementById("usernameBox").value}', '${document.getElementById("passwordBox").value}', '');`;
    let originalThis = this;
    fetch("http://localhost:3001/queryCommand", {method: "POST", headers: {"Content-Type": "text/plain"}, body: sqlQuery})
    .then(originalThis.switchAccount(100000))
    .catch(error => console.log(error));
    alert("Creation Successful");
    document.getElementById("buttonDiv").style.display = "block";
    document.getElementById("confirmAddDiv").style.display = "none";
  }

  //Cancel Add Account
  cancelAdd(){
    document.getElementById("buttonDiv").style.display = "block";
    document.getElementById("confirmAddDiv").style.display = "none";
    this.switchAccount(0);
  }
  
  //Delete Account
  deleteAccount(){
    let sqlQuery = `DELETE FROM Accounts WHERE ID = ${parseInt(document.getElementById("idBox").value)};`;
    if (window.confirm("Delete This Entry?")){
      fetch("http://localhost:3001/queryCommand", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: sqlQuery
      });
      alert("Deletion Successful");
      this.switchAccount(0);
    }    
  }

  //Method for changing assigned tests
  changeTest(){
    document.getElementById("inputDiv").style.display = "none";
    document.getElementById("addTestDiv").style.display = "block";
  }

  //When page loads
  componentDidMount(){
    this.switchAccount(0);
    setInterval(checkLoginStatus, 5000);
  }

  //HTML Rendering
  render(){
    return (
    <div id = "generalDiv">
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
      <div id = "generalContentDiv" className = "row">
        {/* General Objects */}
        <div className = "col-sm-2">        

        </div>  
        <div id = "biggerDiv" className = "col-sm-8 middleSection align-items-center justify-content-center">    
          <div id = "editingDiv" className = "standardBox">
            {/* Buttons */}
            <div id = "buttonDiv">
              <input type = "submit" id = "updateAccount" value = "Save" onClick = {() => this.updateAccount()} />
              <input type = "submit" id = "newAccount" value = "New" onClick = {() => this.newAccount()} />
              <input type = "submit" id = "deleteAccount" value = "Delete" onClick = {() => this.deleteAccount()} />
              <input type = "submit" id = "next" value = "Next" onClick = {() => this.switchAccount(1)} />
              <input type = "submit" id = "back" value = "Back" onClick = {() => this.switchAccount(-1)} />
              {/* <input type = "submit" id = "changeTest" value = "Add/Remove Test" onClick = {() => this.changeTest()} /> */}
            </div>
            <div id = "confirmAddDiv">
              <input type = "submit" id = "addAccount" value = "Add" onClick = {() => this.addAccount()} />
              <input type = "submit" id = "cancelAdd" value = "Cancel" onClick = {() => this.cancelAdd()} />
            </div>
            {/* Decoration */}
            <p id = "currentEntryTag">Current Account:</p>
            {/* Inputs */}
            <div id = "inputDiv">
              <p id = "idTag">Account ID:</p>
              <p id = "usernameTag">Username:</p>
              <p id = "passwordTag">Password:</p>
              <p id = "testTag">Assigned Tests:</p>
              <p id = "typeTag">Account Type:</p>
              <input type = "text" id = "idBox" name = "idBox" disabled = {true} />
              <input type = "text" id = "usernameBox" name = "usernameBox" />
              <input type = "text" id = "passwordBox" name = "passwordBox" />
              <input type = "text" id = "testBox" name = "testBox" />
              <label id = "adminTypeLabel">
                <input type = "radio" id = "adminTypeButton" name = "typeSelect"  value = "adminTypeButton" /> Administrator
              </label>
              <label id = "teacherTypeLabel">
                <input type = "radio" id = "teacherTypeButton" name = "typeSelect" /> Teacher
              </label>
              <label id = "studentTypeLabel">
                <input type = "radio" id = "studentTypeButton" name = "typeSelect" /> Student
              </label>
            </div>
          </div>

          {/* Instructions */}
          <div id = "instructionsDiv" className='standardBox'>
            <h1 id = "instructionText">
              <strong>Instructions:</strong><br />
              Use This Page To Change Account Data <br />
              "Save" Saves Changes On Current Entry <br />
              "New" Creates Template Account At End <br />
              "Delete" Deletes Current Entry <br />
              <strong>To add an assigned test, format the input to look like "testID:testID:testID" where testID is the numerical ID of the test <br /></strong>
            </h1>
          </div>

        </div>
        <div className = "col-sm-2">   

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

    </div>
    );
  }
}

export default ModifyAccount;

