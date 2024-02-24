//Profile (User) Page
import React, { Component } from 'react';

//Former JS
let allQuestions = [];
let currentQuestion;
let currentQuestionNumber = 1;
let ctx;

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

//Class For Holding Questions, Answers, and Answer Choices
class Question{
  constructor(id, type, question, answer, answerChoice, weight = 1){
    this.id = id;
    this.type = parseInt(type);
    this.question = question;
    this.answer = answer;
    this.givenAnswer = "";//Answer Given By User
    this.answerChoice = answerChoice.split(":");
    this.weight = weight;//Unused Feature
    allQuestions.push(this);
  }

  display(){
    let letterName = ["A","B","C","D","E","F","a","b","c","d","e","f","response"];
    document.getElementById("questionDisplay").innerHTML = `&nbspQuestion #${currentQuestionNumber}: <br/>&nbsp${this.question}`;//Show Question
    for (let nextElement of letterName){
      document.getElementById(`${nextElement}`).style.display = "none";
      if (nextElement !== "response"){//Not free response
        document.getElementById(`${nextElement}`).checked = false;
      }
    }
    if (this.type === 1){//Free Response
      document.getElementById("response").value = this.givenAnswer;
      document.getElementById("response").style.display = "block";
    }else if (this.type === 2){//Multiple Choice
      for (let v = 0; v < this.answerChoice.length;v++){
        document.getElementById(letterName[v]).style.display = "block";
        document.getElementById(letterName[v]).value = this.answerChoice[v];
        ctx.fillText(this.answerChoice[v],150,35+50*v);         
      }
      if (this.givenAnswer !== ''){//Fill in given answer
        document.getElementById(this.givenAnswer).checked = true;
      }
    }else if (this.type === 3){//Multiple Select
      for (let v = 6; v < this.answerChoice.length+6;v++){
        document.getElementById(letterName[v]).style.display = "block";
        document.getElementById(letterName[v]).value = this.answerChoice[v - 6];
        ctx.fillText(this.answerChoice[v - 6],150,-265 + 50*v);           
      }
      for (let a = 6; a < 13; a++){//Fill in given answer
        if (this.givenAnswer.includes(letterName[a])===true){
          document.getElementById(`${letterName[a]}`).checked = true;
        }
      }
    }
  }

  grade(){
    let correct = false;
    if (this.type === 1){//Free Response Grading
      let currentQuestionAnswer = this.answer;
      console.log("Actual Answer:" + this.answer);
      console.log("Given Answer:" + this.givenAnswer);
      if (currentQuestionAnswer.toString() === this.givenAnswer.toString()){
        correct = true;
      }
    }else if (this.type === 2){//Check For Multiple Choice
      let answerkey = this.answer;
      let realanswer = this.givenAnswer;
      console.log("Actual Answer:" + this.answer);
      console.log("Given Answer:" + realanswer);
      if (answerkey.toString() === realanswer.toString()){
        correct = true;
      }     
    }else if (this.type === 3){//Check For Multiple Select
      let answerkey = this.answer.split(':').sort();
      let givenAnswer = this.givenAnswer.split('').sort();
      console.log("Actual Answer:" + answerkey);
      console.log("Given Answer:" + givenAnswer);
      for (let currentAnswer of givenAnswer){
        if (answerkey.includes(currentAnswer)){
          correct = true;
        }else{
          correct = false;
          break;
        }  
      }
    }
    return correct;
  }

  updateQuestionAnswer(choice = null){
    if (this.type === 1){//Free Response
      this.givenAnswer = document.getElementById("response").value;
      console.log(document.getElementById("response").value);
    }else if (this.type === 2){//Multiple Choice
      currentQuestion.givenAnswer = choice;
    }else if (this.type === 3){//Multiple Select
      if (currentQuestion.givenAnswer.includes(choice)){
        currentQuestion.givenAnswer = currentQuestion.givenAnswer.replace(choice,'');
      }else{
        currentQuestion.givenAnswer += choice;
      }
    }
  }
}

