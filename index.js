const asker = require('./src/asker.js');
const github = require('./src/github.js');
const helper = require('./src/helper.js');

let REPOS; // Global reference to collection of repos
let ORIGINAL_ANSWERS; // Global reference to inital request from user
let CONF_DATA;

helper.checkForConfData()
.then((confData) => {
  if (!confData) {
    return asker.getConfData()
      .then((confData) => {
        helper.saveConfData(confData);
        // confData = helper.validateConfData(confData);
        return confData
      })
  } else {
    // confData = helper.validateConfData(confData);
    return confData
  }
})
.then((confData) => {
  console.log(confData);
})
// github.getRepos()
//   .then(repos => {
//     REPOS = repos;
//     return asker.getUserRequest(repos);
//   })
//   .then(answers => {
//     ORIGINAL_ANSWERS = answers;
//     return asker.confirmUserRequest(answers);
//   })
//   .then(answers => {
//     if (answers.userIsSure) {
//       if (ORIGINAL_ANSWERS.action === 'DELETE'){
//         github.removeRepos(ORIGINAL_ANSWERS.repos, logStatus);
//       } else if (ORIGINAL_ANSWERS.action === 'BACKUP') {
//         github.backupRepos(ORIGINAL_ANSWERS.repos, logStatus);
//       }
//       else if (ORIGINAL_ANSWERS.action === 'BACKUP & DELETE') {
//         github.backupRepos(ORIGINAL_ANSWERS.repos, (err, data) => {
//           if(err) {
//             console.log(err);
//           }
//           console.log(data);
//           github.removeRepos(ORIGINAL_ANSWERS.repos, logStatus);
//         });
//       }
//     } else {
//         console.log('No sweat');
//     }
//   })
//   .catch(err => console.log(err));
// 
//   function logStatus(err, data){
//     if (err) {
//       console.log(err);
//     }
//     console.log(data);
//   }
