import * as d3 from 'd3';

// Os IDs e classes exclusivos evitam interferência nos outros dois casos.
const numero = v => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const delta = v => `${v > 0 ? '+' : ''}${numero(v)} p.p.`;

// Design A: barras horizontais em escala comum de 0 a 100%.
export function designA(data, margens = { left: 215, right: 50, top: 35, bottom: 40 }) {
    const svg = d3.select('#caso3DesignA');
    svg.selectAll('*').remove();
    const width = 800 - margens.left - margens.right;
    const height = 440 - margens.top - margens.bottom;
    const mapX = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const mapY = d3.scaleBand().domain(data.map(d => d.categoria)).range([0, height]).padding(0.3);
    const group = svg.append('g').attr('transform', `translate(${margens.left}, ${margens.top})`);
    group.append('g').attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(mapX).ticks(5).tickFormat(d => d + '%'));
    group.append('g').call(d3.axisLeft(mapY).tickSize(0).tickPadding(10));
    const barras = group.selectAll('.preocupacao').data(data).join('rect')
        .attr('class', 'preocupacao').attr('x', 0).attr('y', d => mapY(d.categoria))
        .attr('height', mapY.bandwidth()).attr('width', d => mapX(d.percentual))
        .attr('tabindex', 0).attr('aria-label', d => `${d.categoria}: ${numero(d.percentual)}%`);
    barras.append('title').text(d => `${d.categoria}: ${numero(d.percentual)}%`);
    group.selectAll('.rotulo').data(data).join('text').attr('class', 'rotulo')
        .attr('x', d => mapX(d.percentual) + 8)
        .attr('y', d => mapY(d.categoria) + mapY.bandwidth() / 2 + 4)
        .text(d => numero(d.percentual) + '%');
    svg.append('text').attr('class', 'nota').attr('x', margens.left).attr('y', 18)
        .text('Respondentes que citam o tema entre os mais importantes (%)');
}

// Design B: o SQL fornece a diferença em relação ao tema escolhido.
// A ordem permanece fixa e o domínio ±25 comporta todos os pares (máximo: 22 p.p.).
export function designB(data, margens = { left: 290, right: 80, top: 40, bottom: 40 }) {
    const svg = d3.select('#caso3DesignB');
    svg.selectAll('*').remove();
    const width = 800 - margens.left - margens.right;
    const height = 440 - margens.top - margens.bottom;
    const mapX = d3.scaleLinear().domain([-25, 25]).range([0, width]);
    const mapY = d3.scalePoint().domain(data.map(d => d.categoria)).range([12, height - 12]);
    const group = svg.append('g').attr('transform', `translate(${margens.left}, ${margens.top})`);
    group.append('g').attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(mapX).tickValues([-20, -10, 0, 10, 20])
            .tickFormat(d => d > 0 ? `+${d}` : d));
    // Espaço entre nomes e escala para acomodar os rótulos negativos.
    group.append('g').attr('transform', 'translate(-82, 0)')
        .call(d3.axisLeft(mapY).tickSize(0).tickPadding(0))
        .call(g => g.select('.domain').remove());
    group.append('line').attr('class', 'zero')
        .attr('x1', mapX(0)).attr('x2', mapX(0)).attr('y1', 0).attr('y2', height);
    const classe = d => d.diferenca > 0 ? 'acima' : d.diferenca < 0 ? 'abaixo' : 'igual';
    group.selectAll('.distancia').data(data).join('line').attr('class', 'distancia')
        .attr('x1', mapX(0)).attr('x2', d => mapX(d.diferenca))
        .attr('y1', d => mapY(d.categoria)).attr('y2', d => mapY(d.categoria));
    const pontos = group.selectAll('circle').data(data).join('circle')
        .attr('class', classe).attr('cx', d => mapX(d.diferenca))
        .attr('cy', d => mapY(d.categoria)).attr('r', 5).attr('tabindex', 0)
        .attr('aria-label', d => `${d.categoria}: ${numero(d.percentual)}%; diferença ${delta(d.diferenca)}`);
    pontos.append('title').text(d => `${d.categoria}: ${numero(d.percentual)}%; ${delta(d.diferenca)}`);
    group.selectAll('.rotulo').data(data).join('text').attr('class', 'rotulo')
        .attr('x', d => mapX(d.diferenca) + (d.diferenca < 0 ? -10 : 10))
        .attr('y', d => mapY(d.categoria) + 4)
        .attr('text-anchor', d => d.diferenca < 0 ? 'end' : 'start')
        .text(d => delta(d.diferenca));
    svg.append('text').attr('class', 'nota').attr('x', margens.left).attr('y', 18)
        .text('Diferença em pontos percentuais (p.p.)');
}
