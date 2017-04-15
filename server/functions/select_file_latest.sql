DROP TYPE IF EXISTS file_latest CASCADE;
CREATE TYPE file_latest AS (d TEXT, f TEXT, s3 TEXT);

-- Attempts to return download information on the most recent version of a file
CREATE OR REPLACE FUNCTION select_file_latest(_id BIGINT) RETURNS file_latest AS $$
DECLARE
    _file_id BIGINT;
    _folder_id BIGINT;
    _f TEXT;
    _d TEXT;
    _s3 TEXT;
BEGIN
    -- Return null if the file does not exist
    SELECT id, folder_id, name INTO _file_id, _folder_id, _f FROM file WHERE id = $1;
    IF _f IS NULL THEN
        RETURN NULL;
    END IF;

    -- Select the directory path
    SELECT path INTO _d FROM folder WHERE id = _folder_id;

    -- Select the S3 link from the most recent version of the file
    SELECT s3 INTO _s3 FROM version WHERE file_id = $1 ORDER BY created DESC;

    -- Return the file and the versions of the file
    RETURN (_d, _f, _s3);
END;
$$ LANGUAGE plpgsql;
