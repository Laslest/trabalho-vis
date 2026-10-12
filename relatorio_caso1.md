# Caso 1: proporção de imigrantes nos EUA

## Visualização original

A visualização escolhida foi tirada do blog Junk Charts, no post "Mirror images" de Kaiser Fung (28/09/2026). Na verdade são dois gráficos de área que Hans-Jörg Schulz publicou no Twitter como exemplo. Eles foram reproduzidos do livro "Good Charts Workbook" de Scott Berinato (p. 130) e usam dados do Pew Research Center sobre a porcentagem de nascidos no exterior na população dos EUA de 1910 a 2013. Os dois usam o mesmo dado: a população dividida entre quem nasceu fora do país (imigrantes) e quem nasceu nos EUA (não imigrantes).

O primeiro gráfico mostra a porcentagem de imigrantes com o eixo y indo de 0% a 16%. O segundo mostra a porcentagem de não imigrantes com o eixo y indo de 0% a 100%.

A pergunta que os gráficos tentam responder é se a quantidade de imigrantes nos EUA hoje está alta em comparação com o passado.

## Dados e atributos

O original usa dados do Pew Research Center de 1910 a 2013, que vêm dos censos dos EUA. Nos redesigns usamos os dados do próprio U.S. Census Bureau: o relatório de Gibson e Lennon (1999) para 1850 a 1990, o censo de 2000, a ACS de 2010 e o número de 2024 publicado pelo Census Bureau em julho de 2026.

Aumentamos o período para 1850 a 2024 de propósito. Começando em 1910, o original já começa num valor alto e não deixa ver que de 1860 a 1920 a porcentagem ficou quase sempre entre 13% e 15%. Esse período anterior é o que permite responder se o valor de hoje é inédito. O ano de 2024 foi incluído por ser o dado mais recente.

O conjunto de dados é uma tabela com 18 itens, um para cada ano de censo. Os atributos são:

| Atributo | Tipo |
|---|---|
| ano | quantitativo, ordenado (tempo) |
| imigrantes | quantitativo (número de pessoas) |
| populacao | quantitativo (número de pessoas) |
| pct (derivado) | quantitativo, de 0 a 100 |

No DuckDB carregamos o csv e fizemos duas transformações vistas em aula: uma derivação, calculando a porcentagem de imigrantes (`100 * imigrantes / populacao`), e a conversão do número de imigrantes para milhões. Também fizemos uma consulta simples de validação para conferir se não havia anos repetidos e se nenhum ano tinha mais imigrantes que população. As porcentagens calculadas batem com as publicadas pelo Census Bureau.

As tarefas que o gráfico deveria permitir são:
1. ver a tendência da porcentagem ao longo do tempo;
2. comparar o valor de hoje com o passado e achar os valores máximo e mínimo;
3. entender a diferença entre o número de imigrantes e a porcentagem deles na população.

## Crítica

O principal problema é que os dois gráficos contam histórias opostas usando o mesmo dado. Como cada pessoa é imigrante ou não, a porcentagem de não imigrantes é só 100 menos a de imigrantes. Mostrar uma ou outra não muda a informação, mas muda o que chama a atenção. No primeiro gráfico parece que a imigração explodiu nas últimas décadas. No segundo parece que nada mudou.

Isso acontece por causa das escalas. A porcentagem de imigrantes varia uns 10 pontos (de 14,7% em 1910 até 4,7% em 1970). No primeiro gráfico, com eixo de 0 a 16%, essa variação ocupa mais da metade da altura. No segundo, com eixo de 0 a 100%, ocupa só um décimo e a curva fica quase reta.

O segundo gráfico também segue a regra de começar o eixo no zero, que é certa para barras e áreas, mas aqui faz com que a maior parte do gráfico seja uma área cinza que não muda. Como o Fung comenta no post, usar a regra sem pensar na tarefa atrapalha mais do que ajuda.

O uso de área também não é o melhor para essa tarefa. Pela hierarquia de Cleveland e McGill, posição numa escala comum é o canal mais preciso, e para ver tendência uma linha já basta. A área preenchida e suavizada também esconde que existe só um valor por década, e que entre 2010 e 2024 não tem nenhum ponto no meio.

Por último, os gráficos não têm nenhum contexto: não mostram o valor de nenhum ano, não marcam o máximo e o mínimo e não mostram o número de imigrantes, que é o dado mais citado nas notícias ("recorde de imigrantes").

## Design A: linha da porcentagem

O Design A é um gráfico de linha com a porcentagem de imigrantes de 1850 a 2024, com um ponto em cada ano de censo. O eixo y vai de 0% a 20%. Tem uma faixa clara mostrando o intervalo dos valores entre 1860 e 1920 (13,2% a 14,8%) e rótulos só no mínimo (4,7% em 1970) e no último ano (14,8% em 2024).

