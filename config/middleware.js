require('dotenv').config()

const corsDomains = process.env.EOS_CORS_DOMAINS.split(', ')

module.exports = {
    settings: {
      cors: {
        origin: ['http://localhost:1337', 
        ...corsDomains]
      }
    }
  };