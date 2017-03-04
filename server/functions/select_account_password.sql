-- Attempts to return an account's hashed password
CREATE OR REPLACE FUNCTION select_account_password(_email TEXT) RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT password FROM account WHERE email = $1);
END;
$$ LANGUAGE plpgsql;
