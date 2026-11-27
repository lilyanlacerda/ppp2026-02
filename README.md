<h1 align="center">🧪 Portfólio de QA — Loja PPP</h1>

<p align="center">
  Estratégia, documentação e automação de testes de um e-commerce (API REST + Site Web)<br>
  seguindo a <strong>ISO/IEC/IEEE 29119</strong>, com <strong>Cypress</strong>, <strong>JavaScript</strong> e <strong>k6</strong>.
</p>

<p align="center">
  <img alt="ISO 29119" src="https://img.shields.io/badge/ISO%2FIEC%2FIEEE-29119-1f6feb">
  <img alt="Cypress" src="https://img.shields.io/badge/Web-Cypress-17202C?logo=cypress&logoColor=white">
  <img alt="Mocha" src="https://img.shields.io/badge/API-Mocha%20%2B%20Chai%20%2B%20Supertest-8D6748?logo=mocha&logoColor=white">
  <img alt="k6" src="https://img.shields.io/badge/Performance-k6-7D64FF?logo=k6&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-%E2%89%A518-339933?logo=nodedotjs&logoColor=white">
  <!-- Depois de criar o workflow em .github/workflows/qa.yml, descomente o badge abaixo:
  <img alt="CI" src="https://github.com/lilyanlacerda/ppp2026-02/actions/workflows/qa.yml/badge.svg">
  -->
</p>

---

## 👋 Sobre este portfólio

Sou **Lilyan Lacerda**, QA. Neste repositório apliquei um ciclo completo de testes sobre a **Loja PPP**, um e-commerce criado para estudo: do **planejamento baseado em risco** até a **automação** e os **testes de performance**, passando pelo **report de bugs reais** encontrados na aplicação.

**Objetivo:** mostrar como eu penso e trabalho em qualidade de software, ou seja, entender o negócio, priorizar pelo risco, projetar casos com técnicas formais, encontrar e comunicar defeitos e automatizar o que dá retorno.

## 🛒 A aplicação sob teste

Um e-commerce com **API REST** e **site Web** (Node.js, Express, MongoDB em memória, JWT), com quatro funcionalidades: **Cadastro**, **Login**, **Carrinho** e **Finalização de Compra**.

As regras de negócio que mais impactam o cliente, e por isso receberam mais atenção nos testes:

| Regra | Descrição |
|---|---|
| 💵 **Desconto** | Pagamento em dinheiro dá 10% de desconto sobre os produtos (não sobre o frete) |
| 📦 **Estoque** | A quantidade no carrinho não pode passar do estoque; o estoque é baixado no checkout |
| ⭐ **Frete / VIP** | Frete de R$ 20,00; cliente vira VIP ao gastar R$ 300,00 e ganha frete grátis a partir da compra seguinte |

📄 Documentação completa da aplicação: [docs/aplicacao.md](docs/aplicacao.md) · Swagger: [docs/swagger.yaml](docs/swagger.yaml)

## 📚 Entregáveis

| # | Entregável | Descrição | Status |
|---|---|---|---|
| 1 | [Plano de Testes](docs/qa/01-plano-de-testes.md) | Escopo, registro de riscos (produto × projeto), estratégia, técnicas, critérios e cronograma, conforme ISO/IEC/IEEE 29119-3 | ✅ Concluído |
| 2 | [Casos de Teste Web](docs/qa/02-casos-de-teste-web.md) | Especificação dos casos de teste do site | ✅ Concluído |
| 3 | [Casos de Teste API](docs/qa/03-casos-de-teste-api.md) | Especificação dos casos de teste da API REST | ✅ Concluído |
| 4 | [Report de Bugs](docs/qa/04-report-de-bugs.md) | Defeitos encontrados, com evidências e Issues no GitHub | ✅ Concluído |
| 5 | [Automação Web — Cypress](docs/qa/05-automacao-web-cypress.md) | Casos E2E automatizados (`cypress/e2e/`) | ✅ Concluído |
| 6 | [Automação API — JavaScript](docs/qa/06-automacao-api.md) | Casos de API automatizados (`test/api/`) | ✅ Concluído |
| 7 | [Performance — k6](docs/qa/07-performance-k6.md) | Cenários de smoke, carga e jornada de compra (`performance/`) | ✅ Concluído |
| 8 | [Relatório de Conclusão](docs/qa/08-relatorio-de-conclusao.md) | Resultados, métricas e risco residual | 🚧 Em andamento |

## 🐞 Destaques: bugs encontrados

**8 defeitos reais** confirmados e reproduzidos com evidências (logs, prints, consulta ao banco e testes de carga). Detalhes, passos e análise de causa no [Report de Bugs](docs/qa/04-report-de-bugs.md):

