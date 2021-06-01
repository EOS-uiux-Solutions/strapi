'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

const { statuses } = require('../../seed-data/data.json')

const insertStatuses = async () => {
  await Promise.all(statuses.map(status => strapi.query('user-story-status').create(status)))
  console.log('Inserted statuses')
}

const setUserPermissions = async () => {
  const publicPermissions = {
    auth: ['callback', 'connect', 'emailconfirmation', 'forgotpassword', 'register'],
    user: ['findone', 'me']
  }

  const authenticatedPermissions = {
    auth: ['callback', 'connect', 'forgotpassword', 'register', 'resetpassword'],
    user: ['find', 'findone', 'me', 'update']
  }

  let roles = await strapi.query('role', 'users-permissions').find({})
  const authenticatedId = roles.find(role => role.type === 'authenticated').id
  const publicId = roles.find(role => role.type === 'public').id
  let permissions = roles[0].permissions.concat(roles[1].permissions)

  permissions.forEach(async(permission) => {
    let enable = false
    if (permission.role == authenticatedId) {
      if (
        permission.controller === 'auth' &&
        authenticatedPermissions.auth.includes(permission.action)
      ) {
        enable = true
      } else if (
        permission.controller === 'user' &&
        authenticatedPermissions.user.includes(permission.action)
      ) {
        enable = true
      }
    } else if (permission.role == publicId) {
      if (
        permission.controller === 'auth' &&
        publicPermissions.auth.includes(permission.action)
      ) {
        enable = true
      } else if (
        permission.controller === 'user' &&
        publicPermissions.user.includes(permission.action)
      ) {
        enable = true
      }
    }
    if (enable) {
      // Enable the permissions
      permission.enabled = true
      await strapi.query('permission', 'users-permissions').update(
        { id: permission.id },
        permission
      )
    }
  })
}

const setApplicationPermissions = async () => {
  const roles = await strapi.query('role', 'users-permissions').find({})

  const authenticatedId = roles.find(role => role.type === 'authenticated').id
  const publicId = roles.find(role => role.type === 'public').id

  let permissions = roles[0].permissions.concat(roles[1].permissions)
  let applicationPermissions = permissions.filter(c => c.type === 'application')

  const publicPermissions = {
    'user-story-notification': ['count', 'find', 'findone'],
    'user-story-comment': ['count', 'find', 'findone'],
    'user-story-status': ['count', 'find', 'findone'],
    'user-story-policy': ['count', 'find', 'findone'],
    'product': ['count', 'find', 'findone'],
    'successes': ['find', 'findone'],
    'user-story-comment-thread': ['count', 'find', 'findone'],
    'user-story': ['count', 'find', 'findone']
  }

  const authenticatedPermissions = {
    'user-story-notification': ['find', 'findone', 'update'],
    'user-story-comment': ['find', 'findone', 'update', 'create'],
    'user-story-status': ['find', 'findone'],
    'user-story-policy': ['find', 'findone'],
    'product': ['find', 'findone'],
    'custom': ['checkauthor'],
    'successes': ['count', 'find', 'findone'],
    'user-story-comment-thread': ['find', 'findone', 'update'],
    'user-story': ['count', 'find', 'findone', 'create', 'update']
  }

  applicationPermissions.forEach(async(permission) => {
    let enable = false
    if (permission.role == publicId) {
      if (
        publicPermissions[permission.controller] &&
        publicPermissions[permission.controller].includes(permission.action)
      ) {
        enable = true
      }
    } else if (permission.role == authenticatedId) {
      if (
        authenticatedPermissions[permission.controller] &&
        authenticatedPermissions[permission.controller].includes(permission.action)
      ) {
        enable = true
      }
    }

    if (enable) {
      // Enable the permissions
      await strapi.query('permission', 'users-permissions').update(
        { id: permission.id },
        { enabled: true }
      )
    }
  })
}

const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup",
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  return !initHasRun;
}

const initStrapi = async () => {
  console.log('It looks like you are running strapi for the first time.')
  console.log('Setting up your strapi server...')
  await insertStatuses()
  console.log('Setting up the permissions...')
  await setUserPermissions()
  await setApplicationPermissions()
  console.log('Done setting up strapi server!!')
}

module.exports = async () => {
  const shouldInitStrapi = await isFirstRun()

  if (shouldInitStrapi && process.env.NODE_ENV === 'development') {
    initStrapi()
  }
};
