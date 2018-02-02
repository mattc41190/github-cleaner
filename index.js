const asker = require('./src/asker.js');
const Github = require('./src/github.js');
const Helper = require('./src/helper.js');
let github;

let REPOS; // Global reference to collection of repos
let ORIGINAL_ANSWERS; // Global reference to inital request from user
let CONF_DATA;

Helper.checkForConfData()
.then((confData) => {
  if (!confData) {
    return asker.getConfData()
      .then((confData) => {
        Helper.saveConfData(confData);
        return Helper.validateConfData(confData)
        .then((confData) =>{
          return confData;
        })
      })
  } else {
    return Helper.validateConfData(confData)
    .then((confData) =>{
      return confData;
    });
  }
})
.then((confData) => {
  github = new Github(confData);
  return github.getRepos();
})
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
      console.log('No sweat');
  }
})
.catch(err => console.log(err));

function logStatus(err, data){
  if (err) {
    console.log(err);
  }
  console.log(data);
}
