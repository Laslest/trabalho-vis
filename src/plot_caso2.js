import * as d3 from 'd3';

function virgula(v) {
    return v.toFixed(1).replace('.', ',');
}

// Design A: produção absoluta em um eixo comum, começando em zero.
export function designA(data, margens = { left: 90, right: 100, top: 40, bottom: 50 }) {
    const svg = d3.select('#caso2DesignA');
    const width = 800 - margens.left - margens.right;
    const height = 300 - margens.top - margens.bottom;
    svg.selectAll('*').remove();

    // Escalas e eixos, no mesmo padrão das funções do Caso 1.
    const mapX = d3.scaleLinear().domain([0, 2.5]).range([0, width]);
    const mapY = d3.scaleBand().domain(data.map(d => d.pais)).range([0, height]).padding(0.5);
    const group = svg.append('g').attr('transform', `translate(${margens.left}, ${margens.top})`);
    group.append('g').attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(mapX).ticks(5).tickFormat(virgula));
    group.append('g').call(d3.axisLeft(mapY).tickSize(0));

    // Guias e pontos: somente a posição horizontal representa a quantidade.
    group.selectAll('.guia').data(data).join('line').attr('class', 'guia')
        .attr('x1', 0).attr('x2', width)
        .attr('y1', d => mapY(d.pais) + mapY.bandwidth() / 2)
        .attr('y2', d => mapY(d.pais) + mapY.bandwidth() / 2);
    group.selectAll('circle').data(data).join('circle')
        .attr('cx', d => mapX(d.producao_mi))
        .attr('cy', d => mapY(d.pais) + mapY.bandwidth() / 2).attr('r', 5);
    group.selectAll('.rotulo').data(data).join('text').attr('class', 'rotulo')
        .attr('x', d => mapX(d.producao_mi) + 10)
        .attr('y', d => mapY(d.pais) + mapY.bandwidth() / 2 + 4)
        .text(d => virgula(d.producao_mi) + ' mi t');
    svg.append('text').attr('class', 'nota').attr('x', margens.left).attr('y', 20)
        .text('Produção de queijo em 2024 (milhões de toneladas)');
}

// Design B: uma matriz de 100 pontos por país, Alemanha como referência.
export function designB(data) {
    const svg = d3.select('#caso2DesignB');
    svg.selectAll('*').remove();
    const grupos = svg.selectAll('g').data(data).join('g')
        .attr('transform', (d, i) => `translate(${65 + i * 250}, 30)`);

    grupos.each(function(d) {
        const grupo = d3.select(this);
        grupo.append('text').attr('class', 'rotulo').attr('x', 0).attr('y', 0).text(d.pais);
        grupo.append('text').attr('class', 'nota').attr('x', 0).attr('y', 24)
            .text(virgula(d.indice) + '% da produção alemã');

        // Arredonda só o preenchimento: o rótulo mantém uma casa decimal.
        grupo.selectAll('circle').data(d3.range(100)).join('circle')
            .attr('class', i => i < Math.round(d.indice) ? 'producao' : 'diferenca')
            .attr('cx', i => 6 + (i % 10) * 17)
            .attr('cy', i => 48 + Math.floor(i / 10) * 17).attr('r', 5);
    });
}
