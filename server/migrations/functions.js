const fs = require('fs');

let files = fs.readdirSync(`${__dirname}/../functions`);

exports.up = (query) => {
    return files.reduce((promise, file) => {
        let contents = fs.readFileSync(`${__dirname}/../functions/${file}`, 'utf-8');
        return promise.then(() => query(contents));
    }, Promise.resolve());
};

const DOWN_FUNCTIONS = `
    SELECT format('DROP FUNCTION IF EXISTS %s(%s);', oid::regproc, pg_get_function_identity_arguments(oid))
    FROM pg_proc
    WHERE proname = $1 AND pg_function_is_visible(oid)
`;

const DOWN_TYPES = `
    SELECT format('DROP TYPE IF EXISTS %s;', user_defined_type_name)
    FROM information_schema.user_defined_types
`;

function dropFunctions(query) {
    return files.reduce((promise, file) => {
        file = file.substr(0, file.length - 4);
        return promise.then(() => query(DOWN_FUNCTIONS, [file])).then(lines => {
            return query(lines.rows.reduce((sql, row) => sql + row.format, ''));
        });
    }, Promise.resolve());
}

function dropTypes(query) {
    return query(DOWN_TYPES).then(lines => {
        return query(lines.rows.reduce((sql, row) => sql + row.format, ''));
    });
}

exports.down = (query) => {
    return dropFunctions(query).then(() => dropTypes(query));
};
