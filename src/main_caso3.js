import * as d3 from 'd3';
import { Preocupacoes } from './preocupacoes';
import { designA, designB } from './plot_caso3';

// Listener independente: não substitui o carregamento dos outros casos.
window.addEventListener('load', async () => {
    const base = new Preocupacoes();
    const status = document.querySelector('#statusCaso3');
    const ordem = document.querySelector('#ordemCaso3');
    const referencia = document.querySelector('#referenciaCaso3');
    const falha = error => {
        status.textContent = `Erro no Caso 3: ${error.message}`;
        ordem.disabled = referencia.disabled = true;
        console.error(error);
    };
    try {
        await base.init();
        await base.loadCsv();
        const [check] = await base.query(`SELECT COUNT(*) AS linhas,
            COUNT(DISTINCT id) AS ids, COUNT(DISTINCT categoria) AS categorias,
            COUNT(DISTINCT ordem_original) AS ordens,
            COUNT(*) FILTER (WHERE id IS NULL OR id NOT BETWEEN 1 AND 10
                OR categoria IS NULL OR trim(categoria) = '' OR percentual IS NULL
                OR NOT isfinite(percentual) OR percentual < 0 OR percentual > 100
                OR ordem_original IS NULL OR ordem_original NOT BETWEEN 1 AND 10) AS invalidos
            FROM preocupacoes;`);
        if (Number(check.linhas) !== 10 || Number(check.ids) !== 10 ||
            Number(check.categorias) !== 10 || Number(check.ordens) !== 10 || Number(check.invalidos))
            throw new Error('Os dados não passaram na validação.');
        const data = await base.query('SELECT * FROM preocupacoes ORDER BY ordem_original;');
        d3.select(referencia).selectAll('option').data(data).join('option')
            .attr('value', d => d.id).text(d => d.categoria);
        referencia.value = '2'; // Criminalidade é a comparação inicial.
        // Tabela textual complementar, sem depender de mouse ou percepção de cor.
        const linhas = d3.select('#dadosCaso3 tbody').selectAll('tr').data(data).join('tr');
        linhas.append('th').attr('scope', 'row').text(d => d.categoria);
        linhas.append('td').text(d => d.percentual + '%');

        async function atualizarA() {
            // A expressão SQL vem de uma lista permitida, não de texto livre.
            const ordenar = ordem.value === 'alfabetica' ? 'categoria' : 'percentual DESC, ordem_original';
            const result = await base.query(`SELECT * FROM preocupacoes ORDER BY ${ordenar};`);
            designA(result);
        }
        async function atualizarB() {
            referencia.disabled = true;
            try {
                const id = Number(referencia.value);
                if (!Number.isInteger(id) || id < 1 || id > 10) throw new Error('Referência inválida.');
                // A transformação é executada no DuckDB, não no código de desenho.
                const result = await base.query(`SELECT p.categoria, p.percentual,
                    r.categoria AS referencia, r.percentual AS referencia_pct,
                    p.percentual - r.percentual AS diferenca
                    FROM preocupacoes p
                    CROSS JOIN (SELECT categoria, percentual FROM preocupacoes WHERE id = ${id}) r
                    ORDER BY p.percentual DESC, p.ordem_original;`);
                designB(result);
                document.querySelector('#notaReferenciaCaso3').textContent =
                    `Referência: ${result[0].referencia} (${result[0].referencia_pct}%). ` +
                    'Negativo = abaixo; positivo = acima; zero = mesmo percentual.';
            } finally { referencia.disabled = false; }
        }
        await atualizarA();
        await atualizarB();
        ordem.disabled = false;
        status.textContent = '10 temas consultados e validados no DuckDB.';
        ordem.addEventListener('change', () => atualizarA().catch(falha));
        referencia.addEventListener('change', () => atualizarB().catch(falha));
        // A conexão permanece aberta porque os seletores fazem novas consultas SQL.
        window.addEventListener('pagehide', event => {
            if (!event.persisted) base.db.terminate();
        });
    } catch (error) { falha(error); }
});
