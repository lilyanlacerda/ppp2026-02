# 📋 Plano de Testes — Loja PPP (API REST + Site Web)

> Documento estruturado conforme a **ISO/IEC/IEEE 29119-3:2021** (*Software testing — Part 3: Test documentation*), seção *Test Plan*, com processo de teste baseado em risco segundo a **ISO/IEC/IEEE 29119-2** e características de qualidade da **ISO/IEC 25010:2023**.

---

## 1. Visão geral

### 1.1 Identificação única do documento

| Item | Valor |
|---|---|
| **Identificador** | `PT-LOJAPPP-001` |
| **Título** | Plano de Testes — Loja PPP |
| **Versão** | 1.1 |
| **Data** | 25/11/2026 |
| **Status** | Em revisão |
| **Classificação** | Público (projeto de portfólio) |

### 1.2 Organização emissora

Lilyan Lacerda — QA (projeto de portfólio pessoal), repositório https://github.com/lilyanlacerda/ppp2026-02.

### 1.3 Autoridade de aprovação

| Papel | Nome | Responsabilidade | Assinatura / data |
|---|---|---|---|
| Autora | Lilyan Lacerda (QA) | Elaboração e manutenção do plano | ____ / ____ |
| Aprovador | Product Owner do projeto | Aprovação do escopo, riscos e critérios de conclusão | ____ / ____ |
| Revisor | Líder técnico do projeto | Revisão técnica (ambiente, dados, viabilidade) | ____ / ____ |

> Como se trata de um projeto de portfólio pessoal, eu (Lilyan Lacerda) acumulei os papéis, porém mantive a estrutura de papeis separados para refletir a prática recomendada.

### 1.4 Histórico de alterações

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.0 | 25/11/2026 | Lilyan Lacerda | Versão inicial baseada na estrutura da ISO/IEC/IEEE 29119-3, ou seja, com inclusão de glossário, premissas e restrições, partes interessadas, plano de comunicação, registro de riscos separado (produto × projeto) com exposição ao risco, política de reteste e regressão, desvios da estratégia, necessidades de treinamento e mapeamento para a ISO/IEC 25010 |

---

## 2. Introdução

### 2.1 Escopo do documento

Este plano define **o que** será testado na aplicação Loja PPP, **como**, **com quais recursos**, **em que prazo** e **com quais critérios** o teste será considerado concluído. Aplica-se ao **nível de sistema** (API REST e site Web, de ponta a ponta), cobrindo testes funcionais manuais e automatizados, testes de desempenho e verificações básicas de segurança.

### 2.2 Referências

| ID | Referência |
|---|---|
| [REF-01] | ISO/IEC/IEEE 29119-1:2022 — Software testing — General concepts |
| [REF-02] | ISO/IEC/IEEE 29119-2:2021 — Software testing — Test processes |
| [REF-03] | ISO/IEC/IEEE 29119-3:2021 — Software testing — Test documentation |
| [REF-04] | ISO/IEC/IEEE 29119-4:2021 — Software testing — Test techniques |
| [REF-05] | ISO/IEC 25010:2023 — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model |
| [REF-06] | [README.md](../../README.md) do projeto — regras de negócio, dados de teste e endpoints |
| [REF-07] | [docs/swagger.yaml](../swagger.yaml) — especificação OpenAPI 3 da API |
| [REF-08] | Código-fonte (`src/services/pricing.js`, `cartService.js`, `checkoutService.js`) — base para testes de caixa-cinza |

### 2.3 Glossário

| Termo | Definição |
|---|---|
| **Item de teste** | Produto de trabalho que é objeto de teste (aqui: API REST e site Web da Loja PPP) |
| **Caso de teste** | Conjunto de pré-condições, entradas, ações e resultados esperados, derivado de uma condição de teste [REF-01] |
| **Condição de teste** | Aspecto testável de um item, por exemplo uma regra de negócio |
| **Critério de conclusão** | Condições que precisam ser atendidas para encerrar o teste |
| **Exposição ao risco** | Probabilidade × Impacto, usada para priorizar o teste [REF-02] |
| **Reteste** | Nova execução de um caso que falhou, para confirmar a correção |
| **Regressão** | Nova execução de casos que passavam, para detectar efeitos colaterais de mudanças |
| **Smoke test** | Subconjunto mínimo de casos que verifica se o sistema está apto para teste |
| **VIP** | Cliente com total gasto ≥ R$ 300,00; tem frete grátis a partir da compra seguinte |
| **JWT / Bearer** | Token de autenticação assinado, enviado no cabeçalho `Authorization: Bearer <token>` |
| **E2E** | *End-to-end*: teste que percorre o fluxo pela interface, como o usuário |
| **VU** | *Virtual User* do k6: usuário simulado executando o script em paralelo |
| **p(95)** | Percentil 95: 95% das requisições respondem em tempo menor ou igual a esse valor |
| **Threshold** | Limite de aceite de uma métrica no k6; se violado, a execução falha |
| **Seed** | Carga automática dos dados de teste a cada inicialização da aplicação |

