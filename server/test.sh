#!/bin/sh

set -m

# Run tests
mkdir /tmp/psql
chmod 775 /tmp/psql
chown postgres /tmp/psql
su - postgres -c "initdb /tmp/psql";
su - postgres -c "pg_ctl start -w -D /tmp/psql";
su - postgres -c "createdb sekure_archive_development";
node migrate.js up
./node_modules/.bin/webpack --config webpack/test.js
./node_modules/.bin/mocha target/test.js

# Run server and populate database
node migrate.js down
node migrate.js up
./node_modules/.bin/webpack --config webpack/development.js
node target/index.js &
echo 'Populating the database in 5 seconds...'
sleep 5
echo 'Populating the database...'
node populate.js 8080
fg
