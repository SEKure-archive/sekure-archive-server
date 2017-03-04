-- Returns all folders
CREATE OR REPLACE FUNCTION select_folders() RETURNS SETOF folder AS $$
    SELECT * FROM folder
$$ LANGUAGE sql;
