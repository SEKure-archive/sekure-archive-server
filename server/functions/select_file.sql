DROP TYPE IF EXISTS file_versions CASCADE;
CREATE TYPE file_versions AS (f JSON, vs JSON[]);

-- Attempts to insert a new file or a new version of an existing file
CREATE OR REPLACE FUNCTION select_file(_id BIGINT) RETURNS file_versions AS $$
DECLARE
    _f JSON;
    _vs JSON[];
BEGIN
    -- Return null if the file does not exist
    _f := (SELECT row_to_json(row) FROM (SELECT * FROM file WHERE id = $1) row);
    IF _f IS NULL THEN
        RETURN NULL;
    END IF;

    -- Return the file and the versions of the file
    _vs := array(SELECT row_to_json(row) FROM (SELECT * FROM version WHERE file_id = $1) row);
    RETURN (_f, _vs);
END;
$$ LANGUAGE plpgsql;