class TestPage extends Component {
  constructor(){
    super();
    this.state = 
    {
      data: null
    };
  }

  // General Navigation Methods
  goToProfile(){
    if (window.confirm("Are you sure you want to leave and lose your progress?")){
      document.cookie = 'Test=0';
      document.location.href = "http://localhost:3000/profile";
    }
  }

  goToHome(){
    if (window.confirm("Are you sure you want to leave and lose your progress?")){
      document.cookie = 'Test=0';
      document.location.href = "http://localhost:3000/";
    }
  }

  logOut(){
    if (window.confirm("Are you sure you want to leave and lose your progress?")){
      document.cookie = 'Login=false';
      document.cookie = 'Test=0';
      checkLoginStatus();
    }
  }

  //Starting Function, Initializes All Question Objects And Sets Up Test
  findAllQuestion = async () => {//Retrieve Info from database
    let response1 = "";
    await fetch("http://localhost:3001/selectAllQuestion", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {return data.json()})
    .then(data => {response1 = data})
    .catch(error => console.log(error));
    let response2 = "";
    await fetch("http://localhost:3001/selectAllTest", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {return data.json()})
    .then(data => {response2 = data})
    .catch(error => console.log(error));
    //Find Correct Test
    allQuestions = [];
    let cookieContent = document.cookie.split('; ');
    //console.log(cookieContent);
    //console.log(document.cookie);
    let testID = cookieContent.find(row => row.startsWith('Test='));
    testID = testID.substring(5);
    if (parseInt(testID) === 0){//Test 0 means invalid test
      document.location.href = "http://localhost:3000/profile";
    }
    //Get Questions from Correct Test
    let fullTest = [];
    for (let currentTest of response2){//Find Test
      if (currentTest.ID === parseInt(testID)){
        fullTest = currentTest;
        break;
      }
    }
    console.log(fullTest);
    document.getElementById("testNameDisplay").innerHTML = `You are now taking ${fullTest.Name}`;
    let testQuestionID = fullTest.Questions.split(":");
    //Setup Questions
    let questionBank = response1;
    //console.log(testQuestionID);
    for (let currentCreateQuestion of questionBank){
      if (testQuestionID.includes(currentCreateQuestion.ID.toString()) === true){//If question in test
        new Question(currentCreateQuestion.ID, currentCreateQuestion.Type, currentCreateQuestion.Question, currentCreateQuestion.Answer, currentCreateQuestion.AnswerChoice);
      }
    }
    //Initialize Graphics
    //console.log(allQuestions);
    if (allQuestions.length === 0){//If test has no questions
      document.getElementById("display").value = "Test Has No Questions, Return To Home Page Or Contact Support";
      document.getElementById("next").disabled = true;
      document.getElementById("back").disabled = true;
      document.getElementById("submitTest").disabled = true;
    }else{//Regular Testing
      currentQuestion = allQuestions[0];
      this.changeQuestion(0);
    } 
  } 

  //Function For Change Question Numbers
  changeQuestion(direction){
    if (currentQuestion.type === 1){//Update Answer For Free Response
      currentQuestion.updateQuestionAnswer();
    }
    ctx.clearRect(0,0,1300,700);
    let letterName = ["A","B","C","D","E","a","b","c","d","e","f","response"];
    for (let s = 0; s<12;s++){//Hide All Inputs
      document.getElementById(letterName[s]).style.display = "none";
    }
    //Change Number
    currentQuestionNumber += direction;
    //console.log(currentQuestionNumber)
    //console.log(allQuestions)
    if (currentQuestionNumber > allQuestions.length){
      currentQuestionNumber = allQuestions.length;
    }
    if (currentQuestionNumber < 1){
      currentQuestionNumber = 1;
    }
    currentQuestion = allQuestions[currentQuestionNumber-1];
    currentQuestion.display();
  }

  //Function For Updating Answers As Test Progresses
  updateAnswer(choice){
    currentQuestion.updateQuestionAnswer(choice);
  }