---

## 3. Contexto do teste

### 3.1 Projeto e subprocessos de teste

O projeto Loja PPP é um e-commerce de estudo com quatro funcionalidades (Login, Cadastro, Carrinho e Finalização de Compra). Este plano é um **plano de teste de projeto** que contempla os seguintes subprocessos (detalhados em 6.1):

1. Teste funcional de API
2. Teste funcional Web (E2E)
3. Teste de desempenho
4. Teste exploratório
5. Verificações de segurança básicas

### 3.2 Itens de teste

| ID | Item de teste | Versão | Identificação |
|---|---|---|---|
| IT-01 | API REST (`/api/*`) | 1.0.0 | Commit `f134da6`, branch `main` |
| IT-02 | Site Web (`public/`: `/`, `/login`, `/cadastro`, `/carrinho`, `/pedido`) | 1.0.0 | Commit `f134da6`, branch `main` |
| IT-03 | Especificação da API (Swagger) | 1.0.0 | `docs/swagger.yaml` |

### 3.3 Escopo do teste

#### 3.3.1 Funcionalidades dentro do escopo

| # | Funcionalidade | Web | API |
|---|---|---|---|
| F1 | **Cadastro** de cliente | `/cadastro` | `POST /api/auth/register` |
| F2 | **Login** (JWT, 2h) | `/login` | `POST /api/auth/login`, `GET /api/users/me` |
| F3 | **Vitrine / Produtos** | `/` | `GET /api/products`, `GET /api/products/{id}` |
| F4 | **Carrinho** (adicionar, alterar, remover, esvaziar) | `/`, `/carrinho` | `GET/POST/PATCH/DELETE /api/cart...` |
| F5 | **Finalização de compra** (prévia e efetivação) | `/carrinho` → `/pedido` | `GET /api/checkout/summary`, `POST /api/checkout` |
| F6 | **Contrato da API** (Swagger × implementação, códigos HTTP) | — | `/api-docs` |

#### 3.3.2 Requisitos e condições de teste

| ID | Requisito | Origem |
|---|---|---|
| **RN01** | Pagamento em dinheiro (`cash`) dá **10% de desconto sobre o subtotal**; o desconto **não incide sobre o frete**. `credit_card` não tem desconto. | [REF-06] Regra 1 |
| **RN02** | Produto só entra no carrinho se houver estoque; a **quantidade total no carrinho não pode exceder o estoque** (HTTP 422). O estoque é **revalidado e baixado** no checkout. | [REF-06] Regra 2 |
| **RN03** | Cliente não VIP paga **frete fixo de R$ 20,00**; VIP tem **frete grátis**. O cliente vira VIP quando o **total gasto ≥ R$ 300,00**; a compra que atinge o limite **ainda paga frete**. | [REF-06] Regra 3 |
| RF01 | Cadastro exige nome (≥ 2 caracteres), e-mail válido e único (409) e senha (≥ 6 caracteres). | [REF-08] `routes/auth.js` |
| RF02 | Login retorna token JWT Bearer válido por 2 horas; credenciais inválidas → 401. | [REF-06] |
| RF03 | Rotas de carrinho, checkout e `/users/me` exigem token (401 sem token ou com token inválido). | [REF-06] |
| RF04 | Quantidade deve ser um inteiro ≥ 1 (400). | [REF-08] `cartService.js` |
| RF05 | Checkout com carrinho vazio → 422; forma de pagamento inválida → 400. | [REF-06] |
| RF06 | Após o checkout, o carrinho é esvaziado e o total pago é somado ao `totalSpent` do cliente. | [REF-08] `checkoutService.js` |
| RNF01 | Erros retornam JSON `{ "error": "mensagem" }` com o código HTTP documentado. | [REF-06] Códigos de resposta |
| RNF02 | Desempenho conforme as metas de 6.4.2. | Definido neste plano |

#### 3.3.3 Fora do escopo

