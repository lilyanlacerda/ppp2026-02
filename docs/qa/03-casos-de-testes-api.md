# 🔌 Casos de Teste API — Loja PPP

> Documento estruturado conforme a **ISO/IEC/IEEE 29119-3:2021**: *Test Design Specification* (seção 2) e *Test Case Specification* (seção 3). Os casos derivam do [Plano de Testes](01-plano-de-testes.md) (`PT-LOJAPPP-001`) e do contrato [docs/swagger.yaml](../swagger.yaml).

⬅️ [Índice da documentação de QA](README.md)

---

## 1. Visão geral

### 1.1 Identificação do documento

| Item | Valor |
|---|---|
| **Identificador** | `ECT-LOJAPPP-API-001` |
| **Título** | Especificação de Projeto e Casos de Teste API — Loja PPP |
| **Versão** | 1.0 |
| **Data** | 26/11/2026 |
| **Status** | Em revisão |
| **Autora** | Lilyan Lacerda (QA) |
| **Aprovador** | Product Owner do projeto |
| **Itens de teste** | IT-01 — API REST (`/api/*`) e IT-03 — Especificação Swagger, versão 1.0.0, commit `f134da6` |

### 1.2 Histórico de alterações

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.0 | 26/11/2026 | Lilyan Lacerda | Versão inicial: 7 conjuntos de funcionalidades, 34 condições de teste e 66 casos de teste |

### 1.3 Referências

| ID | Referência |
|---|---|
| [REF-01] | [Plano de Testes `PT-LOJAPPP-001`](01-plano-de-testes.md): requisitos (3.3.2), riscos (5), técnicas (6.3) e dados (6.6) |
| [REF-02] | [docs/swagger.yaml](../swagger.yaml): contrato OpenAPI 3 (rotas, corpos e códigos de resposta) |
| [REF-03] | [Documentação da aplicação](../aplicacao.md): regras de negócio e tabela de códigos de resposta |
| [REF-04] | RFC 6750 (*Bearer Token Usage*) e RFC 9110 (*HTTP Semantics*) |
| [REF-05] | ISO/IEC/IEEE 29119-3:2021 e 29119-4:2021 |

### 1.4 Ambiente, variáveis e pré-condições gerais

Válidas para **todos** os casos, salvo indicação contrária:

- Aplicação iniciada com `npm start`. Testes que alteram estado (checkout, VIP, estoque) partem de uma aplicação **recém-iniciada** ou usam clientes novos.
- Cabeçalho `Content-Type: application/json` em todas as requisições com corpo.
- Todas as respostas de erro seguem o formato `{ "error": "<mensagem>" }` (RNF01).

| Variável | Valor / como obter |
|---|---|
| `{{baseUrl}}` | `http://localhost:3030/api` |
| `{{tokenAna}}`, `{{tokenBruno}}`, `{{tokenCarla}}` | Campo `token` de `POST /auth/login` com a persona (senha `123456`) |
| `{{tokenNovo}}` | Token de um cliente criado no próprio caso com e-mail `qa.api+<timestamp>@email.com` |
| `{{tecladoId}}`, `{{mouseId}}`, `{{monitorId}}` | Campo `id` de `GET /products` (os IDs **mudam a cada inicialização**) |
| `{{idInexistente}}` | `000000000000000000000000` (ObjectId válido que não existe) |

---

## 2. Especificação de projeto de teste

### 2.1 Conjuntos de funcionalidades

| ID | Conjunto | Endpoints | Requisitos | Riscos |
|---|---|---|---|---|
| FS-API-01 | Cadastro e login | `POST /auth/register`, `POST /auth/login` | RF01, RF02 | RP05, RP07 |
| FS-API-02 | Dados do cliente | `GET /users/me` | RF03 | RP05 |
| FS-API-03 | Segurança e autenticação | Todas as rotas protegidas | RF03 | RP05, RP07 |
| FS-API-04 | Produtos | `GET /products`, `GET /products/{id}` | F3 | RP08 |
| FS-API-05 | Carrinho | `GET/DELETE /cart`, `POST /cart/items`, `PATCH/DELETE /cart/items/{productId}` | RN02, RF04 | RP04, RP07 |
| FS-API-06 | Finalização de compra | `GET /checkout/summary`, `POST /checkout` | RN01, RN02, RN03, RF05, RF06 | RP01, RP02, RP03 |
| FS-API-07 | Geral e contrato | `GET /health`, rotas inexistentes, `/api-docs` | RNF01 | RP07, RP08 |

### 2.2 Condições de teste

| ID | Condição de teste | Conjunto | Origem | Técnica (29119-4) | Prioridade |
|---|---|---|---|---|---|
| TCOND-API-01 | Cadastro válido cria o cliente e não devolve a senha | FS-API-01 | RF01 | Teste de cenário | Alta |
| TCOND-API-02 | E-mail é único, sem diferenciar maiúsculas | FS-API-01 | RF01 | Particionamento de equivalência | Alta |
| TCOND-API-03 | Nome com no mínimo 2 caracteres | FS-API-01 | RF01 | Análise de valor-limite | Média |
| TCOND-API-04 | Senha com no mínimo 6 caracteres | FS-API-01 | RF01 | Análise de valor-limite | Média |
| TCOND-API-05 | E-mail em formato válido | FS-API-01 | RF01 | Particionamento de equivalência | Média |
| TCOND-API-06 | Corpo ausente, tipos errados ou valores em branco são recusados | FS-API-01 | RF01, RP07 | Particionamento de equivalência; Suposição de erro | Baixa |
| TCOND-API-07 | Login válido devolve um token JWT com validade de 2 horas | FS-API-01 | RF02 | Teste de cenário | Alta |
| TCOND-API-08 | Login inválido é recusado sem revelar qual campo errou | FS-API-01 | RF02, RP05 | Particionamento de equivalência | Alta |
| TCOND-API-09 | Login exige e-mail e senha | FS-API-01 | RF02 | Particionamento de equivalência | Média |
| TCOND-API-10 | E-mail no login é normalizado (maiúsculas e espaços) | FS-API-01 | RF02 | Particionamento de equivalência | Baixa |
| TCOND-API-11 | `/users/me` devolve os dados do cliente do token | FS-API-02 | RF03 | Teste de cenário | Alta |
| TCOND-API-12 | Rotas protegidas recusam requisição sem token | FS-API-03 | RF03 | Particionamento de equivalência | Alta |
| TCOND-API-13 | Rotas protegidas recusam token inválido, adulterado ou expirado | FS-API-03 | RF03, RP05 | Particionamento de equivalência | Alta |
| TCOND-API-14 | Esquema de autenticação `Bearer` é validado conforme a RFC 6750 | FS-API-03 | RF03, [REF-04] | Particionamento de equivalência | Baixa |
| TCOND-API-15 | Um cliente não acessa o carrinho de outro | FS-API-03 | RF03, RP05 | Suposição de erro | Alta |
| TCOND-API-16 | Nenhuma resposta expõe senha ou hash | FS-API-03 | RP05 | Suposição de erro | Média |
| TCOND-API-17 | Corpo grande demais é recusado com 4xx | FS-API-03 | RNF01, RP07 | Suposição de erro | Média |
| TCOND-API-18 | Lista e detalhe de produtos seguem o contrato | FS-API-04 | F3, RP08 | Teste de cenário | Média |
| TCOND-API-19 | Id de produto inválido ou inexistente é tratado | FS-API-04 | F3 | Particionamento de equivalência | Média |
| TCOND-API-20 | Adição ao carrinho cria ou acumula itens | FS-API-05 | RN02 | Teste de cenário | Alta |
| TCOND-API-21 | Quantidade total no carrinho não passa do estoque | FS-API-05 | RN02 | Análise de valor-limite | Alta |
| TCOND-API-22 | Produto sem estoque não entra no carrinho | FS-API-05 | RN02 | Particionamento de equivalência | Alta |
| TCOND-API-23 | Quantidade precisa ser um inteiro ≥ 1 | FS-API-05 | RF04 | Particionamento de equivalência; Valor-limite | Média |
| TCOND-API-24 | Alteração, remoção e esvaziamento do carrinho | FS-API-05 | F4 | Teste de cenário | Média |
| TCOND-API-25 | Total = subtotal − desconto + frete para cada combinação VIP × pagamento | FS-API-06 | RN01, RN03 | Teste de tabela de decisão | Alta |
| TCOND-API-26 | A prévia não altera o estado | FS-API-06 | RN02 | Teste de cenário | Média |
| TCOND-API-27 | Forma de pagamento inválida é recusada | FS-API-06 | RF05 | Particionamento de equivalência | Alta |
| TCOND-API-28 | Checkout com carrinho vazio é recusado | FS-API-06 | RF05 | Particionamento de equivalência | Alta |
| TCOND-API-29 | Checkout baixa o estoque, registra o pedido, esvazia o carrinho e soma o total gasto | FS-API-06 | RF06, RN02 | Teste de cenário | Alta |
| TCOND-API-30 | Cliente vira VIP na compra que atinge R$ 300,00 e essa compra ainda paga frete | FS-API-06 | RN03 | Transição de estado; Valor-limite | Alta |
| TCOND-API-31 | Valores com centavos e vários itens são arredondados corretamente | FS-API-06 | RN01 | Análise de valor-limite | Média |
| TCOND-API-32 | Estoque é revalidado no checkout | FS-API-06 | RN02 | Suposição de erro | Alta |
| TCOND-API-33 | Checkouts simultâneos do mesmo carrinho geram um único pedido | FS-API-06 | RP03 | Suposição de erro | Alta |
| TCOND-API-34 | Respostas gerais (health, rota inexistente, JSON malformado, Swagger) seguem o contrato | FS-API-07 | RNF01, RP08 | Particionamento de equivalência | Baixa |

