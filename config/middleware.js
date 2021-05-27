require('dotenv').config()

const corsDomains = process.env.EOS_CORS_DOMAINS.split(', ')
const heroku = process.env.HEROKU_INSTANCE

module.exports = {
  settings: {
    cors: {
      origin: [`http:localhost, http:localhost:1337, http://localhost:${process.env.PORT || 1337}`, heroku,
      ...corsDomains]
    }
  }
};
