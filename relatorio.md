# Relatório crítico — Redesign de visualizações de dados

## 1. Introdução

O objetivo deste trabalho é analisar visualizações publicadas, identificar problemas
na comunicação dos dados e implementar dois redesigns para cada caso com D3.js.
DuckDB-Wasm é usado para consultar, transformar e validar os dados. A escolha das
propostas considera as tarefas que o leitor precisa realizar e os atributos disponíveis.

O Caso 1, **Imigrantes nos Estados Unidos**, foi escolhido por mostrar como escalas
e a representação de uma proporção ou de seu complemento podem mudar a mensagem.
O Caso 2, **Produção de queijo na Europa**, foi escolhido para discutir a dificuldade
de comparar quantidades representadas por pictogramas em perspectiva.
O Caso 3, **Preocupações nos Estados Unidos**, foi escolhido pela dificuldade de
comparar dez pizzas e pela necessidade de distinguir percentuais independentes de
partes de um total. Os três casos aparecem na mesma página HTML, cada um com seu
original e dois redesigns. Os critérios de seleção foram a presença de um problema
visual identificável, dados disponíveis e tarefas que justificassem duas propostas distintas.

## 2. Análise dos casos

### 2.1. Caso 1 — Proporção de imigrantes nos EUA

#### Visualização original

A visualização escolhida foi tirada do blog Junk Charts, no post "Mirror images" de Kaiser Fung (28/09/2026). Na verdade são dois gráficos de área que Hans-Jörg Schulz publicou no Twitter como exemplo. Eles foram reproduzidos do livro "Good Charts Workbook" de Scott Berinato (p. 130) e usam dados do Pew Research Center sobre a porcentagem de nascidos no exterior na população dos EUA de 1910 a 2013. Os dois usam o mesmo dado: a população dividida entre quem nasceu fora do país (imigrantes) e quem nasceu nos EUA (não imigrantes).

O primeiro gráfico mostra a porcentagem de imigrantes com o eixo y indo de 0% a 16%. O segundo mostra a porcentagem de não imigrantes com o eixo y indo de 0% a 100%.

A pergunta que os gráficos tentam responder é se a quantidade de imigrantes nos EUA hoje está alta em comparação com o passado.

#### Dados e atributos

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

#### Crítica

O principal problema é que os dois gráficos contam histórias opostas usando o mesmo dado. Como cada pessoa é imigrante ou não, a porcentagem de não imigrantes é só 100 menos a de imigrantes. Mostrar uma ou outra não muda a informação, mas muda o que chama a atenção. No primeiro gráfico parece que a imigração explodiu nas últimas décadas. No segundo parece que nada mudou.

Isso acontece por causa das escalas. A porcentagem de imigrantes varia uns 10 pontos (de 14,7% em 1910 até 4,7% em 1970). No primeiro gráfico, com eixo de 0 a 16%, essa variação ocupa mais da metade da altura. No segundo, com eixo de 0 a 100%, ocupa só um décimo e a curva fica quase reta.

O segundo gráfico também segue a regra de começar o eixo no zero, que é certa para barras e áreas, mas aqui faz com que a maior parte do gráfico seja uma área colorida que quase não muda. Como o Fung comenta no post, usar a regra sem pensar na tarefa atrapalha mais do que ajuda.

O uso de área também não é o melhor para essa tarefa. Pela hierarquia de Cleveland e McGill, posição numa escala comum é o canal mais preciso, e para ver tendência uma linha já basta. A área preenchida e suavizada também esconde em quais anos existe medição de fato.

Por último, os gráficos não têm nenhum contexto: não mostram o valor de nenhum ano, não marcam o máximo e o mínimo e não mostram o número de imigrantes, que é o dado mais citado nas notícias ("recorde de imigrantes").

#### Design A: linha da porcentagem

O Design A é um gráfico de linha com a porcentagem de imigrantes de 1850 a 2024, com um ponto em cada ano de censo. O eixo y vai de 0% a 20%. Tem uma faixa clara mostrando o intervalo dos valores entre 1860 e 1920 (13,2% a 14,8%) e rótulos só no mínimo (4,7% em 1970) e no último ano (14,8% em 2024).