| Item excluído | Justificativa |
|---|---|
| Gateway de pagamento real | Não existe; o pagamento é apenas o campo `paymentMethod` |
| Persistência, backup e recuperação de dados | O banco é em memória por design |
| Compatibilidade com navegadores mobile nativos | Fora do objetivo do projeto; apenas verificação responsiva exploratória |
| Acessibilidade completa (WCAG 2.2) | Apenas verificações pontuais (rótulos e navegação por teclado) |
| Pentest completo | Apenas verificações básicas de segurança (ver 6.1) |
| Testes unitários | Responsabilidade do desenvolvimento; não há suíte unitária no projeto |

### 3.4 Premissas e restrições

**Premissas**
- A documentação ([REF-06], [REF-07]) representa o comportamento esperado; divergências entre código e documentação são tratadas como defeito até decisão do Product Owner.
- A aplicação é executada localmente com `npm start` na porta 3030.
- A massa de dados do *seed* é sempre a mesma a cada inicialização.

**Restrições**
- **Banco em memória:** reiniciar a aplicação apaga pedidos, cadastros e o estado VIP; os IDs de produtos mudam a cada inicialização.
- **Sem ambiente de homologação dedicado:** testes e performance rodam na máquina local ou no runner de CI, o que limita a representatividade dos números de desempenho.
- **Equipe de QA de uma pessoa:** a revisão por pares é substituída por autorrevisão com checklist.
- **Prazo:** uma sprint de 2 semanas (ver seção 9).
- A primeira instalação depende do download do binário do MongoDB (~100 MB).

### 3.5 Partes interessadas

| Parte interessada | Interesse no teste |
|---|---|
| Product Owner | Garantir que as regras de preço, frete e VIP estão corretas antes da entrega |
| Desenvolvimento | Receber defeitos bem descritos e reproduzíveis; ter suíte de regressão automatizada |
| Clientes finais (personas Ana, Bruno e Carla) | Cobrança correta, compra sem erros, dados protegidos |
| QA (autora) | Demonstrar cobertura, técnicas e automação no portfólio |
| Avaliadores / recrutadores | Avaliar a qualidade e a organização do trabalho de QA |

---

## 4. Comunicação do teste

| O quê | Para quem | Quando | Canal / formato |
|---|---|---|---|
| Plano de Testes (este documento) | PO, Desenvolvimento | Início da sprint e a cada nova versão | `docs/qa/01-plano-de-testes.md` |
| Registro de defeito | Desenvolvimento, PO | Ao encontrar o defeito | **Issue no GitHub** (labels `bug` + severidade) |
| Defeito Crítico | Desenvolvimento, PO | Imediatamente | Issue com label `critico` + menção direta |
| Status diário de execução | PO, Desenvolvimento | Diariamente | Resumo curto (planejados, executados, aprovados, reprovados, bloqueados) |
| Resultado das suítes automatizadas | Desenvolvimento | A cada *push* | GitHub Actions (relatórios do Cypress, Mocha e k6) |
| Relatório de conclusão do teste | PO, partes interessadas | Final da sprint | `docs/qa/08-relatorio-de-conclusao.md` |

**Gestão de defeitos**

- **Ciclo de vida:** `Novo → Em análise → Aberto → Em correção → Pronto para reteste → Fechado` (ou `Rejeitado` / `Reaberto`).
- **Conteúdo mínimo do registro (incidente):** identificador, título, item e versão, ambiente, pré-condições, passos, resultado esperado, resultado obtido, evidência (print, log, curl), severidade, prioridade e caso de teste relacionado.

| Severidade | Definição | Exemplo |
|---|---|---|
| **Crítica** | Perda financeira ou de dados, ou bloqueio do fluxo principal | Total cobrado errado; estoque inconsistente |
| **Alta** | Funcionalidade importante falha e o contorno é difícil | Erro 500 no fluxo de compra |
| **Média** | Falha com contorno simples ou fora do fluxo principal | Código HTTP diferente do documentado |
| **Baixa** | Problema cosmético, de texto ou de usabilidade | Linha "Desconto R$ 0,00" exibida no pagamento com cartão |

| Prioridade | Definição |
|---|---|
| **P1** | Corrigir imediatamente; bloqueia a entrega |
| **P2** | Corrigir nesta versão |
| **P3** | Backlog |

---

## 5. Registro de riscos

