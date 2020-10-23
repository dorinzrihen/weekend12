const fs = require("fs");

// const CheckExistUserName = (data, username) => {
//   const mydata = JSON.parse(data);
//   const existUsername = mydata.some((user) => {
//     return user.username === username;
//   });
//   return existUsername;
// };

const getUserPath = (username) => {
  return `./users/${username}.json`;
};

const createNewUser = (newMember) => {
  let newUser = JSON.stringify(newMember);
  const usernamePath = getUserPath(newMember.username);
  if (fs.existsSync(usernamePath)) {
    return false;
  }
  fs.writeFileSync(usernamePath, JSON.stringify(JSON.parse(newUser)));
  return true;
};

const checkIfUserExist = (username) => {
  const usernamePath = getUserPath(username);
  if (!fs.existsSync(usernamePath)) {
    return false;
  }
  return true;
};

const updateUserQuiz = (quiz, username) => {
  if (!checkIfUserExist(username)) {
    return false;
  }
  let newQuizAnswer = JSON.stringify(quiz);
  fs.readFile(getUserPath(username), function (err, data) {
    if (err) {
      return console.log(err);
    }
    const updatedData = JSON.parse(data.toString());
    updatedData.answers.push(JSON.parse(newQuizAnswer));
    fs.writeFileSync(getUserPath(username), JSON.stringify(updatedData));
  });
  return true;
};

const updateFriendAnswer = (answers, username) => {
  if (!checkIfUserExist(username)) {
    return false;
  }
  let newQuizAnswer = JSON.stringify(answers);
  fs.readFile(getUserPath(username), function (err, data) {
    if (err) {
      return console.log(err);
    }
    const updatedData = JSON.parse(data.toString());
    updatedData.friendsAnswer.push(JSON.parse(newQuizAnswer));
    fs.writeFileSync(getUserPath(username), JSON.stringify(updatedData));
  });
  return true;
};

const getQuizScoreByFriend = (user, quizname , friendUser, res) => {
  let friendscore = 0;
  if (!checkIfUserExist(user)) {
    return res.json ({msg:"error"});
  }
  fs.readFile(getUserPath(user), function (err, data) {
    if (err) {
      return console.log(err);
    }
    const accInfo = JSON.parse(data);
    const userAnswer = accInfo.answers.find(quiz =>{
      return quiz.quizname === quizname
    })
    const friendAnswer = accInfo.friendsAnswer.find(quiz => {
      return quiz.quizname === quizname && quiz.username === friendUser;
    })
    //count score 
    for(let i = 0; i< userAnswer.answers.length; i++){
      if (userAnswer.answers[i] ===friendAnswer.answers[i] ) {
        friendscore +=1;
      }
    }
    
    res.json ({score: friendscore , questionLen:userAnswer.answers.length});

  });

};

exports.updateUserQuiz = updateUserQuiz;
exports.createNewUser = createNewUser;
exports.updateFriendAnswer = updateFriendAnswer;
exports.getQuizScoreByFriend = getQuizScoreByFriend;