Justificativa:
- Trocamos a área por linha e pontos porque a tarefa principal é ver a tendência. O marcador é o ponto (um por censo) e o canal é a posição vertical, que é o mais preciso. Os pontos mostram onde existe dado de verdade.
- O eixo começa no zero para não exagerar a variação como no primeiro original, mas vai só até 20% para não achatar a curva como no segundo.
- Mostramos só a classe dos imigrantes, porque a outra é o complemento e não acrescenta informação.
- A faixa de 1860 a 1920 ajuda na comparação com o passado: dá para ver que 2024 está dentro de uma faixa que já tinha acontecido.
- Colocamos poucos rótulos para não poluir o gráfico, só nos pontos que importam para a pergunta.

#### Design B: barras com o número de imigrantes

O Design B é um gráfico de barras com o número de imigrantes (em milhões) em cada censo. Em cima de cada barra está escrita a porcentagem da população. As barras de 1910 e 2024 têm uma cor mais escura.

Justificativa:
- O original não mostra o número de imigrantes, só a porcentagem. Isso confunde quem lê notícias dizendo que o número é recorde e outras dizendo que a porcentagem é igual à de um século atrás. As duas coisas são verdade.
- Usamos barras porque o atributo mostrado é uma quantidade, e aqui o eixo precisa começar no zero, já que o tamanho da barra representa o valor. Cada barra é um item, o ano vai no canal x e o número vai no canal y.
- Não usamos um gráfico com dois eixos y, que seria a forma mais comum de mostrar as duas medidas juntas, porque ele depende muito das escalas escolhidas e pode enganar. Por isso a porcentagem foi escrita como texto.
- A cor escura em 1910 e 2024 cria um efeito de destaque (pop-out). Os dois anos têm quase a mesma porcentagem (14,7% e 14,8%), mas em 2024 a barra é quase quatro vezes maior.

#### Comparação entre os designs

| | Design A | Design B |
|---|---|---|
| Tarefa principal | tendência e comparação com o passado | relação entre número e porcentagem |
| Marcador e canal | pontos e linha, posição vertical | barras, tamanho e posição vertical |
| O que melhora | tira o efeito das escalas diferentes e mostra o contexto histórico | mostra o número de imigrantes, que o original não tinha |
| Trade-off | não mostra o número de imigrantes | a porcentagem fica só como texto, então ler a tendência dela é mais difícil; os anos ficam igualmente espaçados mesmo com 14 anos entre 2010 e 2024 |
| Contexto de uso | notícia ou relatório que quer responder se o nível atual é alto | texto que explica a diferença entre "recorde" e "nível parecido com 1910" |

Os dois designs se completam. O A responde melhor a pergunta original e o B responde uma pergunta que o original nem deixava fazer.

#### Limitações

- Os dados misturam censos de dez em dez anos com a ACS, que é uma pesquisa por amostra. Não usamos 2020 porque o Census Bureau considerou os dados da ACS daquele ano experimentais por causa da pandemia.
- A definição de "nascido no exterior" mudou um pouco desde 1850.
- O original usa os dados anuais do Pew até 2013, e nós usamos só os anos de censo até 2024. Por isso as curvas não são idênticas, principalmente depois de 2000.

### 2.2. Caso 2 — Produção de queijo na Europa (2024)

#### Original e contexto

O original é um infográfico do Eurostat sobre os principais produtores de queijo
na União Europeia em 2024. Foi analisado por Kaiser Fung em **A cheesy graphic**,
no Junk Charts, em 28/01/2026. A pergunta é: entre Alemanha, França e Itália,
qual produziu mais queijo e qual é a diferença entre suas produções?

A imagem informa 2,4 milhões de toneladas para Alemanha, 1,9 para França e 1,4
para Itália; também imprime participações de 23%, 18% e 13% no total europeu.
Esses valores constam da publicação oficial **Key figures on the European food
chain — 2025 edition**. O valor francês é identificado como provisório no original.
Os dados usados são os valores arredondados publicados, não microdados.

#### Dados e tarefas

O CSV contém país (categórico), ano (temporal) e produção em milhões de toneladas
(quantitativo). O recorte cobre apenas os três países do original. As tarefas
priorizadas são identificar a liderança, comparar volumes e comparar cada país
com a Alemanha. Não se calcula participação na UE a partir da soma desses países.

#### Crítica do original

