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

exports.updateUserQuiz = updateUserQuiz;
exports.createNewUser = createNewUser;
