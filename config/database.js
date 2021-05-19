
module.exports = ({ env }) => {
  /**
   * Load configuration for runing Strapi with Docker or remote database
   */
  const configType = {
    with: {
      connections: {
        default: {
          connector: 'mongoose',
            settings: {
              host: env('DATABASE_HOST', 'mongoexample'),
              srv: env.bool('DATABASE_SRV', false),
              port: env.int('DATABASE_PORT', 27017),
              database: env('DATABASE_NAME', 'strapi'),
              username: env('DATABASE_USERNAME', 'strapi'),
              password: env('DATABASE_PASSWORD', 'password'),
            },
          options: {
            authenticationDatabase: env('AUTHENTICATION_DATABASE', null),
            ssl: env.bool('DATABASE_SSL', false),
          },
        },
      }
    },
    without: {
      connections: {
        default: {
          connector: "mongoose",
          settings: {
            database: env("EOS_DATABASE_DB_DEV"),
            uri: env("EOS_DATABASE_URI_DEV"),
          },
          options: {
            ssl: true,
          },
        },
      }
    }
  }

  return {
  defaultConnection: 'default',
    ...configType[env('WITH_DOCKER') === 'yes' ? 'with' : 'without']
  }
}
