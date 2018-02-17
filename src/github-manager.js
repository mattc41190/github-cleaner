const fs = require('fs');
const Github = require('./github.js');
const Asker = require('./asker.js');

const manageGithub = function manageGithub(confData) {
  let ORIGINAL_ANSWERS;
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
      if (ORIGINAL_ANSWERS.action === 'DELETE') {
        return github.removeRepos(ORIGINAL_ANSWERS.repos);
      } else if (ORIGINAL_ANSWERS.action === 'BACKUP') {
        return github.backupRepos(ORIGINAL_ANSWERS.repos)
      }
      else if (ORIGINAL_ANSWERS.action === 'BACKUP & DELETE') {
        return github.backupRepos(ORIGINAL_ANSWERS.repos)
        .then((data) => github.removeRepos(ORIGINAL_ANSWERS.repos));  
      }
    }
    return true;
  })
  .catch(err => console.log(Object.keys(err)));
}

module.exports = {manageGithub};