A priorização segue o teste baseado em risco [REF-02]. **Exposição = Probabilidade × Impacto** (escala 1 a 3 para cada um; resultado de 1 a 9). A exposição define a **prioridade de teste**: **Alta** (6 a 9), **Média** (3 a 4), **Baixa** (1 a 2).

### 5.1 Riscos de produto

| ID | Risco de produto | Característica ISO 25010 | P | I | Exp. | Prioridade de teste | Tratamento (mitigação pelo teste) |
|---|---|---|---|---|---|---|---|
| RP01 | Cálculo incorreto de desconto, frete ou total gera cobrança errada | Adequação funcional — correção | 2 | 3 | **6** | **Alta** | Tabela de decisão (6.3) em API e Web; verificação de arredondamento com o Mouse (R$ 89,90) |
| RP02 | Transição para VIP no momento errado (antes ou depois do limite de R$ 300,00) | Adequação funcional — correção | 2 | 3 | **6** | **Alta** | Valor-limite R$ 299,99 / R$ 300,00 e transição de estado com a persona Bruno |
| RP03 | Checkouts simultâneos (duplo clique, várias abas) causam dupla cobrança ou estoque inconsistente | Confiabilidade — tolerância a falhas; Adequação funcional — correção | 2 | 3 | **6** | **Alta** | Casos de concorrência na API e cenário k6 |
| RP04 | Carrinho aceita quantidade acima do estoque ou produto sem estoque | Adequação funcional — correção | 2 | 3 | **6** | **Alta** | Valor-limite de estoque (5/6 unidades do Mouse) e produto com estoque 0 |
| RP05 | Acesso às rotas protegidas sem token ou com token inválido | Segurança — autenticidade, confidencialidade | 1 | 3 | **3** | Média | Partição de equivalência de token (válido, ausente, malformado, outro segredo) |
| RP06 | Redirecionamento pós-login (`?voltar=`) leva para domínio externo (*open redirect*) | Segurança — integridade | 2 | 2 | **4** | Média | Teste exploratório de segurança com variações de URL |
| RP07 | Entradas inválidas (JSON malformado, tipos errados, corpo grande) geram erro 500 em vez de 4xx | Confiabilidade — maturidade; Segurança | 2 | 2 | **4** | Média | Partição de equivalência e testes negativos na API |
| RP08 | Swagger diverge da implementação (status, campos) | Interação — reconhecimento de adequação; Manutenibilidade | 2 | 2 | **4** | Média | Testes de contrato (status e corpo) |
| RP09 | Tempo de resposta alto no login e no checkout sob carga | Eficiência de desempenho — comportamento no tempo | 2 | 2 | **4** | Média | Cenários k6 PERF-02 e PERF-03 |
| RP10 | Mensagens de erro pouco claras ou validações inconsistentes na interface | Capacidade de interação — proteção contra erro do usuário | 2 | 1 | **2** | Baixa | Casos Web negativos e sessão exploratória |

### 5.2 Riscos de projeto

| ID | Risco de projeto | P | I | Exp. | Tratamento |
|---|---|---|---|---|---|
| RJ01 | Banco em memória reinicia e altera a massa entre execuções | 3 | 2 | **6** | Usuários criados dinamicamente (`qa+<timestamp>@email.com`); IDs obtidos em tempo de execução |
| RJ02 | Testes que mudam o status VIP das personas interferem em outros testes | 3 | 2 | **6** | Personas usadas apenas para leitura ou em ambiente recém-iniciado; checkout com usuários novos |
| RJ03 | Equipe de uma pessoa: indisponibilidade atrasa a sprint | 2 | 2 | **4** | Priorizar casos de risco Alto; automação cobre a regressão |
| RJ04 | Falha no download do binário do MongoDB no CI | 1 | 2 | **2** | Cache do binário; `npm install` antes da janela de testes |
| RJ05 | Ambiente local não representa produção nos testes de desempenho | 3 | 1 | **3** | Resultados de performance tratados como linha de base comparativa, não como capacidade de produção |

---

## 6. Estratégia de teste

### 6.1 Subprocessos de teste

