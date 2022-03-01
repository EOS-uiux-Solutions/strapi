module.exports = {
    provider: 'sendgrid',
    providerOptions: {
        apiKey: process.env.SENDGRID_API_KEY
    },
    settings: {
      defaultFrom: 'no-reply@eosdesignsystem.com',
      defaultReplyTo: 'no-reply@eosdesignsystem.com'
    }
};
  