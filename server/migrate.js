const fs = require('fs');
const pg = require('pg');

// Validate the arguments
if (process.argv.length < 3) {
    throw 'expected at least one argument: [COMMAND]';
}

// Create a new migration
function create(name) {
    const UP = 'exports.up = (query) => {\n    return Promise.resolve();\n};';
    const DOWN = 'exports.down = (query) => {\n    return Promise.resolve();\n};';
    const CONTENTS = `${UP}\n\n${DOWN}\n`;
    const PAD = (number) => (number < 10) ? `0${number}` : number;
    let now = new Date();
    let date = `${now.getUTCFullYear()}${PAD(now.getUTCMonth())}${PAD(now.getUTCDate())}`;
    let time = `${PAD(now.getUTCHours())}${PAD(now.getUTCMinutes())}${PAD(now.getUTCSeconds())}`;
    fs.writeFileSync(`${__dirname}/migrations/${date}${time}-${name}.js`, CONTENTS, 'utf-8');
}

// Run the supplied database query
function query(client, query, args) {
    return new Promise((resolve, reject) => {
        client.query(query, args, (error, result) => error ? reject(error) : resolve(result));
    });
}

// Load the currently applied migrations
function current(client) {
    const TABLE = `
        CREATE TABLE IF NOT EXISTS _migration(
            name TEXT,
            time TIMESTAMP DEFAULT current_timestamp
        )
    `;
    const QUERY = 'SELECT * FROM _migration ORDER BY time DESC';
    return query(client, TABLE).then(() => query(client, QUERY)).then(results => results.rows);
}

// Load the migration files
function files(migrations) {
    let files = fs.readdirSync(`${__dirname}/migrations`);
    return files.filter(file => !migrations.some(row => file == row.name));
}

// Apply the supplied up migration
function applyUp(client, name) {
    var migration = require(`${__dirname}/migrations/${name}`);
    return migration.up(query.bind(query, client)).then(() => {
        console.log(`UP -- ${name}`);
        return query(client, 'INSERT INTO _migration(name) SELECT $1', [name]);
    });
}

// Migrate the database up
function up(client) {
    return current(client).then((migrations) => {
        return files(migrations).reduce((promise, file) => {
            return promise.then(() => applyUp(client, file));
        }, Promise.resolve());
    });
}

// Apply the supplied down migration
function applyDown(client, name) {
    var migration = require(`${__dirname}/migrations/${name}`);
    console.log(`DOWN -- ${name}`);
    return migration.down(query.bind(query, client));
}

// Migrate the database down
function down(client) {
    return current(client).then((migrations) => {
        return migrations.reduce((promise, migration) => {
            return promise.then(() => applyDown(client, migration.name));
        }, Promise.resolve());
    }).then(() => query(client, 'TRUNCATE TABLE _migration'));
}

// Migrate the database up or down
function migrate(direction) {
    let client = new pg.Client({
        host: process.env.PGSQL_HOST || 'localhost',
        user: 'postgres',
        password: process.env.PGSQL_PASSWORD || 'postgres',
        database: process.env.PGSQL_DATABASE || 'sekure_archive_development',
    });
    client.connect((error) => {
        if (error) throw error;
        (direction == 'up' ? up(client) : down(client)).then(() => client.end());
    });
}

// Run the user supplied command
let command = process.argv[2];
switch (process.argv[2]) {
    case 'create':
        if (process.argv.length != 4) throw 'expected migration name after `create`';
        create(process.argv[3]);
        break;
    case 'up':
        migrate('up');
        break;
    case 'down':
        migrate('down');
        break;
    default:
        throw 'invalid command';
}
