const path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();
const CONF_FILE = 'github-cleaner-conf.json';

function checkForConfData() {
  return new Promise(function(resolve, reject) {
    let homedirConf = `${homedir}/${CONF_FILE}`;
    let parentdirConf = `${path.join(__dirname, '../')}${CONF_FILE}`
    if (fs.existsSync(homedirConf)) {
      resolve(JSON.parse(fs.readFileSync(homedirConf)));
    } else if(fs.existsSync(parentdirConf)) {
      resolve(JSON.parse(fs.readFileSync(parentdirConf)));
    } 
    resolve(null); // If no conf file found return null
  });
}

function saveConfData(confData) {
  fs.writeFileSync('github-cleaner-conf.json', JSON.stringify(confData));
}

module.exports = {checkForConfData, saveConfData};