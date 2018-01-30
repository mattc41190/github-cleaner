const asker = require('./src/asker.js');
const conf = require('./conf.js');
const github = require('./src/github.js');

let REPOS; // Global reference to collection of repos
let ORIGINAL_ANSWERS; // Global reference to inital request from user

github.getRepos(conf)
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
        github.removeRepos(conf, ORIGINAL_ANSWERS.repos, () => {
          console.log('Done');
        });
      } else if (ORIGINAL_ANSWERS.action === 'BACKUP') {
        github.backupRepos(conf, ORIGINAL_ANSWERS.repos, (err, data) => {
          if(err) {
            console.log(err);
          }
          console.log(data);
        });
      }
      else if (ORIGINAL_ANSWERS.action === 'BACKUP & DELETE') {
        github.backupRepos(conf, ORIGINAL_ANSWERS.repos, (err, data) => {
          if(err) {
            console.log(err);
          }
          console.log(data);
          github.removeRepos(conf, ORIGINAL_ANSWERS.repos, logStatus);
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
