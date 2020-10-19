const path = require("path");
const express = require("express");
const fs = require("fs");


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.get("/quiz/results/:username", (req, res) => {
  try{
    const usernameSelector = require(`./${req.params.username}.json`);
    res.json(usernameSelector); 
  }
  catch{
    res.status(400).json({ msg: `cant find ${req.params.username}` });
  }
});

//quiz answer by friend
app.post("/quiz/results/:username/:quizname/answer", (req, res) => {
  const answer = {
    username:req.body.username,
    answers: req.body.answers,
  };

  const usernamePath = `./${req.params.username}.json`
  console.log(usernamePath);

  //if the path is correct update the new answer
  if(fs.existsSync(usernamePath)){
    const usernameSelector = require(`./${req.params.username}.json`);
    usernameSelector[req.params.quizname] ? usernameSelector[req.params.quizname].push(answer) : usernameSelector[req.params.quizname] = [answer];
    fs.writeFile(usernamePath, JSON.stringify(usernameSelector), function (
      err
    ) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was Updated");
    });
  }
  else{
    console.log("Ops, cant find the file");
  }
});

//quiz score
app.get("/quiz/results/:username/:quizname/summary/:friendanswer", (req, res) => {
  const usernameSelector = require(`./${req.params.username}.json`);
  let score = 0;
  let friendAnswer = [];
  let userAnswer = [];
  let spesificFriendAnswer = usernameSelector[req.params.quizname];
  for(const value in spesificFriendAnswer){
    if(spesificFriendAnswer[value].username === req.params.friendanswer){
      friendAnswer = spesificFriendAnswer[value].answers;
    }
  }

  for(const value in usernameSelector.answers){
    if(usernameSelector.answers[value].quizname === req.params.quizname){
      userAnswer = usernameSelector.answers[value].answers;
    }
  }

  for(const answer in userAnswer){
    if(userAnswer[answer] === friendAnswer[answer]){
      score+=1;
    }
  }

  res.json({msg:`score ${score}/${userAnswer.length}`})
});

//add new quiz username 
app.post("/", function (req, res) {
  const newMember = {
    username:req.body.username,
    name: req.body.name,
    answers:[],
    id: Math.floor(Math.random() * 99999) + 100,
  };

  //file not exists - no username with this name
  const usernamePath = `./${req.body.username}.json`
  if(!fs.existsSync(usernamePath)){
    fs.writeFile(`${newMember.username}.json`, JSON.stringify(newMember), function (
      err
    ) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }
  else{
    console.log("username already taken, pick another one");
  }
});


//create new quiz and update profile
app.post("/quiz/:username/create", function (req, res) {
  const quiz = {
    quizname:req.body.quizname,
    answers: req.body.answers,
  };

  const usernamePath = `./${req.params.username}.json`
  if(fs.existsSync(usernamePath)){
    const usernameSelector = require(`./${req.params.username}.json`);
    usernameSelector.answers.push(quiz)
    fs.writeFile(usernamePath, JSON.stringify(usernameSelector), function (
      err
    ) {
      if (err) {
        return console.log(err);
      }
      console.log("The file update");
    });
  }
  else{
    console.log("something wrong");
  }
});



app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
