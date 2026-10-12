import { loadDb } from './config';

// Classe no mesmo formato da classe Taxi das aulas.
// Carrega o csv no DuckDB e permite fazer consultas SQL.
export class Imigracao {
    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();

        this.table = 'imigracao';
    }

    async loadCsv() {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        // o csv fica na pasta public, entao o vite serve ele na raiz
        const res = await fetch('imigracao_eua.csv');
        await this.db.registerFileText('imigracao_eua.csv', await res.text());

        await this.conn.query(`
            CREATE TABLE ${this.table} AS
                SELECT *
                FROM read_csv_auto('imigracao_eua.csv');
        `);
    }

    async query(sql) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        let result = await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }
}
