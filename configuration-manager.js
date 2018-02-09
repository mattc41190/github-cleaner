const fs = require('fs');
const Helper = require('./src/helper.js');
const asker = require('./src/asker.js');

const createNewConfig = function createNewConfig () {
  return asker.getConfData()
    .then((confData) => {
      Helper.saveConfData(confData);
      return Helper.validateConfData(confData)
    })
    .then((confData) => {
      return confData;
    })
    .catch(err => console.log(err));
}

const modifyConfig = function modifyConfig (confData) {
  return asker.getConfChangeRequest(confData)
    .then((answers) => {
      confData.username = answers.newUsername ? answers.newUsername : confData.username;
      confData.token = answers.newToken ? answers.newToken : confData.token;
      confData.archivesPath = answers.newArchivesPath ? answers.newArchivesPath : confData.archivesPath;
      confData.apiBase = answers.newApiBase ? answers.newApiBase : confData.apiBase;
      return Helper.validateConfData(confData);
    })
    .then((confData) => {
      Helper.saveConfData(confData)
    })
    .catch(err => console.log(err));
}

const manageConfiguration = function manageConfiguration() {
  return Helper.checkForConfData()
  .then((confData) => {
    if (!confData) {
      return createNewConfig();
    }
    return modifyConfig(confData);
  })
  .catch(err => {console.log(err);})
}


module.exports = {manageConfiguration};