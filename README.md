# EOS Strapi application

## Use cases

This repository is a dependency to run the [User Story](https://www.userstory.site)

It contains all the models and routes necessary to manage either project independently, or both at the same time consuming the same [Strapi](https://strapi.io/).

It provides the user interface to manage the feature requests received for [EOS Feature Request](https://gitlab.com/SUSE-UIUX/eos-feature-request), and also to manage the table of content and general project configuration for the [EOS Design System](https://gitlab.com/SUSE-UIUX/eos).

## How to install it

### Locally

1 - Like always, clone this repo. Once cloned and inside the repository's folder install all the dependencies with:

`npm i`

2 - You can configure and enable `cors` middleware by adding your client or origin url in `./config/middleware.js`. To add your domains, duplicate the file `.env.example` into a new file called `.env`, and add your domains to `EOS_CORS_DOMAINS` variable list.

3 - Now you need to connect to a database. To do this, duplicate the file `.env.example` into a new file called `.env`, and replace the content of the variables as described in the comments. You need to have a DB running before this. We recommend using [Mongo Atlas](https://account.mongodb.com/) or [Mlab](https://mlab.com/). They both offer a free tier with up to 500mb free storage.

4 - Now that you have a DB running, you can start up the project by running:

`npm start`

It will serve a page under http://localhost:1337/admin so you can create your first admin user.

### Using Docker:

1. Make sure you have Docker installed https://docs.docker.com/docker-for-mac/install/
2. You can now run `docker-compose up`. You can run `docker-compose up -d` to run it without being attached to console. You can stop the container from Docker UI or by `CTRL + C` to kill the process in your terminal.
3. Create a new user for your Strapi (http://localhost:1337/admin/auth/)
4. Add the read/write permissions by going to **Roles & Permissions > Public** and click on `Select All` (right corner) for Applications, Pages and Successes (or any others you need)

If you make any changes to Strapi (new content, file changes, etc.) you'll have to build the image again:

1. Run `docker-compose down`
2. Run `docker-compose build` (from cache, really fast)
3. Run `docker-compose up`

### Test GraphQL calls

Our version of Strapi comes with GraphQL installed so, after you serve the application, you can access the GraphQL playground by visiting:

http://localhost:1337/graphql

### Creating new content type

Content types in Strapi are data models with integrated API endpoints and UI inside Strapi. You can create one from the admin very easily, however, everytime you create one, Strapi will be creating a group of documents for the API and route to work appropiatly.

This may cause 2 different issues that you need to bear in mind:

1 - If you are running this application in Heroku, you need to make sure that you include the new changes in your Heroku repository, locally in your machine, and then you push them as part of your regular git process.
Don't attempt to create content-types directly from your application served in Heroku. Heroku will delete all files once it goes to sleep.

2 - Creating new content-types will also make your repository differ from our master. We suggest using namespaces for your content-type so you increase your compatibility with our master to be able to pull next time again. An example:

Let's say that your project's name is `YOLO`. Instead of creating a content-type `Library` choose a name like `YoloLibrary`.

## Learn more about the EOS UX/UI Solutions

- [EOS Icons](https://eos-icons.com)

- [Follow us on Twitter](https://twitter.com/eos_uxui)

- [Join us on Slack](https://slack.userstory.site)
