"use strict";

module.exports = {
  async logout(ctx) {
    ctx.cookies.set("token", null);
    ctx.send({
      message: "Successfully destroyed session"
    });
  },
  async checkAuthor(ctx) {
    const id = ctx.request.body.storyId;
    const entity = await strapi.services['user-story'].findOne({ id });
    if(ctx.request.body.id === ctx.state.user.id && ctx.request.body.id === entity.author.id){
      ctx.send('true')
    }
    else {
      ctx.send('false')
    }
  }
};