Justificativa:
- Trocamos a área por linha e pontos porque a tarefa principal é ver a tendência. O marcador é o ponto (um por censo) e o canal é a posição vertical, que é o mais preciso. Os pontos mostram onde existe dado de verdade.
- O eixo começa no zero para não exagerar a variação como no primeiro original, mas vai só até 20% para não achatar a curva como no segundo.
- Mostramos só a classe dos imigrantes, porque a outra é o complemento e não acrescenta informação.
- A faixa de 1860 a 1920 ajuda na comparação com o passado: dá para ver que 2024 está dentro de uma faixa que já tinha acontecido.
- Colocamos poucos rótulos para não poluir o gráfico, só nos pontos que importam para a pergunta.

## Design B: barras com o número de imigrantes

O Design B é um gráfico de barras com o número de imigrantes (em milhões) em cada censo. Em cima de cada barra está escrita a porcentagem da população. As barras de 1910 e 2024 têm uma cor mais escura.

Justificativa:
- O original não mostra o número de imigrantes, só a porcentagem. Isso confunde quem lê notícias dizendo que o número é recorde e outras dizendo que a porcentagem é igual à de um século atrás. As duas coisas são verdade.
- Usamos barras porque o atributo mostrado é uma quantidade, e aqui o eixo precisa começar no zero, já que o tamanho da barra representa o valor. Cada barra é um item, o ano vai no canal x e o número vai no canal y.
- Não usamos um gráfico com dois eixos y, que seria a forma mais comum de mostrar as duas medidas juntas, porque ele depende muito das escalas escolhidas e pode enganar. Por isso a porcentagem foi escrita como texto.
- A cor escura em 1910 e 2024 cria um efeito de destaque (pop-out). Os dois anos têm quase a mesma porcentagem (14,7% e 14,8%), mas em 2024 a barra é quase quatro vezes maior.

## Comparação entre os designs

| | Design A | Design B |
|---|---|---|
| Tarefa principal | tendência e comparação com o passado | relação entre número e porcentagem |
| Marcador e canal | pontos e linha, posição vertical | barras, tamanho e posição vertical |
| O que melhora | tira o efeito das escalas diferentes e mostra o contexto histórico | mostra o número de imigrantes, que o original não tinha |
| Trade-off | não mostra o número de imigrantes | a porcentagem fica só como texto, então ler a tendência dela é mais difícil; os anos ficam igualmente espaçados mesmo com 14 anos entre 2010 e 2024 |
| Contexto de uso | notícia ou relatório que quer responder se o nível atual é alto | texto que explica a diferença entre "recorde" e "nível parecido com 1910" |

Os dois designs se completam. O A responde melhor a pergunta original e o B responde uma pergunta que o original nem deixava fazer.

## Limitações

- Os dados misturam censos de dez em dez anos com a ACS, que é uma pesquisa por amostra. Não usamos 2020 porque o Census Bureau considerou os dados da ACS daquele ano experimentais por causa da pandemia.
- A definição de "nascido no exterior" mudou um pouco desde 1850.
- O original usa os dados anuais do Pew até 2013, e nós usamos só os anos de censo até 2024. Por isso as curvas não são idênticas, principalmente depois de 2000.

## Texto para a introdução do grupo

O primeiro caso, retirado do Junk Charts, é um par de gráficos de área sobre a porcentagem de imigrantes nos EUA. Os dois usam o mesmo dado, mas um mostra os imigrantes e o outro os não imigrantes, com escalas diferentes. Escolhemos esse caso porque ele mostra como a escolha do que mostrar e da escala do eixo muda a mensagem do gráfico.

## Texto para a discussão final

No caso 1 os dois gráficos não têm nenhum número errado, e mesmo assim passam mensagens opostas. Isso mostra que regras como "o eixo sempre começa no zero" não bastam, e que a escala precisa ser escolhida pensando na tarefa. As decisões mais importantes foram trocar a área por linha e pontos e incluir o número de imigrantes, que faltava no original.

## Referências

- FUNG, K. Mirror images. Junk Charts, 28 set. 2026. https://www.junkcharts.com/mirror-images/
- GIBSON, C.; LENNON, E. Historical Census Statistics on the Foreign-Born Population of the United States: 1850 to 1990. U.S. Census Bureau, Working Paper 29, 1999.
- GIBSON, C.; JUNG, K. Historical Census Statistics on the Foreign-Born Population of the United States: 1850 to 2000. U.S. Census Bureau, Working Paper 81, 2006.
- GRYN, T.; SMITH, A. Foreign-Born Population in the United States Changed Significantly in Both Numbers and Countries of Origin. U.S. Census Bureau, 21 jul. 2026.
- MUNZNER, T. Visualization Analysis and Design. CRC Press, 2014.
- CLEVELAND, W.; McGILL, R. Graphical Perception. Journal of the American Statistical Association, 1984.