| Subprocesso | Objetivo | Itens | Abordagem | Ferramentas | Característica ISO 25010 |
|---|---|---|---|---|---|
| **Teste funcional de API** | Validar contrato, códigos HTTP, regras de negócio e mensagens de erro | IT-01, IT-03 | Manual + **automatizado** (≥ 3 casos) | Postman, curl, **Mocha + Chai + Supertest** | Adequação funcional (completude, correção, adequação) |
| **Teste funcional Web (E2E)** | Validar os fluxos do usuário no navegador | IT-02 | Manual + **automatizado** (≥ 3 casos) | **Cypress** | Adequação funcional; Capacidade de interação |
| **Teste de desempenho** | Medir tempo de resposta e taxa de erro sob carga | IT-01 | Automatizado (≥ 3 cenários) | **k6** | Eficiência de desempenho (comportamento no tempo, capacidade) |
| **Teste exploratório** | Encontrar defeitos fora do roteiro | IT-01, IT-02 | Sessões de 60 min com *charter* por funcionalidade | Navegador, DevTools | Adequação funcional; Capacidade de interação; Confiabilidade |
| **Segurança básica** | Autenticação, token, redirecionamento, entradas inválidas | IT-01, IT-02 | Manual | curl, DevTools | Segurança (confidencialidade, integridade, autenticidade) |
| **Regressão** | Detectar efeitos colaterais de mudanças | IT-01, IT-02 | Reexecução das suítes automatizadas | Cypress, Mocha, k6 | Todas as acima |

**Características da ISO/IEC 25010 fora do escopo:** Compatibilidade, Manutenibilidade (exceto o contrato da API), Flexibilidade e Proteção (*safety*) — não são relevantes para o objetivo deste projeto de estudo.

### 6.2 Entregáveis do teste

| # | Entregável | Local |
|---|---|---|
| 1 | Plano de Testes (este documento) | `docs/qa/01-plano-de-testes.md` |
| 2 | Especificação de casos de teste Web | `docs/qa/02-casos-de-teste-web.md` |
| 3 | Especificação de casos de teste API | `docs/qa/03-casos-de-teste-api.md` |
| 4 | Relatórios de incidente (report de bugs) | `docs/qa/04-report-de-bugs.md` + Issues no GitHub |
| 5 | Scripts de teste Web — Cypress | `cypress/e2e/` + `docs/qa/05-automacao-web-cypress.md` |
| 6 | Scripts de teste API — JavaScript | `test/api/` + `docs/qa/06-automacao-api.md` |
| 7 | Scripts e resultados de desempenho — k6 | `performance/` + `docs/qa/07-performance-k6.md` |
| 8 | Relatório de conclusão do teste | `docs/qa/08-relatorio-de-conclusao.md` |

### 6.3 Técnicas de projeto de teste

Técnicas conforme a ISO/IEC/IEEE 29119-4 [REF-04]:

| Técnica (29119-4) | Aplicação | Riscos cobertos |
|---|---|---|
| Teste de tabela de decisão | Combinação VIP × forma de pagamento → desconto, frete e total | RP01 |
| Análise de valor-limite | Nome, senha, quantidade, estoque e limite VIP | RP02, RP04 |
| Particionamento de equivalência | E-mail, `paymentMethod`, token, tipos de quantidade | RP05, RP07 |
| Teste de transição de estado | Status do cliente: Não VIP → VIP | RP02 |
| Teste de cenário | Jornadas completas: cadastro → login → carrinho → checkout → pedido | RP01, RP03 |
| Suposição de erro (*error guessing*) | Concorrência, payloads grandes, variações de URL em `?voltar=` | RP03, RP06, RP07 |

**a) Tabela de decisão — cálculo do total (RN01 + RN03)**

| Regra | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| Cliente é VIP? | Não | Não | Sim | Sim |
| Pagamento em dinheiro? | Sim | Não | Sim | Não |
| **Desconto** | 10% do subtotal | 0 | 10% do subtotal | 0 |
| **Frete** | R$ 20,00 | R$ 20,00 | R$ 0,00 | R$ 0,00 |
| Exemplo (1 Teclado, R$ 250,00) | **R$ 245,00** (Ana) | **R$ 270,00** (Ana) | **R$ 225,00** (Carla) | **R$ 250,00** (Carla) |

**b) Análise de valor-limite**

| Campo / regra | Inválido | Limite válido | Válido |
|---|---|---|---|
| Nome (cadastro) | 1 caractere | 2 caracteres | 10 caracteres |
| Senha (cadastro) | 5 caracteres | 6 caracteres | 12 caracteres |
| Quantidade no carrinho | 0, -1, 1.5 | 1 e igual ao estoque (Mouse: 5) | 2 |
| Quantidade acima do estoque | estoque + 1 (Mouse: 6) | — | — |
| Total gasto para VIP | R$ 299,99 (não vira VIP) | **R$ 300,00** (vira VIP) | R$ 450,00 |