  //Function For Grading Tests
  grade(){
    //Confirm Submission
    if (window.confirm("Submit Now? You Won't Be Able \nTo Go Back To The Questions")) {
      alert("Test Has Been Submitted");
    }else{
      return "Canceled";
    }
    if (currentQuestion.type === 1){//Update Answer For Free Response
      currentQuestion.updateQuestionAnswer();
    }
    //Grade
    let correctAnswers = 0;
    for (let gradeQuestion of allQuestions){
      console.log(gradeQuestion.type)
      if (gradeQuestion.grade()){//If Correct
        correctAnswers++;
      }
    }
    alert(`You Got: ${correctAnswers}/${allQuestions.length}`);
    window.location.href = "http://localhost:3000/profile";
  }

  //On load
  componentDidMount(){
    let c = document.getElementById('answerDisplay');
    ctx = c.getContext('2d');
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    this.findAllQuestion();
  }

  //Render HTML
  render() {
    return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-sm bg-dark">
        <div className="container-fluid">
          <ul className="navbar-nav" id = "generalNav">
            <li id = "homeNav" className = "nav-item">
              <input type = "submit" className = "btn text-light nav-link btn-dark" onClick = {this.goToHome} value = "Home" />
            </li>
            <li id = "profileNav" className = "nav-item">
              <input type = "submit" className = "btn text-light nav-link btn-dark" onClick = {this.goToProfile} value = "Profile" />
            </li>
            <li id = "logOutNav" className = "nav-item">
              <input type = "submit" className = "btn text-light nav-link btn-dark" onClick = {this.logOut} value = "Log Out" />
            </li>
          </ul>
        </div>
      </nav>
      <div id = "generalContentDiv" className = "row">
        {/* General Objects */}
        <div className = "col-sm-1">        

        </div>  
        <div id = "biggerDiv" className = "col-sm-10 middleSection align-items-center justify-content-center">    
          <h6 id = "testNameDisplay">You Are Now Taking</h6>
          <div id = "questionDisplay" className='standardBox'></div>
          <div id = "answerChoices" className='standardBox'>
            <canvas id = "answerDisplay" width = "700px" height = "400px"></canvas>
            <input type = "radio" id = "A" name = "m" onClick = {() => {this.updateAnswer('A')}} />
            <input type = "radio" id = "B" name = "m" onClick = {() => {this.updateAnswer('B')}} />
            <input type = "radio" id = "C" name = "m" onClick = {() => {this.updateAnswer('C')}} />
            <input type = "radio" id = "D" name = "m" onClick = {() => {this.updateAnswer('D')}} />
            <input type = "radio" id = "E" name = "m" onClick = {() => {this.updateAnswer('E')}} />
            <input type = "radio" id = "F" name = "m" onClick = {() => {this.updateAnswer('F')}} />
            <input type = "checkbox" id = "a" onClick = {() => {this.updateAnswer('a')}} />
            <input type = "checkbox" id = "b" onClick = {() => {this.updateAnswer('b')}} />
            <input type = "checkbox" id = "c" onClick = {() => {this.updateAnswer('c')}} />
            <input type = "checkbox" id = "d" onClick = {() => {this.updateAnswer('d')}} />
            <input type = "checkbox" id = "e" onClick = {() => {this.updateAnswer('e')}} />
            <input type = "checkbox" id = "f" onClick = {() => {this.updateAnswer('f')}} />
            <textarea id = "response" rows = "7" cols = "55"></textarea>
            {/* Navigation Buttons */}
            <input type = "submit" name = "Next" id = "next" value = "Next" onClick = {() => {this.changeQuestion(1)}} />
          <input type = "submit" name = "Back" id = "back" value = "Back" onClick = {() => {this.changeQuestion(-1)}} />
          </div>

          {/* <!-- Takes You to Grade --> */}
          <input type = "hidden" id = "answers" name = "answers" /> 
          <input type = "submit" name = "Start" id="submitTest" value = "Submit" onClick = {() => {this.grade()}} />
        </div>
        <div className = "col-sm-1">   

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

export default TestPage;

