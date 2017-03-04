-- Attempts to insert a new folder
CREATE OR REPLACE FUNCTION insert_folder(_path TEXT) RETURNS BIGINT AS $$
DECLARE
    _id BIGINT;
BEGIN
    LOCK TABLE folder IN EXCLUSIVE MODE;

    -- Return null if the folder already exists
    IF EXISTS (SELECT 1 FROM folder WHERE path = $1) THEN
        RETURN NULL;
    END IF;

    -- Create the folder and return the ID
    INSERT INTO folder(path) VALUES($1) RETURNING id INTO _id;
    RETURN _id;
END;
$$ LANGUAGE plpgsql;