**c) Particionamento de equivalência**

| Entrada | Classes válidas | Classes inválidas |
|---|---|---|
| E-mail | formato válido; maiúsculas (normalizado para minúsculas) | sem `@`; sem domínio; já cadastrado |
| `paymentMethod` | `cash`; `credit_card` | ausente; valor desconhecido; tipo não texto |
| Token | válido | ausente; sem `Bearer`; malformado; assinado com outro segredo; expirado |
| Quantidade | inteiro ≥ 1 | 0; negativo; decimal; texto; booleano |

**d) Transição de estado — status VIP**

```
[Não VIP] --compra que faz totalSpent >= 300--> [VIP]  (essa compra ainda paga frete; becameVip = true)
[Não VIP] --compra que mantém totalSpent < 300-> [Não VIP]
[VIP]     --qualquer compra-------------------> [VIP]  (frete grátis)
```

### 6.4 Critérios de conclusão do teste

#### 6.4.1 Critérios funcionais

- 100% dos casos de **prioridade Alta** (riscos RP01 a RP04) executados; ≥ 95% do total de casos executados.
- **Nenhum defeito Crítico ou Alto aberto** sem plano de correção aprovado pelo PO.
- Cobertura de 100% dos requisitos da seção 3.3.2 por pelo menos um caso de teste (matriz de rastreabilidade, Anexo A).
- Suítes automatizadas (Cypress, API e k6) aprovadas na última execução de regressão.

#### 6.4.2 Critérios de desempenho (k6)

| Cenário | Carga | Thresholds de aceite |
|---|---|---|
| **PERF-01 — Smoke** de endpoints públicos (`/products`, `/health`) | 1 VU, 30 s | `http_req_failed < 1%`, `p(95) < 300 ms` |
| **PERF-02 — Carga** no login | Rampa até 20 VUs, ~1 min | `http_req_failed < 1%`, `p(95) < 800 ms` (bcrypt é custoso por design) |
| **PERF-03 — Jornada de compra** (login → carrinho → resumo → checkout) | 10 VUs, ~1 min | `http_req_failed < 1%`, `p(95) < 1000 ms`, `checks > 99%` |

### 6.5 Métricas a coletar

| Métrica | Fórmula / origem | Uso |
|---|---|---|
| Progresso de execução | Executados ÷ planejados | Status diário |
| Taxa de aprovação | Aprovados ÷ executados | Qualidade do item |
| Casos bloqueados | Contagem | Impedimentos |
| Defeitos por severidade e funcionalidade | Issues no GitHub | Priorização e análise de risco residual |
| Cobertura de requisitos | Requisitos com ≥ 1 caso ÷ total | Critério de conclusão |
| Taxa de sucesso da automação | Execuções aprovadas ÷ execuções | Estabilidade da regressão |
| Métricas k6 | `http_req_duration` (p90/p95), `http_req_failed`, `checks`, `iterations` | Critérios de desempenho |

### 6.6 Requisitos de dados de teste

Massa carregada pelo *seed* a cada inicialização:

| Persona | E-mail / senha | Total gasto | VIP | Uso nos testes |
|---|---|---|---|---|
| Ana Silva | `ana@email.com` / `123456` | R$ 0,00 | Não | Cliente novo, paga frete (R1, R2) |
| Bruno Souza | `bruno@email.com` / `123456` | R$ 280,00 | Não | Transição para VIP (faltam R$ 20,00) |
| Carla Lima | `carla@email.com` / `123456` | R$ 450,00 | Sim | Frete grátis (R3, R4) |

| Produto | Preço | Estoque | Uso nos testes |
|---|---|---|---|
| Teclado Mecânico | R$ 250,00 | 10 | Fluxo feliz |
| Mouse Sem Fio | R$ 89,90 | 5 | Valor-limite de estoque, arredondamento |
| Monitor 24" Full HD | R$ 899,00 | 0 | Produto sem estoque |

**Regras de uso da massa**
- Testes que **alteram estado** (checkout, VIP, estoque) rodam em ambiente recém-iniciado **ou** com usuários criados dinamicamente (`qa+<timestamp>@email.com`).
- Testes automatizados **não usam IDs fixos**: o ID dos produtos é obtido via `GET /api/products`.
- Testes de desempenho criam seus usuários no `setup()` do k6 para não alterar as personas.
- Nenhum dado pessoal real é usado; todos os dados são fictícios.

### 6.7 Requisitos de ambiente de teste

