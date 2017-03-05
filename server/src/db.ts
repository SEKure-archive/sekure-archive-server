const format = require('pg-format');
import { Pool, QueryResult } from 'pg';

/** The database manager. */
export class Db {
    /** The database connection pool. */
    private static pool: Pool;
    /** The transaction level for the next database call. */
    private static level: string;

    /** Initializes the database manager. */
    static initialize(): Promise<any> {
        return new Promise((resolve, reject) => {
            Db.pool = new Pool({
                host: process.env.PGSQL_HOST || 'localhost',
                user: process.env.PGSQL_USER || 'postgres',
                password: process.env.PGSQL_PASSWORD || 'postgres',
                database: process.env.PGSQL_DATABASE || 'sekure_archive_development',
            });
            Db.level = null;
            resolve();
        });
    }

    /** Terminates the database manager. */
    static terminate() {
        Db.pool.end();
    }

    /** Sets the transaction level for the next database call. */
    static transaction(level: string) {
        Db.level = level;
    }

    /** Executes the supplied function called with the supplied arguments returning a single value. */
    static call(func: string, ...args: any[]): Promise<any> {
        return Db.callMany(func, ...args).then(results => results[0][func]);
    }

    /** Executes the supplied function called with the supplied arguments returning a single row. */
    static callOne(func: string, ...args: any[]): Promise<any> {
        return Db.callMany(func, ...args).then(results => results[0]);
    }

    /** Executes the supplied function called with the supplied arguments returning multiple rows. */
    static callMany(func: string, ...args: any[]): Promise<any> {
        let ids = args.map(() => '%L');
        let query = format(`SELECT * FROM ${func}(${ids})`, ...args);
        if (Db.level) {
            query = `SET TRANSACTION ISOLATION LEVEL ${Db.level}; ${query}`;
            Db.level = null;
        }
        return Db.pool.connect().then((client) => {
            return client.query(query).then(result => {
                client.release();
                return result.rows;
            });
        });
    }
}