Os desenhos em perspectiva, com tamanhos e pedaços retirados diferentes, tornam
ambígua a marca que representa a quantidade: largura, área total ou área restante.
Sem escala comum, é difícil comparar as produções apenas olhando os pictogramas.
Os números impressos acabam sendo necessários para recuperar os valores.
O Junk Charts também questiona a proporcionalidade dos tamanhos e dos recortes.

Uma imagem de queijo é reconhecível e pode atrair atenção, mas não substitui
uma codificação quantitativa consistente. Os percentuais impressos referem-se
à produção de toda a UE, e os três países não formam um total de 100%.

#### Design A — Gráfico de pontos

Cada país ocupa uma linha, em ordem decrescente. A posição horizontal do ponto
representa a produção num eixo de 0 a 2,5 milhões de toneladas. Rótulos permitem
leitura exata dos valores publicados. O tamanho dos pontos é constante e a cor
é única, evitando que área ou recorte introduzam uma segunda interpretação.

Esse design prioriza ranking e diferenças absolutas. A Alemanha supera a França
em 0,5 milhão de toneladas e a Itália em 1,0 milhão, usando os números arredondados.
A limitação é que o eixo absoluto exige interpretar unidades e não explicita
sozinho a diferença relativa entre os países.

#### Design B — Matrizes de 100 pontos

Cada país possui uma matriz de 10 por 10 pontos. A referência é explicitamente
a Alemanha: índice = 100 × produção do país / produção alemã. Azul representa
a produção relativa; cinza representa a distância até a referência, não produção
faltante nem participação de outros países na UE.

Os índices calculados são 100,0, 79,2 e 58,3. Para preencher pontos inteiros,
o código arredonda para 100, 79 e 58, mantendo uma casa decimal nos rótulos.
Cada ponto corresponde a 1% da produção alemã, aproximadamente 24 mil toneladas
segundo o valor arredondado. Não representa uma fábrica ou um produtor.

A vantagem é comunicar a comparação relativa com unidades iguais. As limitações
são o arredondamento adicional do preenchimento e a necessidade de explicar
que 100 significa a referência alemã, não todo o mercado europeu.

#### Comparação, implementação e discussão

O Design A favorece comparação absoluta; o B explica o índice relativo. Ambos
são distintos dos pictogramas e têm funções simples `designA()` e `designB()`.
DuckDB-Wasm valida três países distintos, valores positivos, o ano 2024 e a
presença da referência. SQL ordena as produções e calcula o índice. D3 implementa
as escalas, eixos e marcas, sem bibliotecas de visualização de alto nível.

### 2.3. Caso 3 — Preocupações nos Estados Unidos (2024–2025)

#### Original e contexto

O infográfico **What Americans Worry About**, da Statista Consumer Insights, foi
analisado por Kaiser Fung no artigo **Ten pie charts. Are you worried yet?**, publicado
no Junk Charts em 27/10/2025. A imagem apresenta uma pizza para cada um de dez temas.
A pergunta é: quais temas os respondentes dos Estados Unidos consideram entre os
mais importantes para o país e como seus percentuais se comparam?

O rodapé informa 60.000 respondentes, de 18 a 64 anos, com coleta de outubro de 2024
a setembro de 2025. São exibidos dez de 18 temas pesquisados. Usamos a imagem histórica
reproduzida no Junk Charts; a página direta da Statista não estava acessível durante
a coleta. O subtítulo da imagem orienta a interpretação: temas citados entre os mais
importantes, e não necessariamente a única preocupação principal de cada pessoa.

#### Dados e tarefas

Os dez percentuais transcritos são: inflação e custo de vida 52%; criminalidade 42%;
situação econômica 40%; saúde e seguridade social 40%; pobreza 37%; moradia 36%;
educação 33%; imigração 31%; desemprego 31%; mudanças climáticas 30%.

| Atributo | Tipo e função |
|---|---|
| id | identificador do tema, usado no seletor de referência |
| categoria / categoria_original | nominal; tradução em português e rótulo original em inglês |
| percentual | quantitativo, percentual publicado entre 0 e 100 |
| ordem_original | ordinal, posição de leitura no infográfico |
| diferenca (derivado) | quantitativo, percentual do tema menos o da referência, em p.p. |

As tarefas são identificar liderança e empates, comparar percentuais e medir a distância
entre um tema e outro. A soma dos valores é 372%: as categorias não representam partes
mutuamente exclusivas de um total. Não normalizamos a soma nem calculamos “outros” por
subtração de 100%. O CSV contém valores publicados, não respostas individuais.

#### Crítica do original

As pizzas usam ângulo e área para representar cada percentual. Comparar dez figuras
separadas exige deslocar a atenção entre elas e lembrar tamanhos, enquanto diferenças
pequenas e empates ficam difíceis de perceber. Os rótulos numéricos acabam realizando
boa parte do trabalho de comparação. Pela hierarquia de percepção gráfica discutida
por Cleveland e McGill, posições numa escala comum favorecem comparações mais precisas.

Cada pizza pode representar a parcela que citou um tema e seu complemento, mas o
conjunto não constitui uma divisão única da população em dez grupos. A repetição de
pizzas exige explicar essa distinção. Cores diferentes e ilustrações identificam os
temas, mas não oferecem uma escala quantitativa comum. A disposição em grade também
interrompe a leitura sequencial de um ranking.

#### Design A — Barras horizontais

Cada tema ocupa uma linha. O comprimento da barra codifica o percentual numa escala
comum de 0 a 100%, com origem zero e rótulo numérico. A ordem inicial é decrescente;
um seletor permite consultar os nomes em ordem alfabética. Os empates mantêm a ordem
original como critério secundário no ranking.

Barras horizontais acomodam nomes longos e permitem comparar os extremos alinhados.
A cor única evita atribuir significado quantitativo a cores diferentes. A escala até
100% explicita o denominador, embora deixe espaço vazio e reduza a separação visual
de diferenças pequenas. Inflação lidera com 52%; economia e saúde empatam em 40%,
e imigração e desemprego em 31%. O próprio artigo do Junk Charts propõe barras como
alternativa; adotamos essa referência e acrescentamos ordenação e contexto explícito.

#### Design B — Diferenças para uma referência

Um gráfico de pontos divergentes mostra a diferença de cada tema para o escolhido
no seletor. A referência inicial é criminalidade (42%). Inflação fica em +10 p.p.
e mudanças climáticas em −12 p.p. A posição horizontal codifica a diferença, uma linha
marca zero e segmentos ligam os pontos a essa origem.

A escala permanece entre −25 e +25 p.p., suficiente para todos os pares, cuja maior
distância é 22 p.p. A ordem decrescente dos percentuais também permanece fixa ao trocar
a referência, permitindo acompanhar os mesmos temas. Azul-esverdeado indica diferenças
negativas, laranja positivas e cinza zero. Posição, sinal e rótulos repetem a informação,
para que a interpretação não dependa apenas da cor.

Esse design prioriza distâncias a uma referência escolhida. Seu custo é exigir que o
leitor compreenda pontos percentuais e acompanhe a referência. Zero indica igualdade
de percentuais publicados, não ausência de preocupação. Os valores absolutos permanecem
no Design A, na tabela e nos títulos das marcas. Não se trata de evolução temporal.

#### Comparação entre os designs

| Aspecto | Design A | Design B |
|---|---|---|
| Tarefa principal | ranking, valores absolutos e empates | comparar diferenças para um tema |
| Marca e canal | barras, comprimento e posição alinhada | pontos, posição horizontal em escala divergente |
| Melhoria | substitui comparação de ângulos por escala comum | explicita distâncias que o original exige calcular |
| Trade-off | domínio até 100% ocupa espaço e comprime pequenas diferenças | exige interpretar referência e pontos percentuais |
| Contexto de uso | leitura inicial em notícia ou relatório | exploração e comparação entre pares |

#### Implementação e limitações

DuckDB-Wasm carrega o CSV, verifica dez IDs, temas e ordens distintos e percentuais
finitos entre 0 e 100. SQL ordena as barras e calcula as diferenças por uma consulta
com a linha de referência. D3 implementa escalas, eixos, marcas e rótulos. O código é
comentado e separa carregamento, consultas e desenho em arquivos diferentes.

A seção usa IDs e estilos próprios para evitar interferir nos demais casos. Há seletores
com rótulos, uma tabela textual, descrições das marcas e rolagem horizontal para preservar
a leitura dos gráficos em telas estreitas.

Os percentuais foram transcritos de rótulos inteiros. Não há microdados, margem de erro,
ponderações ou abertura demográfica; portanto, as diferenças não demonstram significância
estatística nem devem ser generalizadas para todas as idades. O limite de respostas por
pessoa não foi verificado. O recorte de dez temas não permite avaliar os oito omitidos.