| Item | Requisito |
|---|---|
| Sistema operacional | Linux, Windows ou macOS |
| Runtime | Node.js ≥ 18 (executado com Node 22) |
| Aplicação | `npm install && npm start` → http://localhost:3030 |
| Banco | MongoDB em memória (`mongodb-memory-server`); reiniciar restaura o estado inicial |
| Navegador | Chrome/Chromium estável; Electron (padrão do Cypress) |
| Ferramentas | Cypress 13+, Mocha + Chai + Supertest, k6, Postman, Git/GitHub |
| CI | GitHub Actions executando as três suítes a cada *push* |
| Verificação de prontidão (*smoke*) | `GET /api/health` → `{"status":"ok"}`; Swagger em `/api-docs`; login da persona Ana |

### 6.8 Reteste e teste de regressão

- **Reteste:** todo defeito corrigido é reexecutado com o **mesmo caso de teste e os mesmos dados** que o revelaram. Se passar, a Issue é fechada; se falhar, é **reaberta** com nova evidência.
- **Regressão:**
  - A cada *push*: suítes automatizadas de API e Web (execução no CI).
  - A cada correção de defeito Crítico ou Alto: suíte automatizada + casos manuais de prioridade Alta da funcionalidade afetada.
  - Antes do relatório de conclusão: suíte completa (manual de prioridade Alta + automatizada + k6).
- **Seleção da regressão manual:** pela exposição ao risco (seção 5.1); casos ligados a riscos de exposição ≥ 6 sempre entram.

### 6.9 Critérios de suspensão e retomada

| Suspender quando | Retomar quando |
|---|---|
| A aplicação não sobe ou `/api/health` falha | Aplicação estável e *smoke test* aprovado |
| O login está quebrado (bloqueia ~80% dos casos) | Correção entregue e reteste do login aprovado |
| O *seed* não carrega a massa de dados | Massa carregada e verificada |
| Mais de 30% dos casos de uma funcionalidade bloqueados por um mesmo defeito | Defeito bloqueante corrigido |

Na retomada, executa-se primeiro o *smoke test*: health → login → listar produtos → adicionar ao carrinho → checkout.

### 6.10 Desvios da estratégia de teste organizacional

Não há estratégia de teste organizacional formal para este projeto (projeto de portfólio individual). Este plano assume as práticas da ISO/IEC/IEEE 29119-2 como estratégia de referência, com os seguintes desvios **intencionais**:

| Desvio | Justificativa |
|---|---|
| Revisão por pares substituída por autorrevisão com checklist | Equipe de QA de uma pessoa |
| Sem ambiente de homologação; testes em ambiente local/CI | Restrição de infraestrutura (seção 3.4) |
| Testes de desempenho tratados como linha de base, não como capacidade de produção | Ambiente não representativo (RJ05) |
| Sem testes unitários no escopo do QA | Fora do objetivo do portfólio |

---

## 7. Atividades de teste e estimativas

| # | Atividade (29119-2) | Esforço estimado | Saída |
|---|---|---|---|
| 1 | Planejamento do teste | 1 dia | Plano de Testes |
| 2 | Análise e projeto: casos Web | 1 dia | Especificação de casos Web |
| 3 | Análise e projeto: casos API | 1 dia | Especificação de casos API |
| 4 | Preparação do ambiente e dos dados | 0,5 dia | Ambiente pronto, *smoke* aprovado |
| 5 | Execução manual + sessões exploratórias | 2 dias | Resultados e evidências |
| 6 | Registro e acompanhamento de incidentes | contínuo (~0,5 dia) | Report de bugs + Issues |
| 7 | Implementação da automação Web (Cypress) | 1,5 dia | Suíte `cypress/` |
| 8 | Implementação da automação API (JavaScript) | 1,5 dia | Suíte `test/api/` |
| 9 | Implementação e execução de desempenho (k6) | 1 dia | Scripts `performance/` e resultados |
| 10 | Reteste e regressão | 0,5 dia | Resultados de regressão |
| 11 | Conclusão do teste | 0,5 dia | Relatório de conclusão |
| | **Total** | **≈ 10 dias úteis** | |

---

## 8. Equipe

### 8.1 Papéis, atividades e responsabilidades