> **Limitação conhecida (TCOND-API-30):** com os produtos e preços do *seed* não é possível chegar a um total gasto de **exatamente** R$ 300,00 ou R$ 299,99 por compras via API. O limite é verificado com a persona Bruno (R$ 280,00 → R$ 389,90). A verificação do valor exato fica recomendada como teste unitário da função `isVipBySpending` (`src/services/pricing.js`), fora do escopo do QA (Plano, 3.3.3).

---

## 3. Especificação de casos de teste

### 3.1 Resumo

Legenda: 🤖 = selecionado para automação em JavaScript ([doc 06](06-automacao-api.md)). Status: ⏳ Não executado (os resultados são registrados no [Report de Bugs](04-report-de-bugs.md) e no [Relatório de Conclusão](08-relatorio-de-conclusao.md)).

| ID | Título | Condição | Prioridade | Execução |
|---|---|---|---|---|
| CT-API-AUTH-01 | Cadastrar cliente com dados válidos | TCOND-API-01 | Alta | ⏳ |
| CT-API-AUTH-02 | Recusar e-mail já cadastrado, mesmo em maiúsculas | TCOND-API-02 | Alta | ⏳ |
| CT-API-AUTH-03 | Recusar nome com 1 caractere | TCOND-API-03 | Média | ⏳ |
| CT-API-AUTH-04 | Aceitar nome com 2 caracteres | TCOND-API-03 | Média | ⏳ |
| CT-API-AUTH-05 | Recusar senha com 5 caracteres | TCOND-API-04 | Média | ⏳ |
| CT-API-AUTH-06 | Aceitar senha com 6 caracteres | TCOND-API-04 | Média | ⏳ |
| CT-API-AUTH-07 | Recusar e-mails em formato inválido | TCOND-API-05 | Média | ⏳ |
| CT-API-AUTH-08 | Recusar cadastro sem corpo | TCOND-API-06 | Baixa | ⏳ |
| CT-API-AUTH-09 | Recusar cadastro com tipos de dado errados | TCOND-API-06 | Baixa | ⏳ |
| CT-API-AUTH-10 | Recusar senha formada só por espaços | TCOND-API-06 | Baixa | ⏳ |
| CT-API-AUTH-11 🤖 | Fazer login com credenciais válidas | TCOND-API-07 | Alta | ⏳ |
| CT-API-AUTH-12 | Recusar login com senha incorreta | TCOND-API-08 | Alta | ⏳ |
| CT-API-AUTH-13 | Recusar login de e-mail não cadastrado com a mesma mensagem | TCOND-API-08 | Média | ⏳ |
| CT-API-AUTH-14 | Recusar login sem e-mail ou sem senha | TCOND-API-09 | Média | ⏳ |
| CT-API-AUTH-15 | Aceitar login com e-mail em maiúsculas e com espaços | TCOND-API-10 | Baixa | ⏳ |
| CT-API-USR-01 | Consultar os dados do cliente autenticado | TCOND-API-11 | Alta | ⏳ |
| CT-API-SEC-01 | Recusar rotas protegidas sem token | TCOND-API-12 | Alta | ⏳ |
| CT-API-SEC-02 | Recusar token malformado | TCOND-API-13 | Alta | ⏳ |
| CT-API-SEC-03 | Recusar token assinado com outro segredo | TCOND-API-13 | Alta | ⏳ |
| CT-API-SEC-04 | Recusar token expirado | TCOND-API-13 | Média | ⏳ |
| CT-API-SEC-05 | Recusar esquema de autenticação diferente de Bearer | TCOND-API-14 | Média | ⏳ |
| CT-API-SEC-06 | Aceitar o esquema `bearer` em minúsculas | TCOND-API-14 | Baixa | ⏳ |
| CT-API-SEC-07 | Isolar o carrinho de cada cliente | TCOND-API-15 | Alta | ⏳ |
| CT-API-SEC-08 | Não expor senha nem hash nas respostas | TCOND-API-16 | Média | ⏳ |
| CT-API-SEC-09 | Recusar corpo de requisição grande demais com 413 | TCOND-API-17 | Média | ⏳ |
| CT-API-PRD-01 | Listar produtos | TCOND-API-18 | Média | ⏳ |
| CT-API-PRD-02 | Detalhar produto existente | TCOND-API-18 | Média | ⏳ |
| CT-API-PRD-03 | Recusar id de produto em formato inválido | TCOND-API-19 | Média | ⏳ |
| CT-API-PRD-04 | Informar produto inexistente | TCOND-API-19 | Média | ⏳ |
| CT-API-CAR-01 | Consultar carrinho vazio de cliente novo | TCOND-API-24 | Média | ⏳ |
| CT-API-CAR-02 | Adicionar produto ao carrinho | TCOND-API-20 | Alta | ⏳ |
| CT-API-CAR-03 | Acumular a quantidade ao adicionar o mesmo produto | TCOND-API-20 | Alta | ⏳ |
| CT-API-CAR-04 🤖 | Recusar adição que faz o carrinho passar do estoque | TCOND-API-21 | Alta | ⏳ |
| CT-API-CAR-05 | Aceitar quantidade igual ao estoque | TCOND-API-21 | Alta | ⏳ |
| CT-API-CAR-06 | Recusar produto sem estoque | TCOND-API-22 | Alta | ⏳ |
| CT-API-CAR-07 | Recusar quantidades inválidas | TCOND-API-23 | Média | ⏳ |
| CT-API-CAR-08 | Recusar quantidade que não é número inteiro (booleano e texto) | TCOND-API-23 | Baixa | ⏳ |
| CT-API-CAR-09 | Usar quantidade 1 quando ela não é informada | TCOND-API-23 | Baixa | ⏳ |
| CT-API-CAR-10 | Recusar productId inválido ou inexistente | TCOND-API-19 | Média | ⏳ |
| CT-API-CAR-11 | Alterar a quantidade de um item | TCOND-API-24 | Média | ⏳ |
| CT-API-CAR-12 | Recusar alteração para quantidade acima do estoque | TCOND-API-21 | Alta | ⏳ |
| CT-API-CAR-13 | Recusar alteração de produto que não está no carrinho | TCOND-API-24 | Média | ⏳ |
| CT-API-CAR-14 | Recusar alteração para quantidade zero | TCOND-API-23 | Média | ⏳ |
| CT-API-CAR-15 | Remover item do carrinho | TCOND-API-24 | Média | ⏳ |
| CT-API-CAR-16 | Informar remoção de produto que não está no carrinho | TCOND-API-24 | Baixa | ⏳ |
| CT-API-CAR-17 | Esvaziar o carrinho | TCOND-API-24 | Média | ⏳ |
| CT-API-CHK-01 | Calcular prévia de não VIP pagando com cartão | TCOND-API-25 | Alta | ⏳ |
| CT-API-CHK-02 🤖 | Finalizar compra de não VIP em dinheiro com desconto | TCOND-API-25, 29 | Alta | ⏳ |
| CT-API-CHK-03 | Calcular prévia de VIP pagando com cartão | TCOND-API-25 | Alta | ⏳ |
| CT-API-CHK-04 | Calcular prévia de VIP pagando em dinheiro | TCOND-API-25 | Alta | ⏳ |
| CT-API-CHK-05 | Não alterar o estado ao consultar a prévia | TCOND-API-26 | Média | ⏳ |
| CT-API-CHK-06 | Recusar prévia sem forma de pagamento válida | TCOND-API-27 | Média | ⏳ |
| CT-API-CHK-07 | Recusar checkout com forma de pagamento inválida | TCOND-API-27 | Alta | ⏳ |
| CT-API-CHK-08 | Recusar checkout com carrinho vazio | TCOND-API-28 | Alta | ⏳ |
| CT-API-CHK-09 | Baixar o estoque após o checkout | TCOND-API-29 | Alta | ⏳ |
| CT-API-CHK-10 | Tornar o cliente VIP na compra que atinge R$ 300,00 | TCOND-API-30 | Alta | ⏳ |
| CT-API-CHK-11 | Registrar compra de cliente que já era VIP | TCOND-API-30 | Média | ⏳ |
| CT-API-CHK-12 | Arredondar o desconto de produto com centavos | TCOND-API-31 | Média | ⏳ |
| CT-API-CHK-13 | Calcular compra com vários itens | TCOND-API-31 | Média | ⏳ |
| CT-API-CHK-14 | Recusar checkout quando o estoque acabou depois da adição | TCOND-API-32 | Alta | ⏳ |
| CT-API-CHK-15 | Gerar um único pedido com checkouts simultâneos | TCOND-API-33 | Alta | ⏳ |
| CT-API-CHK-16 | Não cobrar frete na prévia de carrinho vazio | TCOND-API-26 | Baixa | ⏳ |
| CT-API-GEN-01 | Verificar o health check | TCOND-API-34 | Baixa | ⏳ |
| CT-API-GEN-02 | Responder rota inexistente com 404 em JSON | TCOND-API-34 | Baixa | ⏳ |
| CT-API-GEN-03 | Recusar JSON malformado | TCOND-API-34 | Média | ⏳ |
| CT-API-GEN-04 | Disponibilizar a documentação Swagger | TCOND-API-34 | Baixa | ⏳ |

