# Caso 1 - Imigrantes nos EUA

Mesma estrutura dos exemplos da aula (vite + d3 + duckdb-wasm).

## Como rodar

```
npm install
npm run dev
```

Depois abrir o endereço que o vite mostrar no terminal (normalmente http://localhost:5173).

## Arquivos

- `public/imigracao_eua.csv`: dados (ano, imigrantes, populacao)
- `src/config.js`: carregamento do DuckDB (igual ao da aula)
- `src/imigracao.js`: classe que carrega o csv no DuckDB e faz as consultas
- `src/main.js`: consultas SQL e chamada dos gráficos
- `src/plot.js`: Design A (linha) e Design B (barras) em D3
- `relatorio_caso1.md`: relatório deste caso
