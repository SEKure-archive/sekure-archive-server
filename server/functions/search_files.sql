-- Searches for files
CREATE OR REPLACE FUNCTION search_files(_query TEXT) RETURNS JSON[] AS $$
BEGIN
    RETURN array(
        SELECT row_to_json(row) FROM (
            SELECT file.*, folder.path
            FROM file, folder
            WHERE file.folder_id = folder.id
            AND file.name LIKE ('%' || $1 || '%')
        ) row
    );
END;
$$ LANGUAGE plpgsql;