**Distribuição:** 66 casos · Alta: 25 · Média: 29 · Baixa: 12.

---

### 3.2 FS-API-01 — Cadastro e login

#### CT-API-AUTH-01 — Cadastrar cliente com dados válidos

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o cadastro cria o cliente com os valores iniciais corretos e sem expor a senha |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF01 · RP05 · TCOND-API-01 |
| **Pré-condições** | E-mail `qa.api+<timestamp>@email.com` não cadastrado |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpo: `{ "name": "Lilyan QA", "email": "qa.api+<timestamp>@email.com", "password": "senha123" }` |
| **Resultado esperado** | **201 Created** · Corpo `{ "user": { "id", "name": "Lilyan QA", "email": "qa.api+<timestamp>@email.com", "totalSpent": 0, "isVip": false } }` · `id` não vazio · o corpo **não** contém `password` |

#### CT-API-AUTH-02 — Recusar e-mail já cadastrado, mesmo em maiúsculas

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a unicidade do e-mail sem diferenciar maiúsculas de minúsculas |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF01 · RP07 · TCOND-API-02 |
| **Pré-condições** | Persona Ana cadastrada |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpos: (a) `{ "name": "Outra Ana", "email": "ana@email.com", "password": "senha123" }` · (b) o mesmo com `"email": "ANA@Email.com"` |
| **Resultado esperado** | **409 Conflict** nos dois casos · `{ "error": "Já existe um usuário cadastrado com este e-mail." }` |

#### CT-API-AUTH-03 — Recusar nome com 1 caractere

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Valor-limite inválido do nome |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-API-03 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpos: (a) `"name": "L"` · (b) `"name": "  L  "` (o nome é aparado antes da validação); e-mail novo e senha `senha123` |
| **Resultado esperado** | **400 Bad Request** · `{ "error": "Informe um nome com pelo menos 2 caracteres." }` |

#### CT-API-AUTH-04 — Aceitar nome com 2 caracteres

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Valor-limite válido do nome |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-API-03 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpo com `"name": "Li"`, e-mail novo e senha `senha123` |
| **Resultado esperado** | **201 Created** · `user.name` = `"Li"` |

#### CT-API-AUTH-05 — Recusar senha com 5 caracteres

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Valor-limite inválido da senha |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-API-04 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpo com `"password": "12345"`, nome e e-mail válidos |
| **Resultado esperado** | **400 Bad Request** · `{ "error": "A senha deve ter pelo menos 6 caracteres." }` |

#### CT-API-AUTH-06 — Aceitar senha com 6 caracteres

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Valor-limite válido da senha |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-API-04 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpo com `"password": "123456"`, nome e e-mail novo |
| **Resultado esperado** | **201 Created**; login com a mesma senha retorna **200** |

#### CT-API-AUTH-07 — Recusar e-mails em formato inválido

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Particionamento de equivalência do e-mail (classes inválidas) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · RP07 · TCOND-API-05 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` com nome `Lilyan QA`, senha `senha123` e, um por vez, `"email"`: `"lilyan"` · `"lilyan@"` · `"lilyan@email"` · `"lilyan @email.com"` · `""` |
| **Resultado esperado** | **400 Bad Request** em todos · `{ "error": "Informe um e-mail válido." }` |

#### CT-API-AUTH-08 — Recusar cadastro sem corpo

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a ausência de corpo é tratada como dado inválido, sem erro 500 |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF01 · RP07 · TCOND-API-06 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` sem corpo |
| **Resultado esperado** | **400 Bad Request** · `{ "error": "Informe um nome com pelo menos 2 caracteres." }` |

#### CT-API-AUTH-09 — Recusar cadastro com tipos de dado errados

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que campos com tipo diferente de texto são recusados |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF01 · RP07 · TCOND-API-06 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpos: (a) `"name": 12345` · (b) `"email": true` · (c) `"password": 123456` (número); os demais campos válidos |
| **Resultado esperado** | **400 Bad Request** com a mensagem do campo inválido: (a) nome · (b) e-mail · (c) `"A senha deve ter pelo menos 6 caracteres."` |

