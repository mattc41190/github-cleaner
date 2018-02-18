const axios = require('axios');

exports.createRepo = function createRepo(data, token) {
  const createRepoRequest = {
    method: 'post',
    url: 'https://api.github.com/user/repos',
    data: data,
    headers: {
      'User-Agent': 'axios',
      'Authorization': `token ${token}`
    }
  }
  return axios(createRepoRequest);  
}