import { loadDb } from './config';

// Segue a estrutura da classe Imigracao do Caso 1.
export class Queijos {
    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();
    }

    async loadCsv() {
        const res = await fetch(`${import.meta.env.BASE_URL}queijos_europa.csv`);
        if (!res.ok) throw new Error('Não foi possível carregar o CSV.');
        await this.db.registerFileText('queijos_europa.csv', await res.text());
        await this.conn.query(`
            CREATE TABLE queijos AS
            SELECT * FROM read_csv_auto('queijos_europa.csv');
        `);
    }

    async query(sql) {
        const result = await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }
}
