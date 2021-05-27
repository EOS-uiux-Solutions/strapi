require('dotenv').config()

const corsDomains = process.env.EOS_CORS_DOMAINS.split(', ')

module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: ['*']
    }
  }
};
