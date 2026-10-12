import { Imigracao } from './imigracao';
import { designA, designB } from './plot';

window.onload = async () => {
    const base = new Imigracao();

    await base.init();
    await base.loadCsv();

    // Transformacoes feitas no DuckDB:
    // - derivacao da porcentagem de imigrantes (imigrantes / populacao)
    // - normalizacao da contagem para milhoes
    const sql = `
        SELECT
            ano,
            imigrantes / 1000000 AS imigrantes_mi,
            ROUND(100 * imigrantes / populacao, 1) AS pct
        FROM imigracao
        ORDER BY ano;
    `;

    // o DuckDB pode devolver numeros como BigInt, entao converte tudo para Number
    const data = (await base.query(sql)).map(d => ({
        ano: Number(d.ano),
        imigrantes_mi: Number(d.imigrantes_mi),
        pct: Number(d.pct)
    }));
    console.log(data);

    // Validacao simples: numero de linhas, anos repetidos e anos com mais imigrantes que populacao
    const check = await base.query(`
        SELECT
            COUNT(*) AS linhas,
            COUNT(*) - COUNT(DISTINCT ano) AS anos_repetidos,
            SUM(CASE WHEN imigrantes > populacao THEN 1 ELSE 0 END) AS linhas_invalidas
        FROM imigracao;
    `);
    console.log(check);

    designA(data);
    designB(data);
};
