const UP = `
    CREATE TABLE version(
        id BIGSERIAL CONSTRAINT PK_version PRIMARY KEY,
        file_id BIGINT REFERENCES file(id),
        created TIMESTAMP NOT NULL,
        s3 TEXT NOT NULL
    )
`;

exports.up = (query) => {
    return query(UP);
};

exports.down = (query) => {
    return query('DROP TABLE IF EXISTS version CASCADE');
};
