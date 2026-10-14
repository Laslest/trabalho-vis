# Trabalho de visualização de dados — três casos

Aplicação única com três visualizações originais analisadas e seis redesigns em D3.js.
O projeto segue a estrutura dos exemplos da aula: Vite, módulos JavaScript e DuckDB-Wasm.

## Como abrir e executar

1. Clone o repositório: `git clone https://github.com/Laslest/trabalho-vis.git`
2. No VS Code, use **Arquivo → Abrir Pasta** e escolha a pasta `trabalho-vis`, que contém `package.json`, `index.html` e este README.
3. Abra **Terminal → Novo Terminal** nessa pasta.
4. Com Node.js e npm instalados, execute:

```powershell
npm.cmd install
npm.cmd run dev
```

No macOS/Linux, use `npm install` e `npm run dev`.
Abra no navegador o endereço mostrado pelo Vite (normalmente `http://localhost:5173`).
Não é necessário instalar DuckDB separadamente: DuckDB-Wasm executa no navegador.
Não abra `index.html` com duplo clique, pois os módulos e arquivos de dados precisam do servidor.

Se aparecer `ENOENT` ou “Could not read package.json”, o terminal está na pasta errada.
Abra a pasta que contém esse arquivo.

## Casos integrados

| Caso | Original analisado no Junk Charts | Design A | Design B |
|---|---|---|---|
| 1 — Imigração nos EUA | Mirror images | Linha da porcentagem | Barras do número de imigrantes, com porcentagens nos rótulos |
| 2 — Queijos na Europa | A cheesy graphic | Pontos da produção | Matrizes de 100 pontos, Alemanha = 100 |
| 3 — Preocupações nos EUA | Ten pie charts. Are you worried yet? | Barras horizontais | Diferenças em pontos percentuais para um tema escolhido |

Os três casos estão no mesmo `index.html`. Os links no início da página levam a cada seção.

## Onde editar

- `index.html`: títulos, textos, fontes exibidas na página e imagens originais.
- `index.css`: aparência; estilos dos Casos 2 e 3 estão limitados às respectivas seções.
- `relatorio.md`: relatório final integrado, com introdução, três análises, discussão e referências bibliográficas na seção 4.
- `public/FONTE_caso3.md`: proveniência, dicionário e limitações dos dados do Caso 3.

| Caso | Dados | Carregamento e consultas | Desenho em D3 |
|---|---|---|---|
| 1 | `public/imigracao_eua.csv` | `src/imigracao.js`, `src/main.js` | `src/plot.js` |
| 2 | `public/queijos_europa.csv` | `src/queijos.js`, `src/main_caso2.js` | `src/plot_caso2.js` |
| 3 | `public/preocupacoes_eua.csv` | `src/preocupacoes.js`, `src/main_caso3.js` | `src/plot_caso3.js` |

`src/config.js` configura o DuckDB-Wasm. Os códigos e CSVs dos Casos 1 e 2 foram preservados na integração.
Cada caso tem IDs próprios. Os listeners dos Casos 2 e 3 não substituem a inicialização do Caso 1.

## Uso do DuckDB e interpretação

- Caso 1: consulta e valida os dados e calcula porcentagens e números em milhões.
- Caso 2: valida os três países, ordena a produção e calcula o índice relativo à Alemanha em SQL.
- Caso 3: valida dez temas, ordena os valores e calcula diferenças em SQL a cada mudança de referência.

No Caso 2, as matrizes representam um índice, não participação na produção total da UE.
No Caso 3, as categorias não são mutuamente exclusivas e os percentuais não somam 100%.
Uma diferença de 10 pontos percentuais não significa aumento de 10% nem mudança no tempo.
A escala do Design B permanece fixa entre −25 e +25 p.p. ao mudar a referência.

## Conferência e versão de produção

```powershell
npm.cmd run build
npm.cmd run preview
```

Confira os seis gráficos e as mensagens de validação dos Casos 2 e 3.
No Caso 2, as matrizes devem conter 100, 79 e 58 pontos azuis.
No Caso 3, confira as dez barras e os dez pontos, a ordenação alfabética e a troca de referência.
Com criminalidade (42%) como referência, inflação deve aparecer em +10 p.p. e mudanças climáticas em −12 p.p.

As imagens originais dos três casos estão incluídas em `public/`, com os créditos e links das fontes preservados na página. Os links para os artigos externos exigem internet.
Os CSVs e os arquivos do DuckDB são servidos pelo projeto. Nenhuma biblioteca de gráficos de alto nível é usada.
`node_modules` e `dist` são gerados pelos comandos acima e não vão para o repositório.
