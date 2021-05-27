require('dotenv').config()

const corsDomains = process.env.EOS_CORS_DOMAINS.split(', ')

module.exports = {
  settings: {
    cors: {
      origin: [`http://localhost:${process.env.PORT || 1337}`,
      ...corsDomains]
    }
  }
};