## 3. Discussão final

Os três casos mostram que dados corretos não asseguram interpretação adequada. No
Caso 1, escalas e o complemento da proporção produzem impressões diferentes. No Caso 2,
perspectiva e recortes tornam ambígua a quantidade representada. No Caso 3, pizzas
separadas dificultam comparação e exigem esclarecer que os temas não dividem um único total.

Um padrão comum é tornar explícitas medidas, denominadores e referências. A linha do
Caso 1 prioriza tendência e contexto histórico; suas barras acrescentam números absolutos.
Os pontos do Caso 2 comparam volumes; as matrizes usam Alemanha = 100. As barras do Caso 3
comparam percentuais; os pontos mostram distâncias para uma referência selecionada.
A marca e o canal devem ser escolhidos conforme a tarefa: posição alinhada favorece
comparação, enquanto uma linha também explicita ordem temporal. Cor atua como destaque
ou informação redundante, sem substituir escalas e rótulos.

As propostas têm custos. O Caso 1 amplia o período e combina censos com pesquisa amostral;
nas barras, os anos têm espaços iguais e as porcentagens dependem do texto. O Caso 2
usa três países e valores arredondados, com dado francês provisório; as matrizes adicionam
arredondamento e exigem compreender o índice. O Caso 3 preserva apenas dez temas e valores
inteiros; sua comparação relativa exige conhecer a referência e pontos percentuais.
Nenhum redesign resolve ausência de dados ou incerteza não publicada.

D3.js permite controlar diretamente marcas, escalas e eixos. DuckDB-Wasm documenta
transformações em SQL e verifica condições básicas dos dados. Essas validações não
comprovam precisão estatística nem substituem a avaliação das fontes. O projeto integra
os três casos no mesmo padrão visual, com seis gráficos novos e um relatório comum.
As imagens originais dos três casos foram incluídas localmente, com seus créditos e links de origem preservados.

## 4. Referências

- FUNG, K. Mirror images. Junk Charts, 28 set. 2026. https://www.junkcharts.com/mirror-images/
- GIBSON, C.; LENNON, E. Historical Census Statistics on the Foreign-Born Population of the United States: 1850 to 1990. U.S. Census Bureau, Working Paper 29, 1999.
- GIBSON, C.; JUNG, K. Historical Census Statistics on the Foreign-Born Population of the United States: 1850 to 2000. U.S. Census Bureau, Working Paper 81, 2006.
- GRYN, T.; SMITH, A. Foreign-Born Population in the United States Changed Significantly in Both Numbers and Countries of Origin. U.S. Census Bureau, 21 jul. 2026.
- MUNZNER, T. Visualization Analysis and Design. CRC Press, 2014.
- CLEVELAND, W.; McGILL, R. Graphical Perception. Journal of the American Statistical Association, 1984.
- [Junk Charts — A cheesy graphic](https://www.junkcharts.com/a-cheesy-graphic/).
- [Imagem original analisada](https://storage.ghost.io/c/00/37/003715d2-9957-4ad9-99ad-f1deb54be59a/content/images/size/w1200/2026/01/jorgecamoes_eurostatcheeses.jpg).
- [Eurostat — Key figures on the European food chain, edição 2025](https://ec.europa.eu/eurostat/documents/15216629/22711561/KS-01-25-049-EN-N.pdf/86247e8d-0fb6-1fff-f14a-6c25114cb138).
- [Eurostat — tabela Production of cheese, tag00040](https://ec.europa.eu/eurostat/databrowser/product/view/tag00040).
- [FUNG, K. Ten pie charts. Are you worried yet? Junk Charts, 27 out. 2025](https://www.junkcharts.com/ten-pie-charts-are-you-worried-yet/).
- [STATISTA. What Americans Worry About. Consumer Insights](https://www.statista.com/chart/35340/respondents-rank-issues-united-states/). Recorte histórico: out. 2024–set. 2025, reproduzido no Junk Charts.
- [Imagem histórica da Statista utilizada na transcrição](https://storage.ghost.io/c/00/37/003715d2-9957-4ad9-99ad-f1deb54be59a/content/images/size/w1200/2025/10/statista_americanworries.jpeg).
