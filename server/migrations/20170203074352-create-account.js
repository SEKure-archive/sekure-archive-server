const UP = `
    CREATE TABLE account(
        id BIGSERIAL CONSTRAINT PK_account PRIMARY KEY,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )
`;

exports.up = (query) => {
    return query(UP);
};

exports.down = (query) => {
    return query('DROP TABLE IF EXISTS account');
};
