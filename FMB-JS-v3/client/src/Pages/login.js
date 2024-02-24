//Login Page
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component {
  constructor(){
    super();
    this.state = 
    {
      data: null
    };
  }

  //Navigation Methods
  goToHome(){
    document.location.href = "http://localhost:3000/";
  }

  goToLogin(){
    document.location.href = "http://localhost:3000/login";
  }

  goToCreate(){
    document.location.href = "http://localhost:3000/create_account";
  }

  //Update Text Boxes
  changeTextBox = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  //Create New Account
  addNewAccount = async (e) => {
    if (window.confirm("Do You Want To Create This Account?")){//Verification
      let sqlQuery = `INSERT INTO Accounts (Username, Password, Tests) VALUES ('${document.getElementById("usernameCreate").value}','${document.getElementById("passwordCreate").value}','');`
      e.preventDefault();
      fetch("http://localhost:3001/queryCommand", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: sqlQuery
      });
      // data: {action: 'knownNewAccount', nameBox: document.getElementById("nameCreate").value, usernameBox: document.getElementById("usernameCreate").value, passwordBox: document.getElementById("passwordCreate").value},
    }else{
      console.log("Action Canceled");
    }
  }
  
  //Login To Account
  loginAccount = async (e) => {
    e.preventDefault();
    let finalResponse = "";
    await fetch("http://localhost:3001/selectAllAccount", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {console.log(data); return data.json()})
    .then(data => {finalResponse = data})
    .catch(error => console.log(error));
    console.log(finalResponse);
    let allAccount = finalResponse;
    for (let x of allAccount){
      console.log(x);
      if ((document.getElementById("usernameInput").value === x.Username)&&(document.getElementById("passwordInput").value === x.Password)){
        document.cookie = `Account = ${x.ID};`;
        //document.cookie = `AccountType = ${x.Type}`;
        document.location.href = "http://localhost:3000/profile";
        break;
      }
    }
  }

  // Returns HTML Page
  render() {
    return (
    <div>
      <title>Login</title>
      {/* Navbar */}
      <nav className="navbar navbar-expand-sm bg-dark">
        <div className="container-fluid">
          <ul className="navbar-nav" id = "generalNav">
            <li id = "homeNav" className = "nav-item">
              <input type = "submit" className = "btn text-light nav-link btn-dark" value = "Home" onClick = {() => {this.goToHome()}} />
            </li>
            <li id = "loginNav" className = "nav-item">
              <input type = "submit" className = "btn text-light nav-link btn-dark" value = "Login" onClick = {() => {this.goToLogin()}}/>
            </li>
          </ul>
        </div>
      </nav>
      {/* Main Page */}
      <div id = "generalDiv" className = "row">
        <div className = "col-sm-2">        

        </div>      
        <div className = "col-sm-2 middleSection">        

        </div>
        <div id = "mainInfoDiv" className = "col-sm-4 middleSection "> 
         {/*align-items-center justify-content-center  */}
          <div id = "loginDiv" className='standardBox'>
            <h1 id = "homepageText">Login Portal</h1>            
            <div id = "usernameInputs">
              <p id = "usernameText">Username:</p>
              <input type = "text" name = "username" id = "usernameInput" onChange = {this.changeTextBox} />
            </div>
            <div id = "passwordInputs">
              <p id = "passwordText">Password:</p>
              <input type = "password" name = "password" id = "passwordInput" onChange = {this.changeTextBox} />
            </div>
            <input type = "submit" name = "login" id = "loginButton" value = "Login" onClick = {this.loginAccount} />
            <input type = "submit" id = "createAccountButton" value = "Create Account" onClick = {() => {this.goToCreate()}} />
          </div>
        </div>
        <div className = "col-sm-2 middleSection">        

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
  }
}

export default Login;


// {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> */}

// //Placeholder Program
// {/* <div className="App">
// <header className="App-header">
//   <img src={logo} className="App-logo" alt="logo" />
//   <h1 className="App-title">Welcome to React</h1>
// </header>
// <p className="App-intro">{this.state.data}</p>
// </div> */}

  // componentDidMount() {
  //   this.callBackendAPI()
  //     .then(res => this.setState({ data: res.express }))
  //     .catch(err => console.log(err));
  // }

  // // fetching the GET route from the Express server which matches the GET route from server.js
  // callBackendAPI = async () => {
  //   const response = await fetch('/myresponse');
  //   const body = await response.json();
  //   console.log(body)
  //   if (response.status !== 200) {
  //     throw Error(body.message) 
  //   }
  //   return body;
  // };

