const UP = `
    CREATE TABLE folder(
        id BIGSERIAL CONSTRAINT PK_folder PRIMARY KEY,
        path TEXT NOT NULL,
        created TIMESTAMP NOT NULL DEFAULT current_timestamp,
        modified TIMESTAMP NOT NULL DEFAULT current_timestamp
    )
`;

exports.up = (query) => {
    return query(UP);
};

exports.down = (query) => {
    return query('DROP TABLE IF EXISTS folder CASCADE');
};
