import * as d3 from 'd3';

// formata numero com virgula: 14.8 -> "14,8"
function virgula(v) {
    return v.toFixed(1).replace('.', ',');
}


// Design A: linha da porcentagem de imigrantes com pontos em cada censo,
// eixo de 0 a 20% e uma faixa mostrando o nivel de 1860 a 1920.
export function designA(data, margens = { left: 50, right: 25, top: 25, bottom: 50 }) {
    const svg = d3.select('#designA');

    const width = +svg.style('width').split('px')[0] - margens.left - margens.right;
    const height = +svg.style('height').split('px')[0] - margens.top - margens.bottom;

    // ---- Escalas
    const mapX = d3.scaleLinear().domain([1850, 2024]).range([0, width]);
    const mapY = d3.scaleLinear().domain([0, 20]).range([height, 0]);

    // ---- Eixos
    svg.append('g')
        .attr('transform', `translate(${margens.left}, ${margens.top + height})`)
        .call(d3.axisBottom(mapX).tickFormat(d3.format('d')));

    svg.append('g')
        .attr('transform', `translate(${margens.left}, ${margens.top})`)
        .call(d3.axisLeft(mapY).tickFormat(d => d + '%'));

    const group = svg.append('g')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    // ---- Faixa de referencia (menor e maior valor entre 1860 e 1920)
    const antigos = data.filter(d => Number(d.ano) >= 1860 && Number(d.ano) <= 1920);
    const menor = d3.min(antigos, d => d.pct);
    const maior = d3.max(antigos, d => d.pct);

    group.append('rect')
        .attr('class', 'faixa')
        .attr('x', 0)
        .attr('width', width)
        .attr('y', mapY(maior))
        .attr('height', mapY(menor) - mapY(maior));

    group.append('text')
        .attr('class', 'nota')
        .attr('x', mapX(1940))
        .attr('y', mapY(maior) - 6)
        .text(`nível de 1860 a 1920 (${virgula(menor)}% a ${virgula(maior)}%)`);

    // ---- Linha
    group.append('path')
        .datum(data)
        .attr('class', 'linha')
        .attr('d', d3.line()
            .x(d => mapX(Number(d.ano)))
            .y(d => mapY(d.pct))
        );

    // ---- Pontos (um por censo)
    group.selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => mapX(Number(d.ano)))
        .attr('cy', d => mapY(d.pct))
        .attr('r', 3);

    // ---- Rotulos so no menor valor e no ultimo ano
    const minimo = data.find(d => d.pct === d3.min(data, d => d.pct));
    const ultimo = data[data.length - 1];

    group.append('text')
        .attr('class', 'rotulo')
        .attr('x', mapX(Number(minimo.ano)))
        .attr('y', mapY(minimo.pct) + 20)
        .attr('text-anchor', 'middle')
        .text(`${virgula(minimo.pct)}% em ${minimo.ano}`);

    group.append('text')
        .attr('class', 'rotulo')
        .attr('x', mapX(Number(ultimo.ano)) - 8)
        .attr('y', mapY(ultimo.pct) - 10)
        .attr('text-anchor', 'end')
        .text(`${virgula(ultimo.pct)}% em ${ultimo.ano}`);

    // ---- Titulo do eixo y
    svg.append('text')
        .attr('class', 'nota')
        .attr('x', margens.left)
        .attr('y', 14)
        .text('% da população que nasceu fora dos EUA');
}


// Design B: barras com o numero de imigrantes (milhoes) em cada censo.
// A porcentagem aparece escrita em cima de cada barra.
// 1910 e 2024 ficam com cor mais escura para comparar os dois anos.
export function designB(data, margens = { left: 50, right: 25, top: 25, bottom: 50 }) {
    const svg = d3.select('#designB');

    const width = +svg.style('width').split('px')[0] - margens.left - margens.right;
    const height = +svg.style('height').split('px')[0] - margens.top - margens.bottom;

    // ---- Escalas
    const mapX = d3.scaleBand()
        .domain(data.map(d => String(d.ano)))
        .range([0, width])
        .padding(0.2);

    const mapY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.imigrantes_mi)])
        .range([height, 0])
        .nice();

    // ---- Eixos
    svg.append('g')
        .attr('transform', `translate(${margens.left}, ${margens.top + height})`)
        .call(d3.axisBottom(mapX));

    svg.append('g')
        .attr('transform', `translate(${margens.left}, ${margens.top})`)
        .call(d3.axisLeft(mapY));

    const group = svg.append('g')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    // ---- Barras
    group.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('class', d => (Number(d.ano) === 1910 || Number(d.ano) === 2024) ? 'barra destaque' : 'barra')
        .attr('x', d => mapX(String(d.ano)))
        .attr('y', d => mapY(d.imigrantes_mi))
        .attr('width', mapX.bandwidth())
        .attr('height', d => height - mapY(d.imigrantes_mi));

    // ---- Porcentagem em cima de cada barra
    group.selectAll('.pct')
        .data(data)
        .join('text')
        .attr('class', 'pct')
        .attr('x', d => mapX(String(d.ano)) + mapX.bandwidth() / 2)
        .attr('y', d => mapY(d.imigrantes_mi) - 5)
        .attr('text-anchor', 'middle')
        .text(d => virgula(d.pct) + '%');

    // ---- Titulo do eixo y
    svg.append('text')
        .attr('class', 'nota')
        .attr('x', margens.left)
        .attr('y', 14)
        .text('milhões de imigrantes (número na barra = % da população)');
}
