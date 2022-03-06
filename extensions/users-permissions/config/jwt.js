module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'a6336848-f6a7-4553-802c-e05875fc1d50',
  jwt: {
    expiresIn: process.env.JWT_EXPIRATION || '1h'
  }
};