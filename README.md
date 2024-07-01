# Torichan Imageboard engine

Torichan is a work-in-progress imageboard implementation using Nest.js

In this application, there is currently limited functionality, 
but we have just begun development, and you have every opportunity to 
follow it through to the final release :).

## How to install it?

In this case, you have 2 installation methods, which we will explain further.

### Run the application with Docker

After saving the source code, do the following:
1. Make `volumes` directory in your `torichan` project root:
    ```sh
   $ cd torichan
   $ mkdir -p ./volumes
   ```
2. Make `.env` file in your `torichan` project root:
    ```sh
    $ touch .env
   ```
3. Fill the `.env` file with the following values:
    ```
    POSTGRES_HOST='db.torichan'
    POSTGRES_PORT=5432
    POSTGRES_USER='your_pg_user_name'
    POSTGRES_PASSWORD='your_pg_user_password'
    POSTGRES_DB='torichan'
    PGDATA='/var/lib/postgresql/data/pgdata'

    DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public" 
    ```
4. Edit configurations in the file `application.yml` as you wish, 
but we strongly recommend you to change default values by paths `secure.secret.session`, `secure.secret.password` and `secure.secret.captcha`.
5. Next run the following commands:
    ```sh
    $ docker-compose build

    $ docker-compose up
    ```
Then go to [localhost:13000](http://localhost:13000/).
And now you're awesome! Enjoy using the application!

Now you can go to [localhost:13000/admin/sign-up](http://localhost:13000/admin/sign-up) and create your first admin profile.

### Classic Node.js installation

If you want to install the application without using Docker, you will need to perform the following set of actions:

1. Install and configure [PostgreSQL](https://www.postgresql.org/) 13. (I won't provide installation and setup instructions for Postgres here; you can find them on your own).
2. Install and configure [Node.js](https://nodejs.org/) 21.0.* (You can find all installation instructions on your own).
3. Additionally, if you wish, you can independently find and install any PostgreSQL client of your choice, such as PgAdmin or DBeaver.
4. Make `.env` file in your `torichan` project root and put the following settings:
    ```
    POSTGRES_HOST='localhost'
    POSTGRES_PORT=5432
    POSTGRES_USER='your_pg_user_name'
    POSTGRES_PASSWORD='your_pg_user_password'
    POSTGRES_DB='torichan'
    PGDATA='/var/lib/postgresql/data/pgdata'

    DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public" 
    ```
5. If you need, you can edit `application.yml` file and set here your own settings.
6. After all installations, please run the following commands:
    ```sh
    # Install dependencies
    $ npm i
   
    # Run Prisma migrations
    $ npx prisma migrate dev
   
    # Run the application
    $ npm run start:dev
    ```
7. Then go to [localhost:3000](http://localhost:3000/). And enjoy using the application!
8. Now you can go to [localhost:3000/admin/sign-up](http://localhost:3000/admin/sign-up) and create your first admin profile.

## Localization

### How I can translate the site to my language?

You now have an easier way to create your own localization for the Torichan engine.

An example file with all the localizable strings can be found at: `torichan/src/utils/locale/locale-en.ts`

You can create another file with your own strings in your language based on the file `strings-en.ts` and connect it by importing it in the file `torichan/src/utils/locale/locale.ts`

Alternatively, you can simply rewrite the existing strings in the `locale-en.ts` file in the language you want to translate the site into.

If desired, you can submit pull requests with your completed localizations.

## License
<a href="https://github.com/d-indifference/torichan/blob/master/LICENSE">GPLV2 License</a>

Because we believe that open source is important.