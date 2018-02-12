const fs = require('fs');
const Github = require('./src/github.js');
const asker = require('./src/asker.js');

const manageGithub = function manageGithub(confData) {
  const github = new Github(confData)
  return github.getRepos()
  .then(repos => {
    REPOS = repos;
    return asker.getUserRequest(repos);
  })
  .then(answers => {
    ORIGINAL_ANSWERS = answers;
    return asker.confirmUserRequest(answers);
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
        console.log('No problem');
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