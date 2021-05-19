'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#life-cycle-callbacks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async afterCreate() {
            try {
                await strapi.services['user-story-notification'].create({
                    message: `User story privacy policy has been updated`,
                    seen: false,
                    date: new Date(),
                    link: 'policies'
                })
            }
            catch(e) {}
        },
        async afterDelete() {
            try {
                await strapi.services['user-story-notification'].delete({ message: `User story privacy policy has been updated` })
            }
            catch(e) {}
        }
    }
};
