process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fs = require('fs');
const axios = require('axios');

const createBackup = function createBackup(archivesPath, repo, content) {
  return new Promise(function(resolve, reject) {
    repo = repo.split('/').join('_');
    fs.writeFile(`${archivesPath}/${repo}_Compressed.zip`, content, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    });
  });
}

class Github {
  constructor(conf) {
    this.conf = conf;
    this.apiBase = conf.apiBase;
  }

  backupRepos(repos) {
    const backups = [];
    for (let repo of repos) {
      const backupRequest = {
        method: 'get',
        url: `${this.apiBase}/repos/${repo}/zipball/master`,
        responseType: 'stream',
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'axios',
          'Authorization': `token ${this.conf.token}`
        }
      };

      const backup = axios(backupRequest)
        .then((resp) => {
          if (resp.status !== 200) {
            return resp.status;
          }
          return createBackup(this.conf.archivesPath, repo, resp.data);
        })
        .then(data => {
          return {
            repo,
            archivesPath: this.conf.archivesPath
          }
        });

      backups.push(backup);
    }

    return axios.all(backups).then((backupsInfo) => {
      backupsInfo.forEach(info => console.log(`${info.repo} -> ${info.archivesPath}`));
      return backupsInfo;
    });
  }

  getRepos() {
    const reposRequest = {
      method: 'get',
      url: `${this.apiBase}/users/${this.conf.username}/repos`,
      headers: {
        'User-Agent': 'axios',
        'Authorization': `token ${this.conf.token}`
      }
    }
    return axios(reposRequest)
    .then((resp) => {
      if (resp.status !== 200) {
        return resp.status;
      }
      const repos = resp.data;
      return repos.map(repo => [repo.id, repo.full_name])
    });
  }

  removeRepos(repos) {
    const deletedRepos = [];
    
    for (let repo of repos) {
      const deleteRepoRequest = {
        method: 'delete',
        url: `${this.apiBase}/repos/${repo}`,
        headers: {
          'User-Agent': 'axios',
          'Authorization': `token ${this.conf.token}`
        }
      }
      
      let deleteRequest = axios(deleteRepoRequest).then((resp) => {
        if ((resp.status !== 204)) {
          return resp.status;
        } 
        return repo
      });
      
      deletedRepos.push(deleteRequest)
    }
    
    return axios.all(deletedRepos)
    .then((_deletedRepos) => {
      _deletedRepos.forEach(deletedRepo => console.log(`${deletedRepo} -> DELETED`));
      return deletedRepos;
    });
  }

  findUser(username) {
    const usernameRequest = {
      url: `${this.apiBase}/users/${username}`,
      headers: {
        'User-Agent': 'axios',
        'Authorization': `token ${this.conf.token}`
      }
    }

    return axios(usernameRequest);
    
  }
}

module.exports = Github;