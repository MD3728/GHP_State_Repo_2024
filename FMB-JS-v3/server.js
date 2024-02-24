//Server (Database/Backend) File
//DO NOT CONNECT TO DATABASE MORE THAN ONCE
//Read README.md to download dependencies

//Require Module
let mysql = require('mysql');
let http = require('http');
const express = require('express');
let app = express();
let url = require('url');
let fs = require('fs');
let cors = require("cors");
app.use(cors());
app.use(express.text());
let finalResultAccount = "";
let finalResultTest = "";
let finalResultQuestion = "";

//Connect To Server
app.listen(3001, () => {
  console.log("Server Listening On Port 3001")
});

//Connect To Database
let conn = mysql.createConnection({
  host: "localhost",
  user: "md3728",
  password: "P509@P509",
  database: "sitedatabase",
  port: 3308
});

conn.connect(function(err) {
  if (err) throw err;
  conn.query("SELECT * FROM Tests", function (err, result) {
    if (err) throw err;
    console.log("Database Connected");
  });
});

//Update Database Information After Doing Query
function updateDatabaseInformation(){
  //Select All Test
  conn.query("SELECT * FROM Tests", function (err, result) {
    if (err) throw err;
    console.log("Tests Read");
    finalResultTest = result;
    app.post("/selectAllTest", (req, res) => {
      res.write(JSON.stringify(finalResultTest));
      res.end();
    });
  });
  
  //Select All Question
  conn.query("SELECT * FROM Questions", function (err, result) {
    if (err) throw err;
    console.log("Questions Read");
    finalResultQuestion = result;
    app.post("/selectAllQuestion", (req, res) => {
      res.write(JSON.stringify(finalResultQuestion));
      res.end();
    });
  });
  
  //Select All Account
  conn.query("SELECT * FROM Accounts;", function (err, result) {
    if (err) throw err;
    console.log("Accounts Read");
    finalResultAccount = result;
    app.post("/selectAllAccount", function(req, res){
      res.write(JSON.stringify(finalResultAccount));
      res.end();
    });
  });
}

//Perform Command (Given From React)
app.post("/queryCommand", function(req, res){
  let sql = req.body;
  console.log("Query Given: " + sql);
  conn.query(sql, function (err, result){
    if (err) throw err;
    console.log("Query Successful");
    updateDatabaseInformation();
    res.end();
  });
});

//Refresh Data
app.post("/refreshData", function(req, res){
  updateDatabaseInformation();
  res.end();//Really Important
});

//Update Table In Case Of External Changes (Unused)
// app.post("/updateTable", function(req, res){
//   updateDatabaseInformation();
//   console.log("Tables Updated");
// });

updateDatabaseInformation();

//Create Server on localhost:8080 (Test)
/*http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  let filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080); */


