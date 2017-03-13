DROP TYPE IF EXISTS file_version CASCADE;
CREATE TYPE file_version AS (file_id BIGINT, version_id BIGINT);

-- Attempts to insert a new file or a new version of an existing file
CREATE OR REPLACE FUNCTION insert_file(
    _folder_id BIGINT, _name TEXT, _mime TEXT, _size BIGINT
) RETURNS file_version AS $$
DECLARE
    _file_id BIGINT;
    _version_id BIGINT;
BEGIN
    -- Return null if the folder does not exists
    IF NOT EXISTS (SELECT 1 FROM folder WHERE id = $1) THEN
        RETURN NULL;
    END IF;

    LOCK TABLE file IN EXCLUSIVE MODE;

    -- Create a new file if one does not already exist
    _file_id := (SELECT id FROM file WHERE folder_id = $1 AND name = $2);
    IF _file_id IS NULL THEN
        INSERT INTO file(folder_id, name, mime, size) VALUES($1, $2, $3, $4) RETURNING id INTO _file_id;
    END IF;

    -- Create a new version of the file
    INSERT INTO version(file_id) VALUES(_file_id) RETURNING id INTO _version_id;
    RETURN (_file_id, _version_id);
END;
$$ LANGUAGE plpgsql;
