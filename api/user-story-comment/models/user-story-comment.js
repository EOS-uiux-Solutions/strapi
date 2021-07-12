'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#life-cycle-callbacks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async afterCreate(result) {
            try {
                if(result.user.id != result.user_story.author) {
                    let user = result.user_story.author
                    await strapi.services['user-story-notification'].create({
                        message: `${result.user.username} commented on your story`,
                        users: [user],
                        date: new Date(),
                        link: `story/${result.user_story.id}`
                    })
                }
            }
            catch(e) {
                console.log(e);
            } 
        }
    }
};
