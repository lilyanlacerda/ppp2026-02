# 📂 Documentação de QA — Loja PPP

Índice da documentação de testes da Loja PPP. Os documentos estão numerados na **ordem recomendada de leitura** e seguem os tipos de documento da **ISO/IEC/IEEE 29119-3**.

⬅️ Voltar para o [portfólio](../../README.md) · 📄 [Documentação da aplicação](../aplicacao.md) · 🔌 [Swagger](../swagger.yaml)

---

## 🗺️ Documentos

| # | Documento | Tipo de documento (ISO/IEC/IEEE 29119-3) | O que responde | Status |
|---|---|---|---|---|
| 01 | [Plano de Testes](01-plano-de-testes.md) | *Test Plan* | O que, como, quando e com quais critérios testar; riscos | ✅ Concluído |
| 02 | [Casos de Teste Web](02-casos-de-teste-web.md) | *Test Design Specification* + *Test Case Specification* | Quais condições e casos validam o site | ✅ Concluído |
| 03 | [Casos de Teste API](03-casos-de-teste-api.md) | *Test Design Specification* + *Test Case Specification* | Quais condições e casos validam a API REST | ✅ Concluído |
| 04 | [Report de Bugs](04-report-de-bugs.md) | *Incident Report* | Quais defeitos foram encontrados, com evidências | ✅ Concluído |
| 05 | [Automação Web — Cypress](05-automacao-web-cypress.md) | *Test Procedure Specification* + *Test Execution Log* | Quais casos Web foram automatizados e como executá-los | ✅ Concluído |
| 06 | [Automação API — JavaScript](06-automacao-api.md) | *Test Procedure Specification* + *Test Execution Log* | Quais casos de API foram automatizados e como executá-los | ✅ Concluído |
| 07 | [Performance — k6](07-performance-k6.md) | *Test Procedure Specification* + *Test Result* | Como a aplicação se comporta sob carga | 🚧 Em andamento |
| 08 | [Relatório de Conclusão](08-relatorio-de-conclusao.md) | *Test Completion Report* | O que foi testado, resultados, métricas e risco residual | 🚧 Em andamento |

**Por onde começar?**
- ⏱️ **Tem 5 minutos:** leia o [Report de Bugs](04-report-de-bugs.md) e o [Relatório de Conclusão](08-relatorio-de-conclusao.md).
- 🔍 **Quer ver o raciocínio:** comece pelo [Plano de Testes](01-plano-de-testes.md), seções 5 (riscos) e 6.3 (técnicas).
- 🤖 **Quer ver código:** vá direto para as automações (05, 06 e 07).

---

## 🔗 Como os documentos se conectam

```
Requisitos (README / Swagger)
        │
        ▼
01 Plano de Testes ──► Registro de riscos (RP01–RP10) ──► prioridade dos casos
        │
        ├──► 02 Casos Web  (CT-WEB-*) ──┐
        ├──► 03 Casos API  (CT-API-*) ──┼──► execução manual ──► 04 Bugs (BUG-*) ──► Issues no GitHub
        │                               │
        │                               └──► 05 Cypress · 06 API JS · 07 k6 (PERF-*)
        │                                              │
        └──────────────────────────────────────────────┴──► 08 Relatório de Conclusão
```

Cada caso de teste aponta para o **requisito** e o **risco** que cobre; cada bug aponta para o **caso de teste** que o revelou; cada script automatizado aponta para o **ID do caso** que implementa. A matriz completa está no [Anexo A do Plano de Testes](01-plano-de-testes.md#anexo-a--matriz-de-rastreabilidade-requisito--caso-de-teste).

---

## 🏷️ Convenções

### Identificadores

| Prefixo | Significado | Exemplo |
|---|---|---|
| `RN` | Regra de negócio | `RN01`: desconto de 10% em dinheiro |
| `RF` / `RNF` | Requisito funcional / não funcional | `RF03`: rotas protegidas exigem token |
| `RP` / `RJ` | Risco de produto / de projeto | `RP03`: concorrência no checkout |
| `CT-WEB-<FUNC>-NN` | Caso de teste Web | `CT-WEB-CHK-01` |
| `CT-API-<FUNC>-NN` | Caso de teste API | `CT-API-CAR-04` |
| `PERF-NN` | Cenário de performance | `PERF-03`: jornada de compra |
| `BUG-NNN` | Defeito registrado | `BUG-001` |

**Códigos de funcionalidade (`<FUNC>`):** `CAD` Cadastro · `LOG` Login · `AUTH` Autenticação (API) · `USR` Usuário · `PRD` Produtos · `CAR` Carrinho · `CHK` Checkout · `SEC` Segurança · `GEN` Geral e contrato (API).

### Severidade e prioridade dos defeitos

| Severidade | Quando usar |
|---|---|
| 🔴 **Crítica** | Perda financeira ou de dados, ou bloqueio do fluxo principal |
| 🟠 **Alta** | Funcionalidade importante falha e o contorno é difícil |
| 🟡 **Média** | Falha com contorno simples ou fora do fluxo principal |
| 🟢 **Baixa** | Problema cosmético, de texto ou de usabilidade |

**Prioridade:** `P1` corrigir imediatamente · `P2` corrigir nesta versão · `P3` backlog.

### Status dos casos de teste

| Status | Significado |
|---|---|
| ✅ Aprovado | Resultado obtido igual ao esperado |
| ❌ Reprovado | Resultado diferente do esperado; bug registrado |
| ⛔ Bloqueado | Não pôde ser executado por impedimento (ambiente ou outro defeito) |
| ⏳ Não executado | Planejado, ainda não executado |

---

## 🧪 Ambiente e dados de referência

- **Aplicação:** `npm install && npm start` → http://localhost:3030 (banco em memória: reiniciar restaura os dados).
- **Personas:** Ana (não VIP, R$ 0 gastos), Bruno (não VIP, faltam R$ 20 para VIP) e Carla (VIP). Todas com a senha `123456`.
- **Produtos:** Teclado (R$ 250,00, estoque 10), Mouse (R$ 89,90, estoque 5) e Monitor (R$ 899,00, sem estoque).

Detalhes nas seções 6.6 e 6.7 do [Plano de Testes](01-plano-de-testes.md).

---

## 📸 Evidências

Prints, GIFs, logs e relatórios gerados ficam em [`evidencias/`](evidencias/), organizados por documento:

```
evidencias/
├── bugs/          # prints e logs de cada BUG-NNN
├── cypress/       # vídeos e screenshots das execuções
├── api/           # relatórios das execuções da suíte de API
└── k6/            # resumos e relatórios HTML de performance
```

Nome dos arquivos: `<ID>-<descricao-curta>.<ext>`, por exemplo `BUG-001-checkout-concorrente.png`.

---

## 📖 Normas de referência

| Norma | Uso nesta documentação |
|---|---|
| ISO/IEC/IEEE 29119-1 | Conceitos e vocabulário de teste |
| ISO/IEC/IEEE 29119-2 | Processo de teste baseado em risco |
| ISO/IEC/IEEE 29119-3 | Estrutura e conteúdo de cada documento |
| ISO/IEC/IEEE 29119-4 | Técnicas de projeto de teste (tabela de decisão, valor-limite, etc.) |
| ISO/IEC 25010 | Características de qualidade associadas a cada risco e tipo de teste |
