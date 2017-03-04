-- Attempts to insert a new account
CREATE OR REPLACE FUNCTION insert_account(_email TEXT, _password TEXT) RETURNS BOOLEAN AS $$
BEGIN
    LOCK TABLE account IN EXCLUSIVE MODE;

    -- Return false if the account already exists
    IF EXISTS (SELECT 1 FROM account WHERE email = $1) THEN
        RETURN FALSE;
    END IF;

    -- Create the account and return true
    INSERT INTO account(email, password) VALUES($1, $2);
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
