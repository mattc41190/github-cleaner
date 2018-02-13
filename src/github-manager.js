const fs = require('fs');
const Github = require('./github.js');
const Asker = require('./asker.js');

const manageGithub = function manageGithub(confData) {
  const github = new Github(confData)
  return github.getRepos()
  .then(repos => {
    REPOS = repos;
    return Asker.getUserRequest(repos);
  })
  .then(answers => {
    if (answers.action === 'NONE') {
      return true;
    }
    ORIGINAL_ANSWERS = answers;
    return Asker.confirmUserRequest(answers);
  })
  .then(answers => {
    if (answers.userIsSure) {
      if (ORIGINAL_ANSWERS.action === 'DELETE'){
        github.removeRepos(ORIGINAL_ANSWERS.repos, logStatus);
      } else if (ORIGINAL_ANSWERS.action === 'BACKUP') {
        github.backupRepos(ORIGINAL_ANSWERS.repos, logStatus);
      }
      else if (ORIGINAL_ANSWERS.action === 'BACKUP & DELETE') {
        github.backupRepos(ORIGINAL_ANSWERS.repos, (err, data) => {
          if(err) {
            console.log(err);
          }
          console.log(data);
          github.removeRepos(ORIGINAL_ANSWERS.repos, logStatus);
        });
      }
    } else {
      // Reset Point
        return true;
    }
  })
  .catch(err => console.log(err));
}


function logStatus(err, data){
  if (err) {
    console.log(err);
  }
  console.log(data);
}

module.exports = {manageGithub};