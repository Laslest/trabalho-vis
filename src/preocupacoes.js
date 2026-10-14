import { loadDb } from './config';

// Segue a organização das classes Imigracao e Queijos do grupo.
export class Preocupacoes {
    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();
    }

    async loadCsv() {
        const res = await fetch(`${import.meta.env.BASE_URL}preocupacoes_eua.csv`);
        if (!res.ok) throw new Error('Não foi possível carregar o CSV do Caso 3.');
        await this.db.registerFileText('preocupacoes_eua.csv', await res.text());
        // Tipos explícitos evitam interpretar um percentual como texto.
        await this.conn.query(`CREATE TABLE preocupacoes AS
            SELECT * FROM read_csv('preocupacoes_eua.csv', header=true, columns={
                'id':'INTEGER', 'categoria':'VARCHAR', 'categoria_original':'VARCHAR',
                'percentual':'DOUBLE', 'ordem_original':'INTEGER'
            });`);
    }

    async query(sql) {
        const result = await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }
}
