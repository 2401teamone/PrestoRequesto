# pastebinn

## Configuring Developer Environment
1. Create a postgresql database name "main".
2. Create a .env file in the main pastebinn directory
3. Write this in the .env file: `DB_USERANDPASS=<username>:<password>`. Replace `<username>` with your postgres username and `<password>` with your postgres password.
    - If you don't need a password to access your postgres database, just do: `DB_USERANDPASS=<username>` and everything should work fine.
4. Do `npm run data_setup` to create the tables in the database.
5. Done! You should be good to go. Note that because we currently don't have any seed data in the database you will need to update the `bin_id` paths in the test.rest file. You'll first need to run the top `POST http://localhost:3000/api/bin` to generate a new bin_id in the database and then you can replace the `bin_id`s for the other routes in the test.rest file with that new bin_id.
