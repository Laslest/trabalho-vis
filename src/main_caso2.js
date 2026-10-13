import { Queijos } from './queijos';
import { designA, designB } from './plot_caso2';

// Um listener independente evita substituir window.onload do Caso 1.
window.addEventListener('load', async () => {
    const base = new Queijos();
    const status = document.querySelector('#statusCaso2');
    try {
        await base.init();
        await base.loadCsv();

        // Valida países únicos, ano, valores positivos e presença da referência.
        const [check] = await base.query(`
            SELECT COUNT(*) AS linhas,
                COUNT(*) - COUNT(DISTINCT pais) AS repetidos,
                COUNT(*) FILTER (WHERE pais IS NULL OR ano IS NULL OR ano <> 2024
                    OR producao_mi IS NULL OR producao_mi <= 0) AS invalidos,
                COUNT(*) FILTER (WHERE pais = 'Alemanha') AS referencias
            FROM queijos;
        `);
        if (Number(check.linhas) !== 3 || Number(check.repetidos) ||
            Number(check.invalidos) || Number(check.referencias) !== 1)
            throw new Error('Os dados não passaram na validação.');

        // Normalização feita no DuckDB: Alemanha = 100, sem usar o total da UE.
        const data = (await base.query(`
            SELECT pais, producao_mi,
                100.0 * producao_mi / (SELECT producao_mi FROM queijos
                    WHERE pais = 'Alemanha') AS indice
            FROM queijos ORDER BY producao_mi DESC, pais;
        `)).map(d => ({
            pais: d.pais,
            producao_mi: Number(d.producao_mi),
            indice: Number(d.indice)
        }));
        if (data.some(d => !Number.isFinite(d.indice) || d.indice > 100))
            throw new Error('A referência das matrizes precisa ser o maior valor.');
        designA(data);
        designB(data);
        status.textContent = '3 países consultados e validados no DuckDB.';
    } catch (error) {
        status.textContent = `Erro no Caso 2: ${error.message}`;
        console.error(error);
    } finally {
        // Libera os recursos deste caso sem interferir no banco do Caso 1.
        if (base.conn) await base.conn.close();
        if (base.db) await base.db.terminate();
    }
});