#### CT-API-AUTH-10 — Recusar senha formada só por espaços

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que uma senha sem caracteres visíveis não é aceita (suposição de erro) |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF01 · RP05 · TCOND-API-06 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/register` · Corpo com `"password": "      "` (6 espaços), nome e e-mail novo |
| **Resultado esperado** | **400 Bad Request** com mensagem de senha inválida |

> **Observação:** RF01 define só o tamanho mínimo. O resultado esperado segue a boa prática de não aceitar senha em branco; a divergência deve ser confirmada com o PO.

#### CT-API-AUTH-11 🤖 — Fazer login com credenciais válidas

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o login devolve um token JWT válido por 2 horas e os dados do cliente |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF02 · RP05 · TCOND-API-07 |
| **Pré-condições** | Persona Ana cadastrada |
| **Requisição** | `POST {{baseUrl}}/auth/login` · Corpo: `{ "email": "ana@email.com", "password": "123456" }` |
| **Resultado esperado** | **200 OK** · Corpo `{ "token": "<jwt>", "user": { "id", "name": "Ana Silva", "email": "ana@email.com", "totalSpent": 0, "isVip": false } }` · `token` com 3 partes separadas por `.` · no *payload* decodificado, `sub` = `user.id` e `exp − iat` = **7200** segundos · sem `password` no corpo |

#### CT-API-AUTH-12 — Recusar login com senha incorreta

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que senha errada não autentica |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF02 · RP05 · TCOND-API-08 |
| **Pré-condições** | Persona Ana cadastrada |
| **Requisição** | `POST {{baseUrl}}/auth/login` · Corpo: `{ "email": "ana@email.com", "password": "senhaerrada" }` |
| **Resultado esperado** | **401 Unauthorized** · `{ "error": "E-mail ou senha inválidos." }` · sem `token` no corpo |

#### CT-API-AUTH-13 — Recusar login de e-mail não cadastrado com a mesma mensagem

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a API não revela se o e-mail existe |
| **Prioridade** | Média |
| **Rastreabilidade** | RF02 · RP05 · TCOND-API-08 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/login` · Corpo: `{ "email": "naoexiste@email.com", "password": "123456" }` |
| **Resultado esperado** | **401 Unauthorized** · mensagem idêntica à do CT-API-AUTH-12 |

