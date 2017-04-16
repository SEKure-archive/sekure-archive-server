DROP TYPE IF EXISTS folder_files CASCADE;
CREATE TYPE folder_files AS (f JSON, fs JSON[]);

-- Returns a folder
CREATE OR REPLACE FUNCTION select_folder(_id BIGINT) RETURNS folder_files AS $$
DECLARE
    _f JSON;
    _fs JSON[];
BEGIN
    -- Return null if the folder does not exist
    _f := (SELECT row_to_json(row) FROM (SELECT * FROM folder WHERE id = $1) row);
    IF _f IS NULL THEN
        RETURN NULL;
    END IF;

    -- Return the folder and the files in the folder
    _fs := array(SELECT row_to_json(row) FROM (
        WITH
        fs AS (SELECT * FROM file WHERE folder_id = $1),
        vs AS (SELECT DISTINCT ON (file_id) * FROM version ORDER BY file_id, created DESC)
        SELECT fs.*, vs.created FROM fs
        INNER JOIN vs ON fs.id = vs.file_id
    ) row);
    RETURN (_f, _fs);
END;
$$ LANGUAGE plpgsql;
