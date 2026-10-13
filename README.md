# Casos 1 e 2 — Visualização de dados

Projeto no padrão dos exemplos da aula: Vite + D3.js + DuckDB-Wasm.

## Como rodar

```sh
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite. Os dois casos estão no mesmo `index.html`;
para ir diretamente ao segundo, use `/#caso2`.

## Caso 1 — Imigrantes nos EUA

- `public/imigracao_eua.csv`: ano, imigrantes e população.
- `src/config.js`: carregamento compartilhado do DuckDB.
- `src/imigracao.js`: carregamento e consultas do Caso 1.
- `src/main.js`: consultas SQL e chamada dos gráficos.
- `src/plot.js`: linha e barras em D3.

## Caso 2 — Produção de queijo na Europa

Novo exemplo: **A cheesy graphic**, publicado no Junk Charts em 28/01/2026,
com o infográfico do Eurostat sobre Alemanha, França e Itália em 2024.
Substitui o exemplo anterior sobre preocupações nos Estados Unidos.

- `public/queijos_europa.csv`: produção arredondada em milhões de toneladas.
- `src/queijos.js`: classe que carrega o CSV e consulta o DuckDB.
- `src/main_caso2.js`: validação, ordenação e índice relativo à Alemanha em SQL.
- `src/plot_caso2.js`: pontos e matrizes de 100 pontos em D3.
- `index.css`: estilos dos dois casos; regras do Caso 2 limitadas à seção `#caso2`.
- `relatorio.md`: relatório único com introdução, análise dos casos, discussão final e referências.

O código JavaScript e os dados do Caso 1 permanecem iguais ao original.
O HTML recebe uma seção adicional e um segundo módulo, com IDs exclusivos.
O Caso 2 usa `addEventListener` para não substituir `window.onload` do Caso 1.
As matrizes mostram um índice: Alemanha = 100. Não representam participação
no total da União Europeia. Os valores são arredondados e o dado francês é provisório.

## Conferência

```sh
npm run build
npm run preview
```

Na página principal, confira os dois gráficos do Caso 1 e, abaixo, o Caso 2:
três pontos, três matrizes de cem pontos e a mensagem de três países validados.
Alemanha deve ter 100 pontos azuis, França 79 e Itália 58. Os rótulos mantêm
100,0%, 79,2% e 58,3%. As imagens originais dependem de internet.