#### CT-API-AUTH-14 — Recusar login sem e-mail ou sem senha

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a obrigatoriedade dos campos |
| **Prioridade** | Média |
| **Rastreabilidade** | RF02 · TCOND-API-09 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/login` · Corpos: (a) `{ "email": "ana@email.com" }` · (b) `{ "password": "123456" }` · (c) `{ "email": "", "password": "" }` · (d) `{ "email": 1, "password": 1 }` |
| **Resultado esperado** | **400 Bad Request** em todos · `{ "error": "Informe e-mail e senha." }` |

#### CT-API-AUTH-15 — Aceitar login com e-mail em maiúsculas e com espaços

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a normalização do e-mail no login |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF02 · TCOND-API-10 |
| **Pré-condições** | Persona Ana cadastrada |
| **Requisição** | `POST {{baseUrl}}/auth/login` · Corpo: `{ "email": "  ANA@Email.COM  ", "password": "123456" }` |
| **Resultado esperado** | **200 OK** · `user.email` = `"ana@email.com"` |

---

### 3.3 FS-API-02 — Dados do cliente

#### CT-API-USR-01 — Consultar os dados do cliente autenticado

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que `/users/me` devolve os dados do dono do token |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF03 · RN03 · TCOND-API-11 |
| **Pré-condições** | Aplicação recém-iniciada |
| **Requisição** | `GET {{baseUrl}}/users/me` · Cabeçalho `Authorization: Bearer {{tokenBruno}}` |
| **Resultado esperado** | **200 OK** · `{ "user": { "name": "Bruno Souza", "email": "bruno@email.com", "totalSpent": 280, "isVip": false } }` · sem `password` |

---

### 3.4 FS-API-03 — Segurança e autenticação

#### CT-API-SEC-01 — Recusar rotas protegidas sem token

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que **todas** as rotas protegidas exigem autenticação |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF03 · RP05 · TCOND-API-12 |
| **Pré-condições** | — |
| **Requisição** | Sem cabeçalho `Authorization`, uma por vez: `GET /users/me` · `GET /cart` · `DELETE /cart` · `POST /cart/items` · `PATCH /cart/items/{{tecladoId}}` · `DELETE /cart/items/{{tecladoId}}` · `GET /checkout/summary?paymentMethod=cash` · `POST /checkout` |
| **Resultado esperado** | **401 Unauthorized** em todas · `{ "error": "Token de autenticação não informado." }` |

#### CT-API-SEC-02 — Recusar token malformado

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o tratamento de token que não é um JWT |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF03 · RP05 · TCOND-API-13 |
| **Pré-condições** | — |
| **Requisição** | `GET {{baseUrl}}/users/me` · `Authorization: Bearer abc` |
| **Resultado esperado** | **401 Unauthorized** · `{ "error": "Token inválido ou expirado." }` |

#### CT-API-SEC-03 — Recusar token assinado com outro segredo

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a assinatura do token é validada (token forjado) |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF03 · RP05 · TCOND-API-13 |
| **Pré-condições** | Token gerado com `jsonwebtoken.sign({ sub: "<id da Ana>" }, "outro-segredo")` |
| **Requisição** | `GET {{baseUrl}}/users/me` · `Authorization: Bearer <token forjado>` |
| **Resultado esperado** | **401 Unauthorized** · `{ "error": "Token inválido ou expirado." }` |

#### CT-API-SEC-04 — Recusar token expirado

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o token deixa de valer após o `exp` |
| **Prioridade** | Média |
| **Rastreabilidade** | RF02 · RF03 · TCOND-API-13 |
| **Pré-condições** | Token gerado com o segredo da aplicação (`ppp-ecommerce-dev-secret`) e `exp` no passado |
| **Requisição** | `GET {{baseUrl}}/users/me` · `Authorization: Bearer <token expirado>` |
| **Resultado esperado** | **401 Unauthorized** · `{ "error": "Token inválido ou expirado." }` |

#### CT-API-SEC-05 — Recusar esquema de autenticação diferente de Bearer

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que só o esquema Bearer é aceito |
| **Prioridade** | Média |
| **Rastreabilidade** | RF03 · TCOND-API-14 |
| **Pré-condições** | `{{tokenAna}}` válido |
| **Requisição** | `GET {{baseUrl}}/users/me` com `Authorization`: (a) `{{tokenAna}}` sem esquema · (b) `Token {{tokenAna}}` · (c) `Basic YW5hOjEyMzQ1Ng==` |
| **Resultado esperado** | **401 Unauthorized** em todos · `{ "error": "Token de autenticação não informado." }` |

#### CT-API-SEC-06 — Aceitar o esquema `bearer` em minúsculas

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a conformidade com a RFC 6750 / RFC 9110, que definem o nome do esquema de autenticação como **insensível a maiúsculas** |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF03 · [REF-04] · TCOND-API-14 |
| **Pré-condições** | `{{tokenAna}}` válido |
| **Requisição** | `GET {{baseUrl}}/users/me` · `Authorization: bearer {{tokenAna}}` |
| **Resultado esperado** | **200 OK** com os dados da Ana |

#### CT-API-SEC-07 — Isolar o carrinho de cada cliente

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que um cliente não vê nem altera o carrinho de outro |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF03 · RP05 · TCOND-API-15 |
| **Pré-condições** | Dois clientes novos, A e B, com carrinhos vazios |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | `POST /cart/items` com o token de A · `{ "productId": "{{tecladoId}}", "quantity": 2 }` | **201** · carrinho de A com 2 Teclados |
| 2 | `GET /cart` com o token de B | **200** · `items: []`, `totalItems: 0` |
| 3 | `DELETE /cart` com o token de B, depois `GET /cart` com o token de A | Carrinho de A continua com 2 Teclados |

#### CT-API-SEC-08 — Não expor senha nem hash nas respostas

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que nenhum endpoint devolve a senha ou o hash bcrypt |
| **Prioridade** | Média |
| **Rastreabilidade** | RP05 · TCOND-API-16 |
| **Pré-condições** | — |
| **Requisição** | Respostas de `POST /auth/register`, `POST /auth/login`, `GET /users/me` e `POST /checkout` |
| **Resultado esperado** | Nenhum corpo contém a chave `password` nem texto no padrão `$2a$`/`$2b$` (hash bcrypt) |

#### CT-API-SEC-09 — Recusar corpo de requisição grande demais com 413

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que um *payload* acima do limite do servidor (100 KB) é recusado como erro do cliente |
| **Prioridade** | Média |
| **Rastreabilidade** | RNF01 · RP07 · TCOND-API-17 |
| **Pré-condições** | — |
| **Requisição** | `POST {{baseUrl}}/auth/login` · Corpo: `{ "email": "<200.000 caracteres 'a'>", "password": "x" }` (~200 KB) |
| **Resultado esperado** | **413 Payload Too Large** · corpo JSON `{ "error": "<mensagem>" }`; nunca **500** |

---

### 3.5 FS-API-04 — Produtos

#### CT-API-PRD-01 — Listar produtos

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a lista, a ordem e o formato de cada produto |
| **Prioridade** | Média |
| **Rastreabilidade** | F3 · RP08 · TCOND-API-18 |
| **Pré-condições** | Aplicação recém-iniciada |
| **Requisição** | `GET {{baseUrl}}/products` (sem autenticação) |
| **Resultado esperado** | **200 OK** · `{ "products": [...] }` com 3 itens em ordem alfabética: Monitor 24" Full HD (899, estoque 0), Mouse Sem Fio (89.9, estoque 5), Teclado Mecânico (250, estoque 10) · cada item tem `id`, `name`, `description`, `price`, `stock` e `imageUrl` |

#### CT-API-PRD-02 — Detalhar produto existente

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o detalhe de um produto |
| **Prioridade** | Média |
| **Rastreabilidade** | F3 · RP08 · TCOND-API-18 |
| **Pré-condições** | `{{tecladoId}}` obtido em `GET /products` |
| **Requisição** | `GET {{baseUrl}}/products/{{tecladoId}}` |
| **Resultado esperado** | **200 OK** · `{ "product": { "id": "{{tecladoId}}", "name": "Teclado Mecânico", "price": 250, "stock": 10, ... } }` |

#### CT-API-PRD-03 — Recusar id de produto em formato inválido

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o tratamento de id que não é um ObjectId |
| **Prioridade** | Média |
| **Rastreabilidade** | F3 · RP07 · TCOND-API-19 |
| **Pré-condições** | — |
| **Requisição** | `GET {{baseUrl}}/products/123` |
| **Resultado esperado** | **400 Bad Request** · `{ "error": "O id informado é inválido." }` |

#### CT-API-PRD-04 — Informar produto inexistente

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o tratamento de id válido que não existe |
| **Prioridade** | Média |
| **Rastreabilidade** | F3 · TCOND-API-19 |
| **Pré-condições** | — |
| **Requisição** | `GET {{baseUrl}}/products/{{idInexistente}}` |
| **Resultado esperado** | **404 Not Found** · `{ "error": "Produto não encontrado." }` |

---

### 3.6 FS-API-05 — Carrinho

Pré-condição comum: cliente novo autenticado (`{{tokenNovo}}`) com carrinho vazio, salvo indicação contrária.

#### CT-API-CAR-01 — Consultar carrinho vazio de cliente novo

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o carrinho inicial |
| **Prioridade** | Média |
| **Rastreabilidade** | F4 · TCOND-API-24 |
| **Requisição** | `GET {{baseUrl}}/cart` · `Authorization: Bearer {{tokenNovo}}` |
| **Resultado esperado** | **200 OK** · `{ "items": [], "totalItems": 0, "subtotal": 0 }` |

#### CT-API-CAR-02 — Adicionar produto ao carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a adição e o formato da visão do carrinho |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-API-20 |
| **Requisição** | `POST {{baseUrl}}/cart/items` · `{ "productId": "{{tecladoId}}", "quantity": 2 }` |
| **Resultado esperado** | **201 Created** · `items[0]` = `{ "productId": "{{tecladoId}}", "name": "Teclado Mecânico", "unitPrice": 250, "quantity": 2, "lineTotal": 500, "stock": 10 }` · `totalItems: 2` · `subtotal: 500` |

#### CT-API-CAR-03 — Acumular a quantidade ao adicionar o mesmo produto

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que adicionar de novo soma a quantidade, sem duplicar a linha |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · TCOND-API-20 |
| **Pré-condições** | Carrinho com 2 Teclados |
| **Requisição** | `POST {{baseUrl}}/cart/items` · `{ "productId": "{{tecladoId}}", "quantity": 3 }` |
| **Resultado esperado** | **201 Created** · `items` com **1** linha, `quantity: 5`, `lineTotal: 1250` · `subtotal: 1250` |

#### CT-API-CAR-04 🤖 — Recusar adição que faz o carrinho passar do estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a **soma** das quantidades no carrinho não ultrapassa o estoque (valor-limite: estoque + 1) |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-API-21 |
| **Pré-condições** | Aplicação recém-iniciada (Mouse com estoque 5) |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | `POST /cart/items` · `{ "productId": "{{mouseId}}", "quantity": 5 }` | **201** · `quantity: 5` |
| 2 | `POST /cart/items` · `{ "productId": "{{mouseId}}", "quantity": 1 }` | **422 Unprocessable Entity** · `{ "error": "Estoque insuficiente para \"Mouse Sem Fio\". Disponível: 5." }` |
| 3 | `GET /cart` | Mouse continua com `quantity: 5` |

#### CT-API-CAR-05 — Aceitar quantidade igual ao estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Valor-limite válido: quantidade igual ao estoque |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · TCOND-API-21 |
| **Pré-condições** | Aplicação recém-iniciada |
| **Requisição** | `POST {{baseUrl}}/cart/items` · `{ "productId": "{{tecladoId}}", "quantity": 10 }` |
| **Resultado esperado** | **201 Created** · `quantity: 10` · `subtotal: 2500`. Com `"quantity": 11` em um carrinho vazio: **422** · `"Estoque insuficiente para \"Teclado Mecânico\". Disponível: 10."` |

#### CT-API-CAR-06 — Recusar produto sem estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que produto com estoque 0 não entra no carrinho |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-API-22 |
| **Requisição** | `POST {{baseUrl}}/cart/items` · `{ "productId": "{{monitorId}}", "quantity": 1 }` |
| **Resultado esperado** | **422 Unprocessable Entity** · `{ "error": "O produto \"Monitor 24\" Full HD\" está sem estoque." }` · carrinho continua vazio |

#### CT-API-CAR-07 — Recusar quantidades inválidas

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Particionamento de equivalência e valor-limite da quantidade (classes inválidas) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF04 · RP07 · TCOND-API-23 |
| **Requisição** | `POST {{baseUrl}}/cart/items` com `"productId": "{{tecladoId}}"` e, um por vez, `"quantity"`: `0` · `-1` · `1.5` · `"abc"` |
| **Resultado esperado** | **400 Bad Request** em todos · `{ "error": "A quantidade deve ser um número inteiro maior ou igual a 1." }` · carrinho inalterado |

#### CT-API-CAR-08 — Recusar quantidade que não é número inteiro (booleano e texto)

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que valores de outro tipo não são convertidos silenciosamente em quantidade |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF04 · RP07 · TCOND-API-23 |
| **Requisição** | `POST {{baseUrl}}/cart/items` com `"productId": "{{tecladoId}}"` e, um por vez, `"quantity"`: `true` · `"2"` · `"1e1"` |
| **Resultado esperado** | **400 Bad Request** em todos · mensagem de quantidade inválida · carrinho inalterado |

> **Observação:** o Swagger define `quantity` como `integer`. O resultado esperado segue o contrato; aceitar `true` como 1 ou `"1e1"` como 10 indica conversão de tipo indevida.

#### CT-API-CAR-09 — Usar quantidade 1 quando ela não é informada

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o valor padrão da quantidade |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF04 · TCOND-API-23 |
| **Requisição** | `POST {{baseUrl}}/cart/items` · `{ "productId": "{{tecladoId}}" }` |
| **Resultado esperado** | **201 Created** · `quantity: 1` |

#### CT-API-CAR-10 — Recusar productId inválido ou inexistente

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o tratamento de produto inválido na adição |
| **Prioridade** | Média |
| **Rastreabilidade** | F4 · RP07 · TCOND-API-19 |
| **Requisição** | `POST {{baseUrl}}/cart/items` com `"quantity": 1` e: (a) `"productId": "abc"` · (b) `"productId": "{{idInexistente}}"` · (c) sem `productId` |
| **Resultado esperado** | (a) e (c) **400** · `{ "error": "O productId informado é inválido." }` · (b) **404** · `{ "error": "Produto não encontrado." }` |

#### CT-API-CAR-11 — Alterar a quantidade de um item

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a alteração de quantidade (substitui o valor, não soma) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF04 · TCOND-API-24 |
| **Pré-condições** | Carrinho com 3 Teclados |
| **Requisição** | `PATCH {{baseUrl}}/cart/items/{{tecladoId}}` · `{ "quantity": 2 }` |
| **Resultado esperado** | **200 OK** · `quantity: 2` · `lineTotal: 500` · `subtotal: 500` |

#### CT-API-CAR-12 — Recusar alteração para quantidade acima do estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o limite de estoque na alteração |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-API-21 |
| **Pré-condições** | Aplicação recém-iniciada; carrinho com 2 Mouses |
| **Requisição** | `PATCH {{baseUrl}}/cart/items/{{mouseId}}` · `{ "quantity": 6 }` |
| **Resultado esperado** | **422** · `{ "error": "Estoque insuficiente para \"Mouse Sem Fio\". Disponível: 5." }` · quantidade continua 2 |

#### CT-API-CAR-13 — Recusar alteração de produto que não está no carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o PATCH para um produto existente fora do carrinho |
| **Prioridade** | Média |
| **Rastreabilidade** | F4 · TCOND-API-24 |
| **Pré-condições** | Carrinho sem o Mouse |
| **Requisição** | `PATCH {{baseUrl}}/cart/items/{{mouseId}}` · `{ "quantity": 1 }` |
| **Resultado esperado** | **404 Not Found** · `{ "error": "Este produto não está no carrinho." }` |

#### CT-API-CAR-14 — Recusar alteração para quantidade zero

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Valor-limite inválido na alteração |
| **Prioridade** | Média |
| **Rastreabilidade** | RF04 · TCOND-API-23 |
| **Pré-condições** | Carrinho com 1 Teclado |
| **Requisição** | `PATCH {{baseUrl}}/cart/items/{{tecladoId}}` · `{ "quantity": 0 }` |
| **Resultado esperado** | **400** · `{ "error": "A quantidade deve ser um número inteiro maior ou igual a 1." }` · quantidade continua 1 |

#### CT-API-CAR-15 — Remover item do carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a remoção de um item, mantendo os demais |
| **Prioridade** | Média |
| **Rastreabilidade** | F4 · TCOND-API-24 |
| **Pré-condições** | Carrinho com 1 Teclado e 1 Mouse |
| **Requisição** | `DELETE {{baseUrl}}/cart/items/{{mouseId}}` |
| **Resultado esperado** | **200 OK** · `items` só com o Teclado · `subtotal: 250` |

#### CT-API-CAR-16 — Informar remoção de produto que não está no carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o DELETE de item ausente, conforme o Swagger (que documenta 200, 401 e 404 para esta rota) |
| **Prioridade** | Baixa |
| **Rastreabilidade** | F4 · RP08 · TCOND-API-24 |
| **Pré-condições** | Carrinho vazio |
| **Requisição** | `DELETE {{baseUrl}}/cart/items/{{tecladoId}}` e `DELETE {{baseUrl}}/cart/items/abc` |
| **Resultado esperado** | **404 Not Found** nos dois · `{ "error": "Este produto não está no carrinho." }` |

> **Observação:** nas demais rotas, um id em formato inválido retorna **400** (ex.: CT-API-PRD-03, CT-API-CAR-10). Aqui o retorno 404 está **de acordo com o Swagger**, mas é inconsistente com o restante da API; registrado como sugestão de melhoria, não como defeito.

#### CT-API-CAR-17 — Esvaziar o carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a remoção de todos os itens |
| **Prioridade** | Média |
| **Rastreabilidade** | F4 · TCOND-API-24 |
| **Pré-condições** | Carrinho com 1 Teclado e 1 Mouse |
| **Requisição** | `DELETE {{baseUrl}}/cart` |
| **Resultado esperado** | **200 OK** · `{ "items": [], "totalItems": 0, "subtotal": 0 }` |

---

### 3.7 FS-API-06 — Finalização de compra

Os casos CT-API-CHK-01 a 04 implementam a **tabela de decisão** do Plano de Testes (seção 6.3a), com 1 Teclado Mecânico (R$ 250,00) no carrinho:

| Caso | Regra | Cliente | `paymentMethod` | `subtotal` | `discount` | `shipping` | `total` |
|---|---|---|---|---|---|---|---|
| CT-API-CHK-01 | R2 | Ana (não VIP) | `credit_card` | 250 | 0 | 20 | **270** |
| CT-API-CHK-02 | R1 | Ana (não VIP) | `cash` | 250 | 25 | 20 | **245** |
| CT-API-CHK-03 | R4 | Carla (VIP) | `credit_card` | 250 | 0 | 0 | **250** |
| CT-API-CHK-04 | R3 | Carla (VIP) | `cash` | 250 | 25 | 0 | **225** |

#### CT-API-CHK-01 — Calcular prévia de não VIP pagando com cartão

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Regra R2: sem desconto e com frete |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RP01 · TCOND-API-25 |
| **Pré-condições** | Ana autenticada; carrinho com 1 Teclado |
| **Requisição** | `GET {{baseUrl}}/checkout/summary?paymentMethod=credit_card` · `Authorization: Bearer {{tokenAna}}` |
| **Resultado esperado** | **200 OK** · `paymentMethod: "credit_card"`, `isVip: false`, `subtotal: 250`, `discount: 0`, `shipping: 20`, `total: 270` · `items` com o Teclado |

#### CT-API-CHK-02 🤖 — Finalizar compra de não VIP em dinheiro com desconto

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Regra R1 de ponta a ponta: desconto só sobre os produtos, frete cobrado, pedido registrado, carrinho esvaziado e total gasto atualizado |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RF06 · RP01 · TCOND-API-25, TCOND-API-29 |
| **Pré-condições** | Cliente novo autenticado (R$ 0,00 gastos); carrinho com 1 Teclado |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | `GET /checkout/summary?paymentMethod=cash` | **200** · `subtotal: 250`, `discount: 25`, `shipping: 20`, `total: 245` |
| 2 | `POST /checkout` · `{ "paymentMethod": "cash" }` | **201 Created** · `order`: `paymentMethod: "cash"`, `subtotal: 250`, `discount: 25`, `shipping: 20`, `total: 245`, `vipAtPurchase: false`, `becameVip: false`, `items[0]` = `{ "productId": "{{tecladoId}}", "name": "Teclado Mecânico", "unitPrice": 250, "quantity": 1, "lineTotal": 250 }`, `id` e `createdAt` preenchidos · `user`: `totalSpent: 245`, `isVip: false` |
| 3 | `GET /cart` | **200** · `items: []` |
| 4 | `GET /users/me` | `totalSpent: 245` |

#### CT-API-CHK-03 — Calcular prévia de VIP pagando com cartão

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Regra R4: frete grátis e sem desconto |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RP01 · TCOND-API-25 |
| **Pré-condições** | Carla autenticada; carrinho com 1 Teclado |
| **Requisição** | `GET {{baseUrl}}/checkout/summary?paymentMethod=credit_card` · `Authorization: Bearer {{tokenCarla}}` |
| **Resultado esperado** | **200 OK** · `isVip: true`, `subtotal: 250`, `discount: 0`, `shipping: 0`, `total: 250` |

#### CT-API-CHK-04 — Calcular prévia de VIP pagando em dinheiro

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Regra R3: desconto e frete grátis acumulados |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RP01 · TCOND-API-25 |
| **Pré-condições** | Carla autenticada; carrinho com 1 Teclado |
| **Requisição** | `GET {{baseUrl}}/checkout/summary?paymentMethod=cash` |
| **Resultado esperado** | **200 OK** · `isVip: true`, `subtotal: 250`, `discount: 25`, `shipping: 0`, `total: 225` |

#### CT-API-CHK-05 — Não alterar o estado ao consultar a prévia

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a prévia não baixa estoque, não esvazia o carrinho e não muda o total gasto |
| **Prioridade** | Média |
| **Rastreabilidade** | RN02 · TCOND-API-26 |
| **Pré-condições** | Aplicação recém-iniciada; cliente novo com 2 Teclados no carrinho |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | `GET /checkout/summary?paymentMethod=cash` três vezes | **200** nas três, com os mesmos valores |
| 2 | `GET /products/{{tecladoId}}` | `stock: 10` (inalterado) |
| 3 | `GET /cart` e `GET /users/me` | Carrinho com 2 Teclados · `totalSpent: 0` |

#### CT-API-CHK-06 — Recusar prévia sem forma de pagamento válida

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Particionamento de equivalência do `paymentMethod` na prévia |
| **Prioridade** | Média |
| **Rastreabilidade** | RF05 · TCOND-API-27 |
| **Pré-condições** | Carrinho com 1 Teclado |
| **Requisição** | `GET {{baseUrl}}/checkout/summary` com: (a) sem `paymentMethod` · (b) `?paymentMethod=pix` · (c) `?paymentMethod=CASH` |
| **Resultado esperado** | **400 Bad Request** em todos · `{ "error": "Forma de pagamento inválida. Use uma das opções: cash, credit_card." }` |

#### CT-API-CHK-07 — Recusar checkout com forma de pagamento inválida

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o checkout só aceita `cash` ou `credit_card` e não muda nada quando recusa |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF05 · TCOND-API-27 |
| **Pré-condições** | Carrinho com 1 Teclado |
| **Requisição** | `POST {{baseUrl}}/checkout` com corpo: (a) `{}` · (b) `{ "paymentMethod": "pix" }` · (c) `{ "paymentMethod": "" }` · (d) `{ "paymentMethod": ["cash"] }` |
| **Resultado esperado** | **400 Bad Request** em todos · mensagem de forma de pagamento inválida · carrinho, estoque e total gasto inalterados |

#### CT-API-CHK-08 — Recusar checkout com carrinho vazio

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a regra de carrinho vazio |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF05 · TCOND-API-28 |
| **Pré-condições** | Cliente novo com carrinho vazio |
| **Requisição** | `POST {{baseUrl}}/checkout` · `{ "paymentMethod": "cash" }` |
| **Resultado esperado** | **422 Unprocessable Entity** · `{ "error": "O carrinho está vazio." }` · `totalSpent` continua 0 |

#### CT-API-CHK-09 — Baixar o estoque após o checkout

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a baixa de estoque exata |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RF06 · TCOND-API-29 |
| **Pré-condições** | Aplicação recém-iniciada; cliente novo com 3 Teclados e 2 Mouses no carrinho |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | `POST /checkout` · `{ "paymentMethod": "credit_card" }` | **201** · `order.total: 949.8` (750 + 179,80 + 20) |
| 2 | `GET /products/{{tecladoId}}` e `GET /products/{{mouseId}}` | Teclado `stock: 7` · Mouse `stock: 3` |

#### CT-API-CHK-10 — Tornar o cliente VIP na compra que atinge R$ 300,00

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Transição Não VIP → VIP: a compra que atinge o limite ainda paga frete; a seguinte é grátis |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN03 · RP02 · TCOND-API-30 |
| **Pré-condições** | Aplicação recém-iniciada; Bruno autenticado (`totalSpent: 280`, `isVip: false`); carrinho com 1 Mouse |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | `POST /checkout` · `{ "paymentMethod": "credit_card" }` | **201** · `order`: `subtotal: 89.9`, `discount: 0`, `shipping: 20`, `total: 109.9`, `vipAtPurchase: false`, `becameVip: true` · `user`: `totalSpent: 389.9`, `isVip: true` |
| 2 | `GET /users/me` | `totalSpent: 389.9`, `isVip: true` |
| 3 | `POST /cart/items` (1 Teclado) e `GET /checkout/summary?paymentMethod=credit_card` | `isVip: true`, `shipping: 0`, `total: 250` |

#### CT-API-CHK-11 — Registrar compra de cliente que já era VIP

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar os indicadores VIP no pedido de quem já era VIP |
| **Prioridade** | Média |
| **Rastreabilidade** | RN03 · TCOND-API-30 |
| **Pré-condições** | Aplicação recém-iniciada; Carla autenticada (`totalSpent: 450`); carrinho com 1 Teclado |
| **Requisição** | `POST {{baseUrl}}/checkout` · `{ "paymentMethod": "cash" }` |
| **Resultado esperado** | **201** · `order`: `shipping: 0`, `total: 225`, `vipAtPurchase: true`, `becameVip: false` · `user`: `totalSpent: 675`, `isVip: true` |

#### CT-API-CHK-12 — Arredondar o desconto de produto com centavos

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o arredondamento para 2 casas decimais |
| **Prioridade** | Média |
| **Rastreabilidade** | RN01 · RP01 · TCOND-API-31 |
| **Pré-condições** | Cliente novo com 1 Mouse (R$ 89,90) no carrinho |
| **Requisição** | `POST {{baseUrl}}/checkout` · `{ "paymentMethod": "cash" }` |
| **Resultado esperado** | **201** · `subtotal: 89.9`, `discount: 8.99`, `shipping: 20`, `total: 100.91` · todos com no máximo 2 casas decimais |

#### CT-API-CHK-13 — Calcular compra com vários itens

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o cálculo com mais de um produto e quantidades diferentes |
| **Prioridade** | Média |
| **Rastreabilidade** | RN01 · RP01 · TCOND-API-31 |
| **Pré-condições** | Cliente novo com 1 Teclado e 2 Mouses no carrinho |
| **Requisição** | `GET {{baseUrl}}/checkout/summary?paymentMethod=cash` |
| **Resultado esperado** | **200** · linhas: Teclado `lineTotal: 250`, Mouse `lineTotal: 179.8` · `subtotal: 429.8`, `discount: 42.98`, `shipping: 20`, `total: 406.82` |

#### CT-API-CHK-14 — Recusar checkout quando o estoque acabou depois da adição

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a revalidação do estoque no checkout |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-API-32 |
| **Pré-condições** | Aplicação recém-iniciada; clientes novos A e B |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | A: `POST /cart/items` · `{ "productId": "{{mouseId}}", "quantity": 5 }` | **201** |
| 2 | B: `POST /cart/items` (1 Mouse) e `POST /checkout` · `{ "paymentMethod": "cash" }` | **201** · estoque do Mouse passa para 4 |
| 3 | A: `POST /checkout` · `{ "paymentMethod": "cash" }` | **422** · `{ "error": "Estoque insuficiente para \"Mouse Sem Fio\". Disponível: 4." }` |
| 4 | `GET /products/{{mouseId}}`; A: `GET /cart` e `GET /users/me` | `stock: 4` · carrinho de A com os 5 Mouses · `totalSpent` de A = 0 |

#### CT-API-CHK-15 — Gerar um único pedido com checkouts simultâneos

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que requisições paralelas de checkout do mesmo carrinho (duplo clique, várias abas, nova tentativa automática) não geram cobrança duplicada nem baixa indevida de estoque |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF06 · RN02 · RP03 · TCOND-API-33 |
| **Pré-condições** | Aplicação recém-iniciada; cliente novo com 1 Teclado no carrinho |

| # | Requisição | Resultado esperado |
|---|---|---|
| 1 | Disparar **5** `POST /checkout` · `{ "paymentMethod": "cash" }` em paralelo (ex.: `Promise.all`) | Exatamente **1** resposta **201**; as outras 4 **422** · `"O carrinho está vazio."`; **nenhuma** resposta 500 |
| 2 | `GET /products/{{tecladoId}}` | `stock: 9` (baixa de 1 unidade) |
| 3 | `GET /users/me` | `totalSpent: 245` (uma única cobrança) |

#### CT-API-CHK-16 — Não cobrar frete na prévia de carrinho vazio

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a coerência da prévia quando não há produtos |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RN03 · RF05 · TCOND-API-26 |
| **Pré-condições** | Cliente novo, não VIP, com carrinho vazio |
| **Requisição** | `GET {{baseUrl}}/checkout/summary?paymentMethod=cash` |
| **Resultado esperado** | Comportamento coerente com o checkout, que recusa carrinho vazio: **422** · `"O carrinho está vazio."`, **ou** **200** com `shipping: 0` e `total: 0`. Nunca uma prévia que cobra R$ 20,00 de frete sem nenhum produto |

> **Observação:** a regra para carrinho vazio na prévia não está documentada; o resultado esperado deve ser confirmado com o PO.

---

### 3.8 FS-API-07 — Geral e contrato

#### CT-API-GEN-01 — Verificar o health check

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o endpoint de saúde usado no *smoke test* |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RNF01 · TCOND-API-34 |
| **Requisição** | `GET {{baseUrl}}/health` |
| **Resultado esperado** | **200 OK** · `{ "status": "ok" }` |

#### CT-API-GEN-02 — Responder rota inexistente com 404 em JSON

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o tratamento de rota desconhecida sob `/api` |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RNF01 · TCOND-API-34 |
| **Requisição** | `GET {{baseUrl}}/xyz` e `POST {{baseUrl}}/products` |
| **Resultado esperado** | **404 Not Found** · `{ "error": "Rota não encontrada." }` |

#### CT-API-GEN-03 — Recusar JSON malformado

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que JSON inválido é tratado como erro do cliente |
| **Prioridade** | Média |
| **Rastreabilidade** | RNF01 · RP07 · TCOND-API-34 |
| **Requisição** | `POST {{baseUrl}}/auth/login` · corpo bruto: `{"email":` |
| **Resultado esperado** | **400 Bad Request** · `{ "error": "O corpo da requisição não é um JSON válido." }` |

#### CT-API-GEN-04 — Disponibilizar a documentação Swagger

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o contrato está publicado |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RP08 · TCOND-API-34 |
| **Requisição** | `GET http://localhost:3030/api-docs/swagger.yaml` e `GET http://localhost:3030/api-docs/` |
| **Resultado esperado** | **200** nos dois · o YAML começa com `openapi: 3` e lista os 12 endpoints da API · a interface Swagger UI carrega |

---

## 4. Cobertura e rastreabilidade

### 4.1 Endpoint → casos

| Endpoint | Casos | Códigos cobertos |
|---|---|---|
| `POST /auth/register` | AUTH-01 a AUTH-10, SEC-08 | 201, 400, 409 |
| `POST /auth/login` | AUTH-11 a AUTH-15, SEC-08, SEC-09, GEN-03 | 200, 400, 401, 413 |
| `GET /users/me` | USR-01, SEC-01 a SEC-06 | 200, 401 |
| `GET /products` | PRD-01 | 200 |
| `GET /products/{id}` | PRD-02 a PRD-04 | 200, 400, 404 |
| `GET /cart` | CAR-01, SEC-01, SEC-07 | 200, 401 |
| `POST /cart/items` | CAR-02 a CAR-10, SEC-01 | 201, 400, 401, 404, 422 |
| `PATCH /cart/items/{productId}` | CAR-11 a CAR-14, SEC-01 | 200, 400, 401, 404, 422 |
| `DELETE /cart/items/{productId}` | CAR-15, CAR-16, SEC-01 | 200, 401, 404 |
| `DELETE /cart` | CAR-17, SEC-01, SEC-07 | 200, 401 |
| `GET /checkout/summary` | CHK-01, CHK-03 a CHK-06, CHK-13, CHK-16, SEC-01 | 200, 400, 401, 422 |
| `POST /checkout` | CHK-02, CHK-07 a CHK-12, CHK-14, CHK-15, SEC-01 | 201, 400, 401, 422 |

Todos os **12 endpoints** e todos os **códigos de resposta documentados no Swagger** estão cobertos.

### 4.2 Requisito → casos

| Requisito | Casos | Total |
|---|---|---|
| RF01 Cadastro | AUTH-01 a AUTH-10 | 10 |
| RF02 Login | AUTH-11 a AUTH-15, SEC-04 | 6 |
| RF03 Autenticação | USR-01, SEC-01 a SEC-07 | 8 |
| F3 Produtos | PRD-01 a PRD-04 | 4 |
| RN01 Desconto em dinheiro | CHK-01 a CHK-04, CHK-12, CHK-13 | 6 |
| RN02 Estoque | CAR-02 a CAR-06, CAR-12, CHK-05, CHK-09, CHK-14, CHK-15 | 10 |
| RN03 Frete / VIP | USR-01, CHK-01 a CHK-04, CHK-10, CHK-11, CHK-16 | 8 |
| RF04 Quantidade | CAR-07 a CAR-09, CAR-11, CAR-14 | 5 |
| RF05 Pagamento inválido / carrinho vazio | CHK-06 a CHK-08, CHK-16 | 4 |
| RF06 Pós-compra | CHK-02, CHK-09, CHK-15 | 3 |
| RNF01 Formato de erro | SEC-09, GEN-01 a GEN-03 e todos os casos negativos | — |

### 4.3 Risco → casos

| Risco | Exposição | Casos |
|---|---|---|
| RP01 Cálculo incorreto do total | 6 | CHK-01 a CHK-04, CHK-12, CHK-13 |
| RP02 Transição VIP no momento errado | 6 | CHK-10, CHK-11 |
| RP03 Concorrência no checkout | 6 | CHK-15 |
| RP04 Estoque no carrinho | 6 | CAR-02, CAR-04 a CAR-06, CAR-12, CHK-14 |
| RP05 Acesso sem autenticação | 3 | AUTH-11 a AUTH-13, SEC-01 a SEC-08 |
| RP07 Entradas inválidas | 4 | AUTH-02, AUTH-07 a AUTH-09, SEC-09, PRD-03, CAR-07, CAR-08, CAR-10, GEN-03 |
| RP08 Divergência Swagger × implementação | 4 | PRD-01, PRD-02, CAR-16, GEN-04 |

### 4.4 Casos selecionados para automação (JavaScript)

| Caso | Motivo da escolha |
|---|---|
| CT-API-AUTH-11 | Pré-requisito de todas as rotas protegidas; valida o contrato do token (validade de 2 horas) |
| CT-API-CAR-04 | Regra RN02 com valor-limite; risco RP04 (exposição 6) |
| CT-API-CHK-02 | Fluxo de compra completo com a regra RN01 e os efeitos pós-compra; risco RP01 (exposição 6) |

> Candidato extra recomendado: **CT-API-CHK-15** (concorrência), difícil de executar manualmente e ligado ao risco RP03.
