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
Os dois casos aparecem na mesma página HTML, com seus originais e dois redesigns.

Este documento reúne os casos implementados. O Caso 3 ainda não foi fornecido pelo
terceiro integrante e deverá ser incluído antes da entrega final do trabalho.

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

O segundo gráfico também segue a regra de começar o eixo no zero, que é certa para barras e áreas, mas aqui faz com que a maior parte do gráfico seja uma área cinza que não muda. Como o Fung comenta no post, usar a regra sem pensar na tarefa atrapalha mais do que ajuda.

O uso de área também não é o melhor para essa tarefa. Pela hierarquia de Cleveland e McGill, posição numa escala comum é o canal mais preciso, e para ver tendência uma linha já basta. A área preenchida e suavizada também esconde que existe só um valor por década, e que entre 2010 e 2024 não tem nenhum ponto no meio.

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

A integração usa IDs exclusivos e um listener independente para não substituir
a inicialização do Caso 1. O CSS novo fica limitado à seção do Caso 2. O código e os dados do Caso 1 são preservados. O conteúdo de seu relatório é incorporado a este documento.

### 2.3. Caso 3 — A integrar

O terceiro integrante deverá acrescentar o original e seu contexto, os dados e
atributos, a crítica, os dois redesigns, suas justificativas, comparação e limitações.

## 3. Discussão final

Nos dois casos implementados, o principal aprendizado é que dados corretos não
asseguram uma interpretação adequada. No Caso 1, escalas e o uso do complemento
da proporção produzem impressões diferentes sobre a mesma população. No Caso 2,
a perspectiva, o tamanho dos desenhos e os recortes dos queijos tornam ambígua
a comparação visual entre os países.

As decisões de design procuram tornar explícitas as medidas e referências. A linha
com pontos do Caso 1 favorece a leitura da tendência e do contexto histórico; suas
barras acrescentam os números absolutos. Os pontos do Caso 2 favorecem comparação
em milhões de toneladas; suas matrizes explicam a produção relativa à Alemanha.
Os canais visuais e as escalas são escolhidos conforme essas tarefas.

Os redesigns também envolvem trade-offs. O Caso 1 amplia o período do original e
combina censos com dados de pesquisa amostral. A linha não comunica sozinha a
contagem absoluta; nas barras, a porcentagem depende de rótulos. No Caso 2, o recorte
contém apenas três países e usa números arredondados, com o dado francês provisório.
As matrizes arredondam novamente o preenchimento e exigem compreender a referência
Alemanha = 100, que não corresponde à participação no total europeu.

D3.js permite controlar marcas, escalas e eixos diretamente. DuckDB-Wasm explicita
as transformações em SQL e verifica condições básicas dos dados. Essas validações
não eliminam as limitações das fontes nem demonstram precisão estatística.
As imagens originais externas dependem de conexão com a internet.

A comparação entre os três casos e os aprendizados finais do grupo deverão ser
completados após a inclusão do Caso 3, sem atribuir resultados a uma implementação
ainda ausente.

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
