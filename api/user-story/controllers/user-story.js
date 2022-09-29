'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
   * Create a story.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services['user-story'].create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services['user-story'].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models['user-story'] });
  },
  async find(ctx) {
    let entity;
    let query = {...ctx.query};
    const { _limit, _start, ...rest } = query;
    query = rest;
    if(ctx.query._sort==='followers:desc'){
     const result = await strapi.services['user-story'].find(query)
     const comparatorVotes = (a, b) => {
      return a.followers.length > b.followers.length ? -1 : 1
     }
     result.sort(comparatorVotes)
     entity=result
    }
    else if(ctx.query._sort==='comments:desc'){
      const result = await strapi.services['user-story'].find(query)
    const comparatorComments = (a, b) => {
      return a.user_story_comments.length > b.user_story_comments.length
        ? -1
        : 1
    }
      result.sort(comparatorComments)
      entity=result
    }
    else {
      entity = await strapi.services['user-story'].find(ctx.query);
    }
    if(ctx.query._limit || ctx.query._start){
      entity = entity.slice(ctx.query._start,Number(ctx.query._start)+Number(ctx.query._limit))
    }
    return entity.map(story => sanitizeEntity(story, { model: strapi.models['user-story'] }));
  }

};