| ID | Severidade | Defeito |
|---|---|---|
| BUG-001 | 🔴 Crítica | 5 checkouts simultâneos do mesmo carrinho gravam **5 pedidos** e baixam **5 unidades** do estoque, mas o cliente recebe 1 sucesso e 4 erros 500 |
| BUG-002 | 🟡 Média | *Open redirect*: `/login?voltar=/\example.com` leva o cliente para um site externo após o login |
| BUG-003 | 🟡 Média | Corpo de requisição grande demais retorna **500** em vez de **413** |
| BUG-004 | 🟡 Média | Quantidade do carrinho aceita `true`, `"2"`, `"1e1"` (vira 10) e `null`, contrariando o contrato `integer` |
| BUG-005 | 🟢 Baixa | Cadastro aceita senha formada só por espaços |
| BUG-006 | 🟢 Baixa | Prévia do checkout com carrinho vazio cobra R$ 20,00 de frete |
| BUG-007 | 🟢 Baixa | Esquema `bearer` em minúsculas é recusado (RFC 9110) |
| BUG-008 | 🟡 Média | Performance: cada login **trava a API inteira** (bcrypt em JavaScript puro bloqueia o Node.js). Com 20 logins simultâneos, a leitura de produtos fica ~93× mais lenta e o login passa da meta no ambiente de referência; reproduzido também em um Mac, com impacto menor |

## 🧠 Abordagem

- **Teste baseado em risco** (ISO/IEC/IEEE 29119-2): cada risco tem exposição (probabilidade × impacto), que define a prioridade dos casos.
- **Técnicas formais** (ISO/IEC/IEEE 29119-4): tabela de decisão (desconto × frete), análise de valor-limite (estoque, limite VIP, senha), particionamento de equivalência, transição de estado (Não VIP → VIP) e suposição de erro (concorrência).
- **Qualidade de produto** (ISO/IEC 25010): os testes cobrem adequação funcional, segurança, confiabilidade e eficiência de desempenho.
- **Rastreabilidade:** requisito → risco → caso de teste → automação → bug.

Exemplo, a tabela de decisão usada para validar o total da compra (1 Teclado de R$ 250,00):

| Cliente | Pagamento | Desconto | Frete | Total esperado |
|---|---|---|---|---|
| Não VIP | Dinheiro | R$ 25,00 | R$ 20,00 | **R$ 245,00** |
| Não VIP | Cartão | — | R$ 20,00 | **R$ 270,00** |
| VIP | Dinheiro | R$ 25,00 | Grátis | **R$ 225,00** |
| VIP | Cartão | — | Grátis | **R$ 250,00** |

## 🛠️ Tecnologias

| Área | Ferramentas |
|---|---|
| Documentação | Markdown, ISO/IEC/IEEE 29119-3, ISO/IEC 25010 |
| Testes manuais e exploratórios | Navegador + DevTools, Postman, curl |
| Automação Web | Cypress |
| Automação API | JavaScript: Mocha + Chai + Supertest |
| Performance | k6 |
| Gestão de defeitos | GitHub Issues + GitHub Projects |
| Integração contínua | GitHub Actions |

## ▶️ Como executar

**Pré-requisitos:** Node.js 20.19+ (recomendado: 22 LTS) e npm. Para os testes Web, o Google Chrome. Para performance, o [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) instalado.

```bash
git clone https://github.com/lilyanlacerda/ppp2026-02.git
cd ppp2026-02
npm install
```

Suba a aplicação (fica em http://localhost:3030):

```bash
npm start
```

Rode as suítes (cada `test:*` sobe a aplicação sozinho):

```bash
npm run test:api
```

```bash
npm run test:web
```

```bash
npm run test:perf
```

> ⚠️ O banco é em memória: reiniciar a aplicação restaura os dados de teste. Para reproduzir o BUG-001 automaticamente: `npm run test:api:bugs`. A performance exige o [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) instalado e a aplicação **parada** antes do `test:perf` (o PERF-03 precisa do estoque inicial). Dependendo do hardware, o PERF-02 pode reprovar nas metas por causa do BUG-008.

## 📁 Estrutura do repositório

```
├── README.md                 # Este portfólio
├── docs/
│   ├── aplicacao.md          # Documentação original da aplicação
│   ├── swagger.yaml          # Especificação OpenAPI da API
│   └── qa/                   # Documentação de QA (plano, casos, bugs, relatórios)
├── cypress/                  # Automação Web (Cypress)
├── test/api/                 # Automação de API (Mocha + Chai + Supertest)
├── performance/              # Scripts de performance (k6)
├── .github/                  # CI (GitHub Actions) e template de bug
├── public/                   # Site Web da aplicação
└── src/                      # API REST da aplicação
```

## 🙏 Créditos

A aplicação **Loja PPP** foi criada por **Julio de Lima** para estudo e prática de testes. Este repositório é um fork dela; toda a documentação de QA, a automação e os testes de performance são de minha autoria.

## 📫 Contato

**Lilyan Lacerda** · [GitHub](https://github.com/lilyanlacerda) · [LinkedIn](https://www.linkedin.com/in/lilyanlacerda/)