| Papel | Responsável | Atividades | Responsabilidades |
|---|---|---|---|
| Gerente de teste / QA | Lilyan Lacerda | 1, 6, 10, 11 | Planejar, monitorar, comunicar e encerrar o teste |
| Analista / Engenheira de testes | Lilyan Lacerda | 2 a 5, 7 a 9 | Projetar, executar, automatizar e reportar |
| Desenvolvimento | Time do projeto | — | Corrigir defeitos e apoiar a análise de causa |
| Product Owner | Time do projeto | — | Priorizar defeitos, aprovar o plano e os critérios de conclusão |

### 8.2 Necessidades de contratação

Nenhuma. O escopo é compatível com uma pessoa de QA em uma sprint.

### 8.3 Necessidades de treinamento

| Tema | Necessário para | Forma |
|---|---|---|
| Regras de negócio da Loja PPP (desconto, estoque, VIP) | Todas as atividades | Leitura do README e do código (`pricing.js`) |
| Cypress (seletores, `cy.intercept`, comandos customizados) | Atividade 7 | Documentação oficial |
| Mocha + Chai + Supertest | Atividade 8 | Documentação oficial |
| k6 (cenários, thresholds, `setup()`) | Atividade 9 | Documentação oficial |
| ISO/IEC/IEEE 29119-3 (documentação de teste) | Atividades 1 a 3 e 11 | Leitura da norma |

---

## 9. Cronograma

Sprint de 2 semanas (10 dias úteis):

| Semana | Dias | Atividades | Marco |
|---|---|---|---|
| 1 | D1 | Planejamento | ✅ Plano aprovado |
| 1 | D2–D3 | Projeto dos casos Web e API | ✅ Casos revisados |
| 1 | D3–D5 | Preparação do ambiente, execução manual e exploratória, registro de incidentes | ✅ Primeira rodada executada |
| 2 | D6–D8 | Automação Web, API e desempenho | ✅ Suítes no CI |
| 2 | D9 | Reteste e regressão | ✅ Critérios de conclusão verificados |
| 2 | D10 | Relatório de conclusão | ✅ Teste encerrado |

---

## Anexo A — Matriz de rastreabilidade (requisito × caso de teste)

Os IDs serão detalhados nas especificações de casos de teste (entregáveis 2 e 3).

| Requisito | Risco | Casos Web | Casos API | Desempenho |
|---|---|---|---|---|
| RF01 Cadastro | RP07, RP10 | CT-WEB-CAD-* | CT-API-AUTH-* (register) | — |
| RF02 Login | RP05, RP09 | CT-WEB-LOG-* | CT-API-AUTH-* (login) | PERF-02 |
| RF03 Autenticação | RP05, RP06 | CT-WEB-LOG-* (rota protegida) | CT-API-USR-*, CT-API-SEC-* | — |
| F3 Produtos | RP08 | CT-WEB-PRD-* | CT-API-PRD-* | PERF-01 |
| RN02 / RF04 Estoque e quantidade | RP04, RP07 | CT-WEB-CAR-* | CT-API-CAR-* | — |
| RN01 Desconto em dinheiro | RP01 | CT-WEB-CHK-* | CT-API-CHK-* | PERF-03 |
| RN03 Frete / VIP | RP01, RP02 | CT-WEB-CHK-* | CT-API-CHK-* | PERF-03 |
| RF05 / RF06 Checkout | RP03 | CT-WEB-CHK-* | CT-API-CHK-* | PERF-03 |
| RNF01 Formato de erro | RP07, RP08 | — | CT-API-* (negativos) | — |
| RNF02 Desempenho | RP09 | — | — | PERF-01, PERF-02, PERF-03 |

## Anexo B — Conformidade com a ISO/IEC/IEEE 29119-3 (Test Plan)

| Seção exigida pela norma | Seção deste documento |
|---|---|
| Overview: unique identification, issuing organization, approval authority, change history | 1.1, 1.2, 1.3, 1.4 |
| Introduction: scope, references, glossary | 2.1, 2.2, 2.3 |
| Context of the testing: projects/test sub-processes, test items, test scope, assumptions and constraints, stakeholders | 3.1, 3.2, 3.3, 3.4, 3.5 |
| Testing communication | 4 |
| Risk register: product risks, project risks | 5.1, 5.2 |
| Test strategy: test sub-processes, deliverables, design techniques, completion criteria, metrics, test data requirements, test environment requirements, retesting and regression testing, suspension and resumption criteria, deviations from the organizational test strategy | 6.1 a 6.10 |
| Testing activities and estimates | 7 |
| Staffing: roles/activities/responsibilities, hiring needs, training needs | 8.1, 8.2, 8.3 |
| Schedule | 9 |
