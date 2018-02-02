const path = require('path');
const fs = require('fs');
const Github = require('./github.js');
const request = require('request');
const homedir = require('os').homedir();
const CONF_FILE = 'github-cleaner-conf.json';

class Helper {
  static checkForConfData() {
    return new Promise((resolve, reject) => {
      const homedirConf = `${homedir}/${CONF_FILE}`;
      const parentdirConf = `${path.join(__dirname, '../')}${CONF_FILE}`
      if (fs.existsSync(homedirConf)) {
        resolve(JSON.parse(fs.readFileSync(homedirConf)));
      } else if (fs.existsSync(parentdirConf)) {
        resolve(JSON.parse(fs.readFileSync(parentdirConf)));
      }
      resolve(null); // If no CONF_FILE found return null
    });
  }

  static saveConfData(confData) {
    fs.writeFileSync('github-cleaner-conf.json', JSON.stringify(confData));
  }

  static validateConfData(confData) {
    return new Promise((resolve, reject) => {
        _apiBaseIsValid(confData.apiBase)
        .then(() => {
          _usernameIsValid(confData)
        })
        .then(() => {
            if (!_tokenIsValid(confData.token)) {
              reject('Token must be valid');
            }
            if (!_archiveLocationIsValid(confData.archivesPath)) {
              reject('Token must be valid');
            }
            resolve(confData)
        })
        .catch((err) => {reject(err)});
    });
  }
}

// PRIVATE
function _apiBaseIsValid(url) {
    return new Promise((resolve, reject) => {
      const apiBaseRequest = {
        url,
        headers: { 'User-Agent': 'request' }
      }
      
      request(apiBaseRequest, (err, resp, body) => {
        if (err) { reject(err) }
        else if (resp.statusCode !== 200) { reject(resp.statusCode)} 
        resolve(true)
    });
  });
}

function _usernameIsValid(confData) {
  const github = new Github();
  return new Promise((resolve, reject) => {
    github.findUser(confData.apiBase, confData.username, (err, data) => {
      if (err) { reject(err); } 
      resolve(true);
    });
  });
}


function _tokenIsValid(token){
  return typeof token === 'string';
}

function _archiveLocationIsValid(path) {
  return fs.existsSync(path);
}


module.exports = Helper;