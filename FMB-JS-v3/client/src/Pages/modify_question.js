//Modify Question Page
import React, { Component } from 'react';

let currentQuestionNumber = 1;
let currentQuestion = null;
let allQuestion = "";

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

class ModifyQuestion extends Component {
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

  //Method For Changing Current Editing Question
  async switchQuestion(increment){
    await fetch("http://localhost:3001/refreshData", {method: "POST",headers: {"Content-Type": "text/plain"},body: ""});//Update Data
    let finalResponse = "";
    await fetch("http://localhost:3001/selectAllQuestion", {method: "POST", headers: {"Content-Type": "application/JSON"}})
    .then(data => {return data.json()})
    .then(data => {console.log(data); finalResponse = data})
    .catch(error => console.log(error));
    allQuestion = finalResponse;
    console.log(allQuestion);
    let questionLength = allQuestion.length;
    currentQuestionNumber += increment;
    if (currentQuestionNumber > questionLength){//Index Limit Checking
      currentQuestionNumber = questionLength;
    }else if (currentQuestionNumber < 1){
      currentQuestionNumber = 1;
    }
    currentQuestion = allQuestion[currentQuestionNumber-1];
    //Show Question Type
    document.getElementById("idBox").value = currentQuestion.ID;
    switch (currentQuestion.Type){
      case 1://Free Response
        document.getElementById("freeTypeButton").checked = true;
        break;
      case 2://Multiple Choice
        document.getElementById("mcTypeButton").checked = true;
        break;
      case 3://Multiple Select
        document.getElementById("msTypeButton").checked = true;
        break;
      default:
        console.log("Invalid Question Type, Contact Administrator");
    }
    document.getElementById("questionBox").value = currentQuestion.Question;
    document.getElementById("answerBox").value = currentQuestion.Answer;
    //Show Answer Choices If Necessary
    if (currentQuestion.Type === 1){//Free Response
      document.getElementById("answerBox").disabled = false;
      document.getElementById("answerChoiceEdit").style.display = "none";
    }else{
      document.getElementById("answerBox").disabled = true;
      document.getElementById("answerChoiceEdit").style.display = "block";
      //Reset Choices
      for (let a = 1; a < 13; a++){
        document.getElementById(`option${a}`).checked = false;
      }
      for (let b = 1; b < 7; b++){
        document.getElementById(`answer${b}`).value = "";
      }
      if (currentQuestion.Type === 2){//Multiple Choice
        document.getElementById("mcChoice").style.display = "block";
        document.getElementById("msChoice").style.display = "none";
        //Find and check correct answer
        let questionAnswer;
        switch (currentQuestion.Answer){
          case 'A':
            questionAnswer = 1;
            break;
          case 'B':
            questionAnswer = 2;
            break;
          case 'C':
            questionAnswer = 3;
            break;
          case 'D':
            questionAnswer = 4;
            break;
          case 'E':
            questionAnswer = 5;
            break;
          case 'F':
            questionAnswer = 6;
            break;
          default:
            questionAnswer = 1;
        }
        document.getElementById(`option${questionAnswer}`).checked = true;
      }else{//Multiple Select
        document.getElementById("mcChoice").style.display = "none";
        document.getElementById("msChoice").style.display = "block";
        let questionAnswer = [];
        let splitAnswer = currentQuestion.Answer.split(":");
        for (let nextAnswer of splitAnswer){
          switch (nextAnswer){
            case 'a':
              questionAnswer.push(1);
              break;
            case 'b':
              questionAnswer.push(2);
              break;
            case 'c':
              questionAnswer.push(3);
              break;
            case 'd':
              questionAnswer.push(4);
              break;
            case 'e':
              questionAnswer.push(5);
              break;
            case 'f':
              questionAnswer.push(6);
              break;
            default:
              questionAnswer.push(1);
          }
        }
        for (let a = 0; a < questionAnswer.length; a++){
          document.getElementById(`option${questionAnswer[a] + 6}`).checked = true;
        }
      }
      let answerChoices = currentQuestion.AnswerChoice.split(":");
      let startingIndex = 1;
      for (let a = 1; a < 7; a++){//Reset Inputs
        document.getElementById(`answer${a}`).value = "";
      }
      for (let nextChoice of answerChoices){
        document.getElementById(`answer${startingIndex}`).value = nextChoice;
        startingIndex++;
      }
    }
  }

  checkString(givenString = ""){//Returns true if string does not have bad characters, returns false if string has bad characters
    if ((givenString.includes('\'') === false)&&(givenString.includes(':') === false)&&(givenString.includes('\\') === false)){//No bad characters
      return true;//Meets requirements
    }
    return false;//Does not meet requirements
  }

  //Update Question Attributes
  updateQuestion(){
    let sqlQuery;
    if (document.getElementById("mcTypeButton").checked){//Multiple Choice
      let clickedAnswer = "A";
      let spliceIndex = 1;
      for (let a = 1; a < 7; a++){
        if (document.getElementById(`option${a}`).checked){//Find Right Answer
          switch(a){
            case 1:
              clickedAnswer = "A";
              break;
            case 2:
              clickedAnswer = "B";
              break;
            case 3:
              clickedAnswer = "C";
              break;
            case 4:
              clickedAnswer = "D";
              break;
            case 5:
              clickedAnswer = "E";
              break;
            case 6:
              clickedAnswer = "F";
              break;
            default:
              console.log("Nothing checked or bad radio button, Contact Administrator");          
          }
        }
        if (document.getElementById(`answer${a}`).value !== ""){//Find splice point
          spliceIndex = a;
        }
      }
      let allChoices = [];
      for (let b = 1; b < spliceIndex + 1; b++){//Compile answers
        if (this.checkString(document.getElementById(`answer${b}`).value)){//String must satisfy requirements
          allChoices.push(document.getElementById(`answer${b}`).value);
        }else{
          alert("Update Failed\nMake sure to not use \\ (backslash), ' (single quote), or : (colon)\n in any of the fields");
          return 1;
        }
      }
      allChoices = allChoices.join(":");
      sqlQuery = `UPDATE Questions SET Type = 2, Question = '${document.getElementById("questionBox").value}', Answer = '${clickedAnswer}', AnswerChoice = '${allChoices}' WHERE ID = ${parseInt(document.getElementById("idBox").value)};`;
    }else if (document.getElementById("msTypeButton").checked){//Multiple Select
      let clickedAnswer = [];
      let spliceIndex = 1;
      for (let a = 1; a < 7; a++){
        if (document.getElementById(`option${a+6}`).checked){//Find Right Answer
          switch(a){
            case 1:
              clickedAnswer.push("a");
              break;
            case 2:
              clickedAnswer.push("b");
              break;
            case 3:
              clickedAnswer.push("c");
              break;
            case 4:
              clickedAnswer.push("d");
              break;
            case 5:
              clickedAnswer.push("e");
              break;
            case 6:
              clickedAnswer.push("f");
              break;
            default:
              console.log("Nothing checked or bad radio button, Contact Administrator");          
          }
        }
        if (document.getElementById(`answer${a}`).value !== ""){//Find splice point
          spliceIndex = a;
        }
      }
      if (clickedAnswer.length === 0){//Failsafe
        clickedAnswer.push("a");
      }
      clickedAnswer = clickedAnswer.join(":");
      let allChoices = [];
      for (let b = 1; b < spliceIndex + 1; b++){//Compile answers
        if (this.checkString(document.getElementById(`answer${b}`).value)){//String must satisfy requirements
          allChoices.push(document.getElementById(`answer${b}`).value);
        }else{
          alert("Update Failed\nMake sure to not use \\ (backslash), ' (single quote), or : (colon)\n in any of the fields");
          return 1;
        }
      }
      allChoices = allChoices.join(":");
      sqlQuery = `UPDATE Questions SET Type = 3, Question = '${document.getElementById("questionBox").value}', Answer = '${clickedAnswer}', AnswerChoice = '${allChoices}' WHERE ID = ${parseInt(document.getElementById("idBox").value)};`;
    }else{//Free response or default
      sqlQuery = `UPDATE Questions SET Type = 1, Question = '${document.getElementById("questionBox").value}', Answer = '${document.getElementById("answerBox").value}', AnswerChoice = '' WHERE ID = ${parseInt(document.getElementById("idBox").value)};`;
    }
    let originalThis = this;
    fetch("http://localhost:3001/queryCommand", {
      method: "POST",
      headers: {"Content-Type": "text/plain"},
      body: sqlQuery
    }).then(data => {originalThis.switchQuestion(0); alert("Update Successful");});
  }
  
  //Prepare To Create Account
  newQuestion(){
    document.getElementById("idBox").value = "";
    document.getElementById("questionBox").value = "";
    document.getElementById("answerBox").value = "";
    document.getElementById("answerBox").disabled = false;
    document.getElementById("freeTypeButton").checked = false;
    document.getElementById("mcTypeButton").checked = false;
    document.getElementById("msTypeButton").checked = false;
    //Assume Default Case Is Multiple Select
    document.getElementById("mcChoice").style.display = "none";
    document.getElementById("msChoice").style.display = "block";
    document.getElementById("answerChoiceEdit").style.display = "block";
    for (let a = 1; a < 7; a++){//Clear Entries
      document.getElementById(`answer${a}`).value = "";
      document.getElementById(`option${a+6}`).checked = false;
    }
    document.getElementById("buttonDiv").style.display = "none";
    document.getElementById("confirmAddDiv").style.display = "block";
  }

  //Add Account (With Query)
  addQuestion(){
    let finalType;//Question Type
    let sqlQuery;
    if (document.getElementById("mcTypeButton").checked){//Multiple Choice
      finalType = 2;
      let correctAnswer = "A";
      let spliceIndex = 1;
      //Find Answer Choice Scope and correct answer
      for (let a = 1; a < 7; a++){
        if (document.getElementById(`option${a+6}`).checked === true){
          switch(a){
            case 1:
              correctAnswer = "A";
              break;
            case 2:
              correctAnswer = "B";
              break;
            case 3:
              correctAnswer = "C";
              break;
            case 4:
              correctAnswer = "D";
              break;
            case 5:
              correctAnswer = "E";
              break;
            case 6:
              correctAnswer = "F";
              break;
            default:
              console.log("Invalid Answer Selected");
          }//Find Answer Choice
        }
        if (document.getElementById(`answer${a}`).value !== ""){//Check if choices should be cut off at index
          spliceIndex = a;
        }
      }
      //List final answer choices
      let answerChoices = [];
      for (let b = 1; b < spliceIndex + 1; b++){
        answerChoices.push(document.getElementById(`answer${b}`).value);
      }
      answerChoices = answerChoices.join(":");
      sqlQuery = `INSERT INTO Questions (Type, Question, Answer, AnswerChoice) VALUES (${finalType}, '${document.getElementById("questionBox").value}', '${correctAnswer}', '${answerChoices}');`;
    }else if (document.getElementById("msTypeButton").checked){//Multiple Select
      finalType = 3;
      let correctAnswer = [];
      let spliceIndex = 1;
      //Find Answer Choice Scope and Correct Answers
      for (let a = 1; a < 7; a++){
        if (document.getElementById(`option${a+6}`).checked === true){
          switch(a){
            case 1:
              correctAnswer.push("a");
              break;
            case 2:
              correctAnswer.push("b");
              break;
            case 3:
              correctAnswer.push("c");
              break;
            case 4:
              correctAnswer.push("d");
              break;
            case 5:
              correctAnswer.push("e");
              break;
            case 6:
              correctAnswer.push("f");
              break;
            default:
              console.log("Invalid Answer Selected");
          }//Find Answer Choice
        }
        if (document.getElementById(`answer${a}`).value !== ""){//Check if choices should be cut off at index
          spliceIndex = a;
        }
      }
      if (correctAnswer.length === 0){//Failsafe if no answer selected
        correctAnswer.push("a");
      }
      correctAnswer = correctAnswer.join(":");
      //List final answer choices
      let answerChoices = [];
      for (let b = 1; b < spliceIndex + 1; b++){
        answerChoices.push(document.getElementById(`answer${b}`).value);
      }
      answerChoices = answerChoices.join(":");
      sqlQuery = `INSERT INTO Questions (Type, Question, Answer, AnswerChoice) VALUES (${finalType}, '${document.getElementById("questionBox").value}', '${correctAnswer}', '${answerChoices}');`;
    }else{//Free Response or Default
      finalType = 1;
      sqlQuery = `INSERT INTO Questions (Type, Question, Answer, AnswerChoice) VALUES (${finalType}, '${document.getElementById("questionBox").value}', '${document.getElementById("answerBox").value}', '');`;
    }
    let originalThis = this;
    fetch("http://localhost:3001/queryCommand", {method: "POST", headers: {"Content-Type": "text/plain"}, body: sqlQuery})
    .then(originalThis.switchQuestion(100000))
    .catch(error => console.log(error));
    alert("Creation Successful");
    document.getElementById("buttonDiv").style.display = "block";
    document.getElementById("confirmAddDiv").style.display = "none";
  }

  //Cancel Add Question
  cancelAdd(){
    document.getElementById("buttonDiv").style.display = "block";
    document.getElementById("confirmAddDiv").style.display = "none";
    this.switchQuestion(0);
  }
  
