-- Attempts to insert a new file or a new version of an existing file
CREATE OR REPLACE FUNCTION insert_file(
    _folder TEXT, _name TEXT, _mime TEXT, _size BIGINT, _created TIMESTAMP, _s3 TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    _folder_id BIGINT;
    _file_id BIGINT;
BEGIN
    LOCK TABLE folder IN EXCLUSIVE MODE;

    -- Create the folder if it does not exist
    SELECT id INTO _folder_id FROM folder WHERE path = $1;
    IF _folder_id IS NULL THEN
        INSERT INTO folder(path) VALUES($1) RETURNING id INTO _folder_id;
    END IF;

    LOCK TABLE file IN EXCLUSIVE MODE;

    -- Create a new file if one does not already exist
    _file_id := (SELECT id FROM file WHERE folder_id = _folder_id AND name = $2);
    IF _file_id IS NULL THEN
        INSERT INTO file(folder_id, name, mime, size)
        VALUES(_folder_id, $2, $3, $4)
        RETURNING id INTO _file_id;
    END IF;

    LOCK TABLE version IN EXCLUSIVE MODE;

    -- Create a new version of the file
    INSERT INTO version(file_id, created, s3) VALUES(_file_id, $5, $6);
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
