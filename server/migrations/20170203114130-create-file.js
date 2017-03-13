const UP = `
    CREATE TABLE file(
        id BIGSERIAL CONSTRAINT PK_file PRIMARY KEY,
        folder_id BIGINT REFERENCES folder(id),
        name TEXT NOT NULL,
        mime TEXT NOT NULL,
        size BIGINT NOT NULL
    )
`;

exports.up = (query) => {
    return query(UP);
};

exports.down = (query) => {
    return query('DROP TABLE IF EXISTS file CASCADE');
};