  //Delete Question
  deleteQuestion(){
    if (window.confirm("Delete This Entry?")){//Confirmation Box
      let sqlQuery = `DELETE FROM Questions WHERE ID = ${parseInt(document.getElementById("idBox").value)};`;
      fetch("http://localhost:3001/queryCommand", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: sqlQuery
      });
      alert("Deletion Successful");
      this.switchQuestion(0);
    }
  }

  //On load
  componentDidMount() {
    this.switchQuestion(0);
  }

  render() {
    return (
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
      <div id = "generalContentDiv" className = "row">
        {/* General Objects */}
        <div className = "col-sm-2">        

        </div>  
        <div id = "biggerDiv" className = "col-sm-8 middleSection align-items-center justify-content-center">    
          {/* Inputs */}
          <div id = "inputDiv" className='standardBox'>
             {/* Decoration */}
            <p id = "currentEntryTag">Current Question:</p>
            <p id = "questionIdTag">Question ID:</p>
            <p id = "typeTag">Type:</p>
            <p id = "questionTag">Question:</p>
            <p id = "answerTag">Answer:</p>
            <input type = "text" id = "idBox" name = "idBox" disabled = {true} />
            <input type = "text" id = "questionBox" name = "questionBox" />
            <input type = "text" id = "answerBox" name = "answerBox" />
            {/* Type Select */}
            <label id = "mcTypeLabel">
              <input type = "radio" id = "freeTypeButton" name = "typeSelect" /> Free Response
            </label>
            <label id = "msTypeLabel">
              <input type = "radio" id = "mcTypeButton" name = "typeSelect" /> Multiple Choice
            </label>
            <label id = "freeTypeLabel">
              <input type = "radio" id = "msTypeButton" name = "typeSelect" /> Multiple Response
            </label>
            {/* Answer Select */}
            <div id = "answerChoiceEdit">
              <p id = "answerChoiceTag">Answer Choices:</p>
              {/* Multiple Choice */}
              <div id = "mcChoice">
                <label id = "opt1Label">
                  <input type = "radio" id = "option1" name = "optionSelect" /> A:
                </label>
                <label id = "opt2Label">
                  <input type = "radio" id = "option2" name = "optionSelect" /> B:
                </label>
                <label id = "opt3Label">
                  <input type = "radio" id = "option3" name = "optionSelect" /> C:
                </label>
                <label id = "opt4Label">
                  <input type = "radio" id = "option4" name = "optionSelect" /> D:
                </label>
                <label id = "opt5Label">
                  <input type = "radio" id = "option5" name = "optionSelect" /> E:
                </label>
                <label id = "opt6Label">
                  <input type = "radio" id = "option6" name = "optionSelect" /> F:
                </label>
              </div>
              {/* Multiple Select */}
              <div id = "msChoice">
                <label id = "opt7Label">
                  <input type = "checkbox" id = "option7" name = "optionSelect" /> A:
                </label>
                <label id = "opt8Label">
                  <input type = "checkbox" id = "option8" name = "optionSelect" /> B:
                </label>
                <label id = "opt9Label">
                  <input type = "checkbox" id = "option9" name = "optionSelect" /> C:
                </label>
                <label id = "opt10Label">
                  <input type = "checkbox" id = "option10" name = "optionSelect" /> D:
                </label>
                <label id = "opt11Label">
                  <input type = "checkbox" id = "option11" name = "optionSelect" /> E:
                </label>
                <label id = "opt12Label">
                  <input type = "checkbox" id = "option12" name = "optionSelect" /> F:
                </label>
              </div>
              {/* Answer Choice Select */}
              <input type = "text" id = "answer1" />
              <input type = "text" id = "answer2" />
              <input type = "text" id = "answer3" />
              <input type = "text" id = "answer4" />
              <input type = "text" id = "answer5" />
              <input type = "text" id = "answer6" />
            </div>
          </div>
          {/* Instructions */}
          <div id = "instructionDiv" className='standardBox'>
            <h1 id = "instructionText">
              <strong>Instructions:</strong><br />
              Use This Page To Change Question Data <br />
              "Save" Saves Changes On Current Entry <br />
              "New" Creates Template Question At End <br />
              "Delete" Deletes Current Entry <br />
            </h1>
          </div>
          {/* Buttons */}
          <div id = "buttonDiv">
            <input type = "submit" id="updateQuestion" value = "Save" onClick = {() => this.updateQuestion()} />
            <input type = "submit" id="newQuestion" value = "New" onClick = {() => this.newQuestion()} />
            <input type = "submit" id="deleteQuestion" value = "Delete" onClick = {() => this.deleteQuestion()} />
            <input type = "submit" id="next" value = "Next" onClick = {() => this.switchQuestion(1)} />
            <input type = "submit" id="back" value = "Back" onClick = {() => this.switchQuestion(-1)} />
          </div>
          <div id = "confirmAddDiv">
            <input type = "submit" id = "addQuestion" value = "Add" onClick = {() => this.addQuestion()} />
            <input type = "submit" id = "cancelAdd" value = "Cancel" onClick = {() => this.cancelAdd()} />
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

export default ModifyQuestion;


