const path = require("path");
const express = require("express");
const fs = require("fs");
const util = require("./util/Util");

const app = express();

const port = process.env.PORT || 3030;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/quiz/results/:username", (req, res) => {
  try {
    const usernameSelector = require(`./${req.params.username}.json`);
    res.json(usernameSelector);
  } catch {
    res.status(400).json({ msg: `cant find ${req.params.username}` });
  }
});

//quiz answer by friend
app.post("/quiz/results/:username/:quizname/answer", (req, res) => {
  const answer = {
    quizname: req.params.quizname,
    username: req.body.username,
    answers: req.body.answers,
  };
  util.updateFriendAnswer(answer, req.params.username)
    ? res.json({ update: "user Updated" })
    : res.json({ error: "user Already exsit" });
});

//quiz score
app.get(
  "/quiz/results/:username/:quizname/summary/:friendanswer",
  (req, res) => {
    return util.getQuizScoreByFriend(
      req.params.username,
      req.params.quizname,
      req.params.friendanswer,
      res
    )
  }
);

//add new user profile
app.post("/", function (req, res) {
  const newMember = {
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    answers: [],
    friendsAnswer: [],
    id: Math.floor(Math.random() * 99999) + 100,
  };
  util.createNewUser(newMember)
    ? res.json({ update: "user Updated" })
    : res.json({ error: "user Already exsit" });
});

//create new quiz and update profile
app.post("/quiz/:username/create", function (req, res) {
  const quiz = {
    quizname: req.body.quizname,
    answers: req.body.answers,
  };

  util.updateUserQuiz(quiz, req.params.username)
    ? res.json({ update: "user Updated" })
    : res.json({ error: "user not exsit" });
});

app.listen(port, () => {
  console.log("Server is up on port 3030.");
});
