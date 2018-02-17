process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const path = require('path');
const fs = require('fs');
const Github = require('./github.js');
const axios = require('axios');
const homedir = require('os').homedir();
const CONF_FILE = 'github-cleaner-conf.json';

class Helper {
  static checkForConfData() {
    return new Promise((resolve, reject) => {
      const homedirConf = `${homedir}/${CONF_FILE}`;
      const projectDirConf = `${path.join(path.dirname(require.main.filename), '../')}${CONF_FILE}`
      if (fs.existsSync(homedirConf)) {
        resolve(JSON.parse(fs.readFileSync(homedirConf)));
      } else if (fs.existsSync(projectDirConf)) {
        resolve(JSON.parse(fs.readFileSync(projectDirConf)));
      }
      resolve(null); // If no CONF_FILE found return null
    });
  }

  static saveConfData(confData) {
    fs.writeFileSync(path.join(homedir, CONF_FILE), JSON.stringify(confData));
  }

  static validateConfData(confData) {
    return new Promise((resolve, reject) => {
        _apiBaseIsValid(confData.apiBase, confData.token)
        .then(() => {
          _usernameIsValid(confData)
        })
        .then(() => {
            if (!_tokenIsValid(confData.token)) {
              reject('Token must be valid');
            }
            if (!_archiveLocationIsValid(confData.archivesPath)) {
              reject('Archive location must be valid');
            }
            resolve(confData)
        })
        .catch((err) => {reject(err)});
    });
  }
}

// PRIVATE METHODS
const _apiBaseIsValid = function _apiBaseIsValid(url, token) {
      const apiBaseRequest = {
        method: 'get',
        url: url,
        headers: { 'User-Agent': 'axios', 'Authorization': `token ${token}` },
      }
      return axios(apiBaseRequest);
}

const _usernameIsValid = function _usernameIsValid(confData) {
  const github = new Github(confData);
  return new Promise((resolve, reject) => {
    github.findUser(confData.username) 
      .then((resp) => {
      if (resp.status !== 200) {
        reject(resp)
      }
      resolve(resp);
    });
  });
}


const _tokenIsValid = function _tokenIsValid(token){
  return typeof token === 'string';
}

const _archiveLocationIsValid = function _archiveLocationIsValid(path) {
  return fs.existsSync(path);
}


module.exports = Helper;