require('dotenv').config()

const fetch = require('node-fetch')

async function apiHandler(path) {
  return fetch(`${process.env.IDEASCALE_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'api_token': process.env.IDEASCALE_API_TOKEN
    }
  })
    .then(res => res.json())
}

module.exports = apiHandler