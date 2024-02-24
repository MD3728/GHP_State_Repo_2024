import React, {Component} from 'react';
import './Styling/generalStyle.css';
import {BrowserRouter, Route, Routes, Link} from "react-router-dom";
import Profile from './Pages/profile';
import Login from './Pages/login';
import CreateAccount from './Pages/create_account';
import Home from './Pages/home';
import TestPage from './Pages/testing_page';
import ModifyAccount from './Pages/modify_account';
import ModifyTest from './Pages/modify_test';
import ModifyQuestion from './Pages/modify_question';

// Individual Page Styling
if (window?.location.pathname === "/login"){
  require('./Styling/loginStyle.css');
}else if (window?.location.pathname === "/create_account"){
  require('./Styling/createAccountStyle.css');
}else if (window?.location.pathname === "/profile"){
  require('./Styling/profileStyle.css');
}else if (window?.location.pathname === "/test"){
  require('./Styling/testPageStyle.css');
}else if (window?.location.pathname === "/modify_test"){
  require('./Styling/modifyTestStyle.css');
}else if (window?.location.pathname === "/modify_question"){
  require('./Styling/modifyQuestionStyle.css');
}else if (window?.location.pathname === "/modify_account"){
  require('./Styling/modifyAccountStyle.css');
}else if (window?.location.pathname === "/"){
  require('./Styling/homeStyle.css');
}

class App extends Component {
  state = {
    data: null
  };

  callBackendAPI = async () => {
    const response = await fetch('/myresponse');
    const body = await response.json();
    console.log(body)
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  // //Hide Go To Login Button
  // hideButton(e){
  //   document.getElementById("goToLoginButton").style.display = "none";
  // }

  // Route paths for every single page
  render() {
    return (
      <BrowserRouter>  
        <Routes>
          <Route path = "/login" element = {<Login/>} caseSensitive/>
          <Route path = "/create_account" element = {<CreateAccount/>} caseSensitive />
          <Route path = "/profile" element = {<Profile/>} caseSensitive />
          <Route path = "/test" element = {<TestPage/>} caseSensitive />
          <Route path = "/modify_account" element = {<ModifyAccount/>} caseSensitive />
          <Route path = "/modify_test" element = {<ModifyTest/>} caseSensitive />
          <Route path = "/modify_question" element = {<ModifyQuestion/>} caseSensitive />
          <Route exact path = "/" element = {<Home/>} caseSensitive />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;


//
// componentDidMount() {
//   this.callBackendAPI()
//     .then(res => this.setState({ data: res.express }))
//     .catch(err => console.log(err));
// }