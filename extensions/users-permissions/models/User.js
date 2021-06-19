'use strict';

/**
 * Lifecycle callbacks for the `User` model.
 */

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      try {
        const notification = await strapi
          .query('user-story-notification')
          .findOne({
            message: 'User story privacy policy has been updated'
          })

        notification.seenBy.push(result.id)
        await strapi.query('user-story-notification').update({
          id: notification.id
        }, notification)
      } catch (e) {
        console.log('Unable to update notification')
      }
    }
  }
};
