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
const { products, statuses } = require('../../data/data.json')

const insertStatuses = async () => {
  const lenStatuses = await strapi.query('user-story-status').count({})
  if (lenStatuses <= 0) {
    await Promise.all(statuses.map(status => {
      status.user_stories = []
      strapi.query('user-story-status').create(status)
    }))
    console.log('Inserted statuses')
  } else {
    console.log('Statuses already exist.')
  }
}

const insertAllItems = async () => {
  console.log('Inserting Items...')

  await Promise.all(products.map(product => strapi.query('product').create(product)))
  console.log('Inserted products')

  await Promise.all(statuses.map(status => strapi.query('user-story-status').create(status)))
  console.log('Inserted statuses')
}

const setUsersPermissions = async () => {
  const publicPermissions = {
    auth: ['callback', 'connect', 'emailconfirmation', 'forgotpassword', 'register'],
    user: ['find', 'findone', 'me']
  }

  const authPermissions = {
    auth: ['callback', 'connect', 'forgotpassword', 'register', 'resetpassword'],
    user: ['find', 'findone', 'me', 'update']
  }

  let roles = await strapi.query('role', 'users-permissions').find({})
  const authenticatedId = roles.find(role => role.type === 'authenticated').id
  const publicId = roles.find(role => role.type === 'public').id
  let permissions = roles[0].permissions.concat(roles[1].permissions)

  permissions.forEach(async(permission) => {
    let toEnable = false
    if (permission.role == authenticatedId) {
      if (permission.controller === 'auth' && authPermissions.auth.includes(permission.action)) {
        toEnable = true
      } else if (permission.controller === 'user' && authPermissions.user.includes(permission.action)) {
        toEnable = true
      }
    } else if (permission.role == publicId) {
      if (permission.controller === 'auth' && publicPermissions.auth.includes(permission.action)) {
        toEnable = true
      } else if (permission.controller === 'user' && publicPermissions.user.includes(permission.action)) {
        toEnable = true
      }
    }
    if (toEnable) {
      permission.enabled = true
      await strapi.query('permission', 'users-permissions').update(
        { id: permission.id },
        permission
      )
    }
  })
}

const setCollectionPermissions = async () => {
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
    'successes': ['find', 'findone'],
    'user-story-comment-thread': ['find', 'findone'],
    'user-story': ['count', 'find', 'findone', 'create', 'update']
  }

  applicationPermissions.forEach(async(permission) => {
    let toEnable = false
    if (permission.role == publicId) {
      if (
        publicPermissions[permission.controller] &&
        publicPermissions[permission.controller].includes(permission.action)
      ) {
        toEnable = true
      }
    } else if (permission.role == authenticatedId) {
      if (
        authenticatedPermissions[permission.controller] &&
        authenticatedPermissions[permission.controller].includes(permission.action)
      ) {
        toEnable = true
      }
    }

    if (toEnable) {
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

module.exports = async () => {
  const shouldInitStrapi = await isFirstRun()

  if (shouldInitStrapi) {
    console.log('Looks like you are running strapi for the first time. Initialising the database.')
    await setCollectionPermissions()
    await setUsersPermissions()

    if (process.env.NODE_ENV === 'test') {
      insertAllItems()
    } else {
      insertStatuses()
    }
  }
};
