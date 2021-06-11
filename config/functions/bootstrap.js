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
// const fs = require('fs')
const { products, userStories, comments, users, statuses } = require('../../data/data.json')

const fetchProducts = async () => {
  const products = await strapi.query('product').find({})
  console.log(JSON.stringify(products))
  // fs.writeFileSync('product-data.json', JSON.stringify(products))
}

const fetchStories = async () => {
  const stories = await strapi.query('user-story').find({})
  console.log(JSON.stringify(stories))
}

const fetchComments = async () => {
  const comments = await strapi.query('user-story-comment').find({})
  console.log(JSON.stringify(comments))
}

const fetchUsers = async () => {
  // console.log(strapi.plugins['users-permissions'].services.user.add({...}))
  const users = await strapi.plugins['users-permissions'].services.user.fetchAll()
  console.log(JSON.stringify(users))
}

const fetchStatus = async () => {
  const status = await strapi.query('user-story-status').find({})
  console.log(JSON.stringify(status))
}

const fetchRoles = async () => {
  // strapi.plugins['users-permissions'].services.userspermissions.createRole()
  const roles = await strapi.plugins['users-permissions'].services.userspermissions.getRoles()
  console.log(JSON.stringify(roles))
}

const insertAllItems = async () => {
  console.log('Inserting Items...')

  await Promise.all(products.map(product => strapi.query('product').create(product)))
  console.log('Inserted products')

  await Promise.all(statuses.map(status => strapi.query('user-story-status').create(status)))
  console.log('Inserted statuses')

  await Promise.all(userStories.map(userStory => strapi.query('user-story').create(userStory)))
  console.log('Inserted stories')

  await Promise.all(comments.map(comment => strapi.query('user-story-comment').create(comment)))
  console.log('Inserted comments')

  let id = await strapi.plugins['users-permissions'].services.userspermissions.getRoles()
  id = id.filter(i => i.type === 'authenticated').map(i => i.id)[0]
  await Promise.all(users.map(user => {
    // Find the id of the authenticated role and update the user's role
    user.role = id
    strapi.plugins['users-permissions'].services.user.add(user)
  }))
  console.log('Inserted users')
}

const setUsersPermissions = async () => {
  const publicPermissions = {
    auth: ['callback', 'connect', 'emailconfirmation', 'forgotpassword', 'register'],
    user: ['findone', 'me']
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
        // Enable
        toEnable = true
      } else if (permission.controller === 'user' && authPermissions.user.includes(permission.action)) {
        // Enable
        toEnable = true
      }
    } else if (permission.role == publicId) {
      if (permission.controller === 'auth' && publicPermissions.auth.includes(permission.action)) {
        // Enable
        toEnable = true
      } else if (permission.controller === 'user' && publicPermissions.user.includes(permission.action)) {
        // Enable
        toEnable = true
      }
    }
    if (toEnable) {
      // Update to set enable to true
      console.log(permission)
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
        // Enable
        toEnable = true
      }
    } else if (permission.role == authenticatedId) {
      if (
        authenticatedPermissions[permission.controller] &&
        authenticatedPermissions[permission.controller].includes(permission.action)
      ) {
        // Enable
        toEnable = true
      }
    }

    if (toEnable) {
      console.log(permission)
      await strapi.query('permission', 'users-permissions').update(
        { id: permission.id },
        { enabled: true }
      )
    }
  })

  // console.log(applicationPermissions)
  // console.log(applicationPermissions.length)
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

  if (shouldInitStrapi && process.env.NODE_ENV === 'test') {
    await setCollectionPermissions()
    await setUsersPermissions()
    await insertAllItems()
  }
};
