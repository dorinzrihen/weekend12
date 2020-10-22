const fs = require("fs");
const dbUderFile = "Users.json";

const CheckExistUserName = (data, username) => {
  const mydata = JSON.parse(data);
  const existUsername = mydata.some((user) => {
    return user.username === username;
  });
  return existUsername;
};

const updateFileWithNewUser = (newMember) => {
  let newUser = JSON.stringify(newMember);
  fs.readFile(dbUderFile, function (err, data) {
    if (err) {
      return console.log(err);
    }
    if (!CheckExistUserName(data, newMember.username)) {
      const UpdatedData = JSON.parse(data.toString());
      UpdatedData.push(JSON.parse(newUser));
      fs.writeFileSync(dbUderFile, JSON.stringify(UpdatedData));
    } else {
      return false;
    }
  });
  return true
};

exports.CheckExistUserName = CheckExistUserName;
exports.updateFileWithNewUser = updateFileWithNewUser;
