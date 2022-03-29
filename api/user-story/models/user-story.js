'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#life-cycle-callbacks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterUpdate(result){
      try{
          if(result.user_story_status.Status === 'Deployed') {
          let users = result.followers.map(follower => follower.id)
          if(!users.includes(result.author.id)) {
            users.push(result.author.id)
          }
          await strapi.services['user-story-notification'].create({
            message: `${result.Title} has been launched`,
            users: users,
            seen: false,
            date: new Date(),
            link: `story/${result.id}`
          })
        }
      }

      catch(e) {}
    },
    async beforeUpdate(params,data) {
      try {
              const story=await strapi.query('user-story').findOne({id: params.id})
              const userId= data.followers[data.followers.length-1]
              if(story?.followers?.length < data?.followers?.length && story.author.id !== userId) {
              const user= await strapi.query('user', 'users-permissions').findOne({id: userId})
              await strapi.services['user-story-notification'].create({
                  message: `${user.username} voted up your story`,
                  users: [story.author],
                  date: new Date(),
                  link: `story/${story.id}`
              })
            }
      }
      catch(e) {}
    },
    async beforeCreate(data) {
      if (!data.user_story_status) {
        try {
          const status = await strapi.query('user-story-status').findOne({ Status: 'Under consideration' })
          data.user_story_status = status.id
        } catch (e) {
          console.log('Unable to fetch "Under consideration" status')
        }
      }
    }
  }
};
