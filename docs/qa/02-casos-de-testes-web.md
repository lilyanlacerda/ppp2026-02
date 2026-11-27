# 🌐 Casos de Teste Web — Loja PPP

> Documento estruturado conforme a **ISO/IEC/IEEE 29119-3:2021**: *Test Design Specification* (seção 2) e *Test Case Specification* (seção 3). Os casos derivam do [Plano de Testes](01-plano-de-testes.md) (`PT-LOJAPPP-001`).

⬅️ [Índice da documentação de QA](README.md)

---

## 1. Visão geral

### 1.1 Identificação do documento

| Item | Valor |
|---|---|
| **Identificador** | `ECT-LOJAPPP-WEB-001` |
| **Título** | Especificação de Projeto e Casos de Teste Web — Loja PPP |
| **Versão** | 1.0 |
| **Data** | 26/11/2026 |
| **Status** | Em revisão |
| **Autora** | Lilyan Lacerda (QA) |
| **Aprovador** | Product Owner do projeto |
| **Item de teste** | IT-02 — Site Web (`public/`), versão 1.0.0, commit `f134da6` |

### 1.2 Histórico de alterações

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.0 | 26/11/2026 | Lilyan Lacerda | Versão inicial: 5 conjuntos de funcionalidades, 31 condições de teste e 46 casos de teste |

### 1.3 Referências

| ID | Referência |
|---|---|
| [REF-01] | [Plano de Testes `PT-LOJAPPP-001`](01-plano-de-testes.md): requisitos (3.3.2), riscos (5), técnicas (6.3) e dados (6.6) |
| [REF-02] | [Documentação da aplicação](../aplicacao.md): regras de negócio e dados de teste |
| [REF-03] | ISO/IEC/IEEE 29119-3:2021 e 29119-4:2021 |

### 1.4 Ambiente e pré-condições gerais

Válidas para **todos** os casos, salvo indicação contrária:

- Aplicação iniciada com `npm start` e acessível em http://localhost:3030. Testes que alteram estado (checkout, VIP, estoque) partem de uma aplicação **recém-iniciada** (dados do *seed*).
- Navegador Chrome (versão estável), janela de 1280 × 800, `localStorage` e `sessionStorage` limpos no início de cada caso.
- Senha de todas as personas: `123456`.
- Valores monetários exibidos no formato brasileiro (`R$ 1.234,56`).

---

## 2. Especificação de projeto de teste

### 2.1 Conjuntos de funcionalidades

| ID | Conjunto | Páginas | Requisitos | Riscos |
|---|---|---|---|---|
| FS-WEB-01 | Cadastro | `/cadastro` | RF01 | RP07, RP10 |
| FS-WEB-02 | Login e sessão | `/login`, cabeçalho, rotas protegidas | RF02, RF03 | RP05, RP06 |
| FS-WEB-03 | Vitrine de produtos | `/` | F3, RN02 | RP04 |
| FS-WEB-04 | Carrinho | `/`, `/carrinho` | RN02, RF04 | RP04, RP07 |
| FS-WEB-05 | Finalização de compra | `/carrinho`, `/pedido` | RN01, RN02, RN03, RF05, RF06 | RP01, RP02, RP03 |

### 2.2 Condições de teste

Prioridade herdada da exposição ao risco do plano: **Alta** (exposição 6 a 9), **Média** (3 a 4), **Baixa** (1 a 2).

| ID | Condição de teste | Conjunto | Origem | Técnica (29119-4) | Prioridade |
|---|---|---|---|---|---|
| TCOND-WEB-01 | Cadastro com dados válidos cria a conta e leva ao login | FS-WEB-01 | RF01 | Teste de cenário | Alta |
| TCOND-WEB-02 | Senha e confirmação precisam ser iguais | FS-WEB-01 | Interface | Particionamento de equivalência | Média |
| TCOND-WEB-03 | E-mail já cadastrado é recusado | FS-WEB-01 | RF01 | Particionamento de equivalência | Alta |
| TCOND-WEB-04 | Nome precisa ter no mínimo 2 caracteres | FS-WEB-01 | RF01 | Análise de valor-limite | Média |
| TCOND-WEB-05 | Senha precisa ter no mínimo 6 caracteres | FS-WEB-01 | RF01 | Análise de valor-limite | Média |
| TCOND-WEB-06 | E-mail precisa ter formato válido | FS-WEB-01 | RF01 | Particionamento de equivalência | Média |
| TCOND-WEB-07 | Entradas vazias ou só com espaços são recusadas | FS-WEB-01 | RF01, RP10 | Suposição de erro | Baixa |
| TCOND-WEB-08 | E-mail não diferencia maiúsculas de minúsculas | FS-WEB-01 | RF01 | Particionamento de equivalência | Baixa |
| TCOND-WEB-09 | Login com credenciais válidas autentica e identifica o cliente | FS-WEB-02 | RF02 | Teste de cenário | Alta |
| TCOND-WEB-10 | Credenciais inválidas são recusadas sem revelar qual campo errou | FS-WEB-02 | RF02, RP05 | Particionamento de equivalência | Alta |
| TCOND-WEB-11 | Campos de login são obrigatórios | FS-WEB-02 | RF02 | Particionamento de equivalência | Média |
| TCOND-WEB-12 | Páginas protegidas exigem login e retornam à página de origem | FS-WEB-02 | RF03 | Teste de cenário | Alta |
| TCOND-WEB-13 | Logout encerra a sessão | FS-WEB-02 | RF03 | Teste de cenário | Média |
| TCOND-WEB-14 | Sessão inválida ou expirada leva ao login com aviso | FS-WEB-02 | RF03, RP05 | Particionamento de equivalência | Média |
| TCOND-WEB-15 | Redirecionamento pós-login não leva para fora do site | FS-WEB-02 | RP06 | Suposição de erro | Média |
| TCOND-WEB-16 | Vitrine exibe todos os produtos com nome, descrição, preço e estoque | FS-WEB-03 | F3 | Teste de cenário | Média |
| TCOND-WEB-17 | Produto sem estoque não pode ser adicionado | FS-WEB-03 | RN02 | Particionamento de equivalência | Alta |
| TCOND-WEB-18 | Cliente logado adiciona produto ao carrinho | FS-WEB-04 | RN02 | Teste de cenário | Alta |
| TCOND-WEB-19 | Adicionar ao carrinho exige login | FS-WEB-04 | RF03 | Teste de cenário | Média |
| TCOND-WEB-20 | Quantidade total no carrinho não pode passar do estoque | FS-WEB-04 | RN02 | Análise de valor-limite | Alta |
| TCOND-WEB-21 | Alteração de quantidade recalcula os valores | FS-WEB-04 | RN02, RF04 | Teste de cenário | Média |
| TCOND-WEB-22 | Quantidade inválida no carrinho é recusada | FS-WEB-04 | RF04 | Análise de valor-limite | Média |
| TCOND-WEB-23 | Remoção de itens e estado de carrinho vazio | FS-WEB-04 | F4 | Teste de cenário | Média |
| TCOND-WEB-24 | Carrinho é mantido entre sessões do mesmo cliente | FS-WEB-04 | F4 | Teste de cenário | Baixa |
| TCOND-WEB-25 | Total = subtotal − desconto + frete para cada combinação VIP × pagamento | FS-WEB-05 | RN01, RN03 | Teste de tabela de decisão | Alta |
| TCOND-WEB-26 | Troca da forma de pagamento recalcula o resumo | FS-WEB-05 | RN01 | Teste de cenário | Média |
| TCOND-WEB-27 | Compra finalizada mostra o pedido, esvazia o carrinho e baixa o estoque | FS-WEB-05 | RF06, RN02 | Teste de cenário | Alta |
| TCOND-WEB-28 | Cliente vira VIP ao atingir R$ 300,00; a compra que atinge ainda paga frete | FS-WEB-05 | RN03 | Transição de estado; Valor-limite | Alta |
| TCOND-WEB-29 | Valores com centavos são arredondados corretamente | FS-WEB-05 | RN01 | Análise de valor-limite | Média |
| TCOND-WEB-30 | Estoque é revalidado no momento da finalização | FS-WEB-05 | RN02 | Suposição de erro | Alta |
| TCOND-WEB-31 | Finalização não é duplicada por cliques repetidos | FS-WEB-05 | RP03 | Suposição de erro | Alta |

---

## 3. Especificação de casos de teste

### 3.1 Resumo

Legenda: 🤖 = selecionado para automação com Cypress ([doc 05](05-automacao-web-cypress.md)). Status de execução: ⏳ Não executado (os resultados de execução são registrados no [Report de Bugs](04-report-de-bugs.md) e no [Relatório de Conclusão](08-relatorio-de-conclusao.md)).

| ID | Título | Condição | Prioridade | Execução |
|---|---|---|---|---|
| CT-WEB-CAD-01 | Cadastrar cliente com dados válidos | TCOND-WEB-01 | Alta | ⏳ |
| CT-WEB-CAD-02 | Recusar cadastro com senha e confirmação diferentes | TCOND-WEB-02 | Média | ⏳ |
| CT-WEB-CAD-03 | Recusar cadastro com e-mail já cadastrado | TCOND-WEB-03 | Alta | ⏳ |
| CT-WEB-CAD-04 | Recusar nome com 1 caractere | TCOND-WEB-04 | Média | ⏳ |
| CT-WEB-CAD-05 | Aceitar nome com 2 caracteres | TCOND-WEB-04 | Média | ⏳ |
| CT-WEB-CAD-06 | Recusar senha com 5 caracteres | TCOND-WEB-05 | Média | ⏳ |
| CT-WEB-CAD-07 | Aceitar senha com 6 caracteres | TCOND-WEB-05 | Média | ⏳ |
| CT-WEB-CAD-08 | Recusar e-mail sem domínio | TCOND-WEB-06 | Média | ⏳ |
| CT-WEB-CAD-09 | Recusar cadastro com campos vazios | TCOND-WEB-07 | Baixa | ⏳ |
| CT-WEB-CAD-10 | Recusar senha formada só por espaços | TCOND-WEB-07 | Baixa | ⏳ |
| CT-WEB-CAD-11 | Cadastrar com e-mail em maiúsculas e entrar com minúsculas | TCOND-WEB-08 | Baixa | ⏳ |
| CT-WEB-LOG-01 🤖 | Entrar com credenciais válidas | TCOND-WEB-09 | Alta | ⏳ |
| CT-WEB-LOG-02 | Exibir selo VIP no cabeçalho para cliente VIP | TCOND-WEB-09 | Média | ⏳ |
| CT-WEB-LOG-03 | Recusar senha incorreta | TCOND-WEB-10 | Alta | ⏳ |
| CT-WEB-LOG-04 | Recusar e-mail não cadastrado com a mesma mensagem | TCOND-WEB-10 | Média | ⏳ |
| CT-WEB-LOG-05 | Recusar login com campos vazios | TCOND-WEB-11 | Média | ⏳ |
| CT-WEB-LOG-06 | Exigir login no carrinho e voltar para ele após entrar | TCOND-WEB-12 | Alta | ⏳ |
| CT-WEB-LOG-07 | Sair da conta | TCOND-WEB-13 | Média | ⏳ |
| CT-WEB-LOG-08 | Redirecionar para o login quando a sessão é inválida | TCOND-WEB-14 | Média | ⏳ |
| CT-WEB-LOG-09 | Não redirecionar para site externo após o login | TCOND-WEB-15 | Média | ⏳ |
| CT-WEB-PRD-01 | Exibir a vitrine com todos os produtos | TCOND-WEB-16 | Média | ⏳ |
| CT-WEB-PRD-02 | Bloquear a compra de produto sem estoque | TCOND-WEB-17 | Alta | ⏳ |
| CT-WEB-PRD-03 | Exibir a vitrine para visitante não logado | TCOND-WEB-16 | Baixa | ⏳ |
| CT-WEB-CAR-01 | Adicionar produto ao carrinho | TCOND-WEB-18 | Alta | ⏳ |
| CT-WEB-CAR-02 | Exigir login ao adicionar produto | TCOND-WEB-19 | Média | ⏳ |
| CT-WEB-CAR-03 | Bloquear na vitrine quantidade acima do estoque | TCOND-WEB-20 | Média | ⏳ |
| CT-WEB-CAR-04 🤖 | Recusar adição que faz o carrinho passar do estoque | TCOND-WEB-20 | Alta | ⏳ |
| CT-WEB-CAR-05 | Aceitar quantidade igual ao estoque | TCOND-WEB-20 | Alta | ⏳ |
| CT-WEB-CAR-06 | Exibir carrinho vazio | TCOND-WEB-23 | Baixa | ⏳ |
| CT-WEB-CAR-07 | Alterar quantidade e recalcular os totais | TCOND-WEB-21 | Média | ⏳ |
| CT-WEB-CAR-08 | Recusar no carrinho quantidade acima do estoque | TCOND-WEB-20 | Alta | ⏳ |
| CT-WEB-CAR-09 | Recusar quantidade zero no carrinho | TCOND-WEB-22 | Média | ⏳ |
| CT-WEB-CAR-10 | Remover itens do carrinho | TCOND-WEB-23 | Média | ⏳ |
| CT-WEB-CAR-11 | Manter o carrinho após sair e entrar de novo | TCOND-WEB-24 | Baixa | ⏳ |
| CT-WEB-CHK-01 | Calcular total de não VIP pagando com cartão | TCOND-WEB-25 | Alta | ⏳ |
| CT-WEB-CHK-02 🤖 | Finalizar compra de não VIP em dinheiro com desconto | TCOND-WEB-25, 27 | Alta | ⏳ |
| CT-WEB-CHK-03 | Calcular total de VIP pagando com cartão | TCOND-WEB-25 | Alta | ⏳ |
| CT-WEB-CHK-04 | Calcular total de VIP pagando em dinheiro | TCOND-WEB-25 | Alta | ⏳ |
| CT-WEB-CHK-05 | Recalcular o resumo ao trocar a forma de pagamento | TCOND-WEB-26 | Média | ⏳ |
| CT-WEB-CHK-06 | Esvaziar o carrinho e baixar o estoque após a compra | TCOND-WEB-27 | Alta | ⏳ |
| CT-WEB-CHK-07 | Tornar o cliente VIP na compra que atinge R$ 300,00 | TCOND-WEB-28 | Alta | ⏳ |
| CT-WEB-CHK-08 | Informar quanto falta para virar VIP | TCOND-WEB-28 | Média | ⏳ |
| CT-WEB-CHK-09 | Arredondar o desconto de produto com centavos | TCOND-WEB-29 | Média | ⏳ |
| CT-WEB-CHK-10 | Recusar a finalização quando o estoque acabou depois da adição | TCOND-WEB-30 | Alta | ⏳ |
| CT-WEB-CHK-11 | Gerar um único pedido com clique duplo em "Finalizar compra" | TCOND-WEB-31 | Alta | ⏳ |
| CT-WEB-CHK-12 | Acessar a página de pedido sem ter comprado | TCOND-WEB-27 | Baixa | ⏳ |

**Distribuição:** 46 casos · Alta: 18 · Média: 21 · Baixa: 7.

---

### 3.2 FS-WEB-01 — Cadastro

#### CT-WEB-CAD-01 — Cadastrar cliente com dados válidos

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que um visitante consegue criar uma conta e é levado ao login |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF01 · RP10 · TCOND-WEB-01 |
| **Pré-condições** | E-mail `qa.web+<timestamp>@email.com` ainda não cadastrado |
| **Dados de entrada** | Nome: `Lilyan QA` · E-mail: `qa.web+<timestamp>@email.com` · Senha: `senha123` · Confirmar senha: `senha123` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro` | Formulário "Criar conta" exibido com os campos Nome, E-mail, Senha e Confirmar senha |
| 2 | Preencher os campos com os dados de entrada | Campos preenchidos; a senha aparece mascarada |
| 3 | Clicar em **Cadastrar** | Redireciona para `/login?cadastro=ok` com a mensagem de sucesso "Cadastro realizado! Faça login para continuar." |
| 4 | Entrar com o e-mail e a senha cadastrados | Login realizado; cabeçalho exibe "Olá, Lilyan" |

#### CT-WEB-CAD-02 — Recusar cadastro com senha e confirmação diferentes

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o site impede o cadastro quando a confirmação de senha não confere |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-WEB-02 |
| **Pré-condições** | — |
| **Dados de entrada** | Nome: `Lilyan QA` · E-mail: `qa.web+<timestamp>@email.com` · Senha: `senha123` · Confirmar senha: `senha321` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro` e preencher os dados de entrada | Campos preenchidos |
| 2 | Clicar em **Cadastrar** | Mensagem de erro "As senhas não conferem."; permanece em `/cadastro`; nenhuma conta é criada |

#### CT-WEB-CAD-03 — Recusar cadastro com e-mail já cadastrado

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que não é possível criar duas contas com o mesmo e-mail |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF01 · RP07 · TCOND-WEB-03 |
| **Pré-condições** | Persona Ana cadastrada (*seed*) |
| **Dados de entrada** | Nome: `Outra Ana` · E-mail: `ana@email.com` · Senha e confirmação: `senha123` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro` e preencher os dados de entrada | Campos preenchidos |
| 2 | Clicar em **Cadastrar** | Mensagem de erro "Já existe um usuário cadastrado com este e-mail."; permanece em `/cadastro`; o botão volta a ficar habilitado |

#### CT-WEB-CAD-04 — Recusar nome com 1 caractere

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o limite inferior inválido do nome (valor-limite: 1) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-WEB-04 |
| **Pré-condições** | — |
| **Dados de entrada** | Nome: `L` · E-mail: `qa.web+<timestamp>@email.com` · Senha e confirmação: `senha123` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro`, preencher os dados e clicar em **Cadastrar** | Mensagem de erro "Informe um nome com pelo menos 2 caracteres."; nenhuma conta é criada |

#### CT-WEB-CAD-05 — Aceitar nome com 2 caracteres

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o limite inferior válido do nome (valor-limite: 2) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-WEB-04 |
| **Pré-condições** | — |
| **Dados de entrada** | Nome: `Li` · E-mail: `qa.web+<timestamp>@email.com` · Senha e confirmação: `senha123` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro`, preencher os dados e clicar em **Cadastrar** | Redireciona para `/login?cadastro=ok` com "Cadastro realizado! Faça login para continuar." |

#### CT-WEB-CAD-06 — Recusar senha com 5 caracteres

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o limite inválido da senha (valor-limite: 5) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-WEB-05 |
| **Pré-condições** | — |
| **Dados de entrada** | Nome: `Lilyan QA` · E-mail: `qa.web+<timestamp>@email.com` · Senha e confirmação: `12345` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro`, preencher os dados e clicar em **Cadastrar** | Mensagem de erro "A senha deve ter pelo menos 6 caracteres."; nenhuma conta é criada |

#### CT-WEB-CAD-07 — Aceitar senha com 6 caracteres

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o limite válido da senha (valor-limite: 6) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · TCOND-WEB-05 |
| **Pré-condições** | — |
| **Dados de entrada** | Nome: `Lilyan QA` · E-mail: `qa.web+<timestamp>@email.com` · Senha e confirmação: `123456` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro`, preencher os dados e clicar em **Cadastrar** | Redireciona para `/login?cadastro=ok` com a mensagem de sucesso |

#### CT-WEB-CAD-08 — Recusar e-mail sem domínio

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que e-mail em formato inválido é recusado |
| **Prioridade** | Média |
| **Rastreabilidade** | RF01 · RP07 · TCOND-WEB-06 |
| **Pré-condições** | — |
| **Dados de entrada** | Nome: `Lilyan QA` · E-mail: `lilyan@` · Senha e confirmação: `senha123` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro`, preencher os dados e clicar em **Cadastrar** | Mensagem de erro "Informe um e-mail válido."; nenhuma conta é criada |

#### CT-WEB-CAD-09 — Recusar cadastro com campos vazios

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o formulário vazio não cria conta |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF01 · RP10 · TCOND-WEB-07 |
| **Pré-condições** | — |
| **Dados de entrada** | Todos os campos vazios |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro` e clicar em **Cadastrar** sem preencher nada | Mensagem de erro "Informe um nome com pelo menos 2 caracteres."; nenhuma conta é criada |

#### CT-WEB-CAD-10 — Recusar senha formada só por espaços

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que uma senha sem nenhum caractere visível não é aceita (suposição de erro) |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF01 · RP10 · TCOND-WEB-07 |
| **Pré-condições** | — |
| **Dados de entrada** | Nome: `Lilyan QA` · E-mail: `qa.web+<timestamp>@email.com` · Senha e confirmação: 6 espaços (`      `) |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/cadastro`, preencher os dados e clicar em **Cadastrar** | Cadastro recusado com mensagem de senha inválida; nenhuma conta é criada |

> **Observação:** o requisito RF01 só define o tamanho mínimo. O resultado esperado segue a boa prática de não aceitar senha em branco; a divergência deve ser confirmada com o PO.

#### CT-WEB-CAD-11 — Cadastrar com e-mail em maiúsculas e entrar com minúsculas

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o e-mail é tratado sem diferenciar maiúsculas de minúsculas |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF01 · TCOND-WEB-08 |
| **Pré-condições** | — |
| **Dados de entrada** | E-mail no cadastro: `QA.Web+<timestamp>@Email.com` · E-mail no login: `qa.web+<timestamp>@email.com` · Senha: `senha123` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Cadastrar com o e-mail em maiúsculas | Redireciona para `/login?cadastro=ok` |
| 2 | Entrar com o mesmo e-mail em minúsculas | Login realizado com sucesso |
| 3 | Tentar cadastrar de novo com o e-mail em minúsculas | Mensagem "Já existe um usuário cadastrado com este e-mail." |

---

### 3.3 FS-WEB-02 — Login e sessão

#### CT-WEB-LOG-01 🤖 — Entrar com credenciais válidas

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o cliente entra com e-mail e senha corretos e é identificado no cabeçalho |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF02 · RP05 · TCOND-WEB-09 |
| **Pré-condições** | Persona Ana cadastrada |
| **Dados de entrada** | E-mail: `ana@email.com` · Senha: `123456` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/login` | Formulário "Entrar" exibido; cabeçalho mostra "Produtos", "Entrar" e "Cadastrar" |
| 2 | Preencher e-mail e senha e clicar em **Entrar** | Redireciona para `/` (vitrine) |
| 3 | Observar o cabeçalho | Exibe "Produtos", "Carrinho", "Olá, Ana" e "Sair"; sem selo VIP |

#### CT-WEB-LOG-02 — Exibir selo VIP no cabeçalho para cliente VIP

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o cliente VIP é identificado com o selo no cabeçalho |
| **Prioridade** | Média |
| **Rastreabilidade** | RN03 · TCOND-WEB-09 |
| **Pré-condições** | Persona Carla (VIP) cadastrada |
| **Dados de entrada** | E-mail: `carla@email.com` · Senha: `123456` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Entrar com as credenciais da Carla | Redireciona para `/`; o cabeçalho exibe "Olá, Carla" com o selo **VIP** |

#### CT-WEB-LOG-03 — Recusar senha incorreta

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que senha errada não autentica |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF02 · RP05 · TCOND-WEB-10 |
| **Pré-condições** | Persona Ana cadastrada |
| **Dados de entrada** | E-mail: `ana@email.com` · Senha: `senhaerrada` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/login`, preencher os dados e clicar em **Entrar** | Mensagem de erro "E-mail ou senha inválidos."; permanece em `/login`; nenhum token salvo no `localStorage` |

#### CT-WEB-LOG-04 — Recusar e-mail não cadastrado com a mesma mensagem

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o site não revela se o e-mail existe (mesma mensagem da senha incorreta) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF02 · RP05 · TCOND-WEB-10 |
| **Pré-condições** | — |
| **Dados de entrada** | E-mail: `naoexiste@email.com` · Senha: `123456` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/login`, preencher os dados e clicar em **Entrar** | Mensagem "E-mail ou senha inválidos.", idêntica à do CT-WEB-LOG-03 |

#### CT-WEB-LOG-05 — Recusar login com campos vazios

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que e-mail e senha são obrigatórios |
| **Prioridade** | Média |
| **Rastreabilidade** | RF02 · TCOND-WEB-11 |
| **Pré-condições** | — |
| **Dados de entrada** | (a) ambos vazios · (b) e-mail `ana@email.com` e senha vazia · (c) e-mail com espaços `   ` e senha `123456` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Para cada combinação de entrada, clicar em **Entrar** | Mensagem "Informe e-mail e senha."; nenhuma requisição de login é enviada |

#### CT-WEB-LOG-06 — Exigir login no carrinho e voltar para ele após entrar

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a página protegida exige login e que, após entrar, o cliente volta à página que pediu |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF03 · RP05 · TCOND-WEB-12 |
| **Pré-condições** | Visitante não logado |
| **Dados de entrada** | E-mail: `ana@email.com` · Senha: `123456` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/carrinho` diretamente pela URL | Redireciona para `/login?voltar=%2Fcarrinho` |
| 2 | Entrar com as credenciais | Redireciona de volta para `/carrinho` |

#### CT-WEB-LOG-07 — Sair da conta

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o logout encerra a sessão no navegador |
| **Prioridade** | Média |
| **Rastreabilidade** | RF03 · TCOND-WEB-13 |
| **Pré-condições** | Ana logada |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Clicar em **Sair** no cabeçalho | Redireciona para `/`; o cabeçalho volta a exibir "Entrar" e "Cadastrar"; `ecommerce_token` removido do `localStorage` |
| 2 | Acessar `/carrinho` | Redireciona para `/login?voltar=%2Fcarrinho` |

#### CT-WEB-LOG-08 — Redirecionar para o login quando a sessão é inválida

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o tratamento de token inválido ou expirado |
| **Prioridade** | Média |
| **Rastreabilidade** | RF03 · RP05 · TCOND-WEB-14 |
| **Pré-condições** | Ana logada |
| **Dados de entrada** | Token adulterado: `abc` |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | No DevTools, alterar `ecommerce_token` no `localStorage` para `abc` | Valor alterado |
| 2 | Acessar `/carrinho` | Redireciona para `/login?expirado=1` com o aviso "Sua sessão expirou. Faça login novamente."; a sessão local é apagada |

#### CT-WEB-LOG-09 — Não redirecionar para site externo após o login

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o parâmetro `voltar` não pode ser usado para levar o cliente a outro domínio (*open redirect*) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF03 · RP06 · TCOND-WEB-15 |
| **Pré-condições** | Visitante não logado |
| **Dados de entrada** | URLs: (a) `/login?voltar=https://example.com` · (b) `/login?voltar=//example.com` · (c) `/login?voltar=/%5Cexample.com` (equivale a `/\example.com`) · Credenciais da Ana |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Para cada URL, acessar a página e entrar com as credenciais da Ana | Em todos os casos o cliente é levado para `/` em `localhost:3030`; nunca para `example.com` |

---

### 3.4 FS-WEB-03 — Vitrine de produtos

#### CT-WEB-PRD-01 — Exibir a vitrine com todos os produtos

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a vitrine lista os produtos com as informações corretas |
| **Prioridade** | Média |
| **Rastreabilidade** | F3 · TCOND-WEB-16 |
| **Pré-condições** | Aplicação recém-iniciada |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/` | Título "Produtos" e o texto "Pague em dinheiro e ganhe 10% de desconto. Clientes VIP têm frete grátis." |
| 2 | Conferir os cards | 3 produtos em ordem alfabética: **Monitor 24" Full HD** (R$ 899,00, "Sem estoque"), **Mouse Sem Fio** (R$ 89,90, "5 em estoque") e **Teclado Mecânico** (R$ 250,00, "10 em estoque"), cada um com descrição |

#### CT-WEB-PRD-02 — Bloquear a compra de produto sem estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que produto com estoque 0 não pode ir para o carrinho |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-WEB-17 |
| **Pré-condições** | Ana logada |
| **Dados de entrada** | Produto: Monitor 24" Full HD |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/` e localizar o card do Monitor | Card exibe "Sem estoque" em destaque |
| 2 | Tentar alterar a quantidade e clicar em **Adicionar ao carrinho** | Campo de quantidade e botão estão **desabilitados**; nada é adicionado |

#### CT-WEB-PRD-03 — Exibir a vitrine para visitante não logado

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a vitrine é pública |
| **Prioridade** | Baixa |
| **Rastreabilidade** | F3 · TCOND-WEB-16 |
| **Pré-condições** | Visitante não logado |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/` | Os 3 produtos são exibidos; o cabeçalho mostra "Produtos", "Entrar" e "Cadastrar"; não há redirecionamento para o login |

---

### 3.5 FS-WEB-04 — Carrinho

#### CT-WEB-CAR-01 — Adicionar produto ao carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o cliente logado adiciona um produto com estoque |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-WEB-18 |
| **Pré-condições** | Ana logada; carrinho vazio |
| **Dados de entrada** | Produto: Teclado Mecânico · Quantidade: 1 |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/`, clicar em **Adicionar ao carrinho** no card do Teclado | Mensagem de sucesso "Produto adicionado ao carrinho. Itens no carrinho: 1." no topo da página |
| 2 | Acessar `/carrinho` | Linha "Teclado Mecânico", preço R$ 250,00, quantidade 1, total R$ 250,00 |

#### CT-WEB-CAR-02 — Exigir login ao adicionar produto

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o visitante é levado ao login ao tentar adicionar um produto |
| **Prioridade** | Média |
| **Rastreabilidade** | RF03 · TCOND-WEB-19 |
| **Pré-condições** | Visitante não logado |
| **Dados de entrada** | Produto: Teclado Mecânico |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/`, clicar em **Adicionar ao carrinho** no card do Teclado | Redireciona para `/login?voltar=%2F` |
| 2 | Entrar com as credenciais da Ana | Redireciona para `/`; o produto **não** foi adicionado automaticamente |

#### CT-WEB-CAR-03 — Bloquear na vitrine quantidade acima do estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a validação da quantidade no card do produto (valor-limite: estoque + 1) |
| **Prioridade** | Média |
| **Rastreabilidade** | RN02 · RP04 · TCOND-WEB-20 |
| **Pré-condições** | Ana logada; carrinho vazio |
| **Dados de entrada** | Produto: Mouse Sem Fio (estoque 5) · Quantidade: 6 |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | No card do Mouse, informar quantidade 6 e clicar em **Adicionar ao carrinho** | O navegador bloqueia o envio com a validação nativa do campo ("O valor deve ser menor ou igual a 5", texto conforme o idioma do navegador); nada é adicionado |

#### CT-WEB-CAR-04 🤖 — Recusar adição que faz o carrinho passar do estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a **soma** das quantidades no carrinho não ultrapassa o estoque |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-WEB-20 |
| **Pré-condições** | Ana logada; carrinho vazio; aplicação recém-iniciada |
| **Dados de entrada** | Produto: Mouse Sem Fio (estoque 5) · 1ª adição: 5 · 2ª adição: 1 |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | No card do Mouse, informar 5 e clicar em **Adicionar ao carrinho** | "Produto adicionado ao carrinho. Itens no carrinho: 5." |
| 2 | Informar 1 e clicar em **Adicionar ao carrinho** novamente | Mensagem de erro: `Estoque insuficiente para "Mouse Sem Fio". Disponível: 5.` |
| 3 | Acessar `/carrinho` | Mouse Sem Fio com quantidade **5** (inalterada) |

#### CT-WEB-CAR-05 — Aceitar quantidade igual ao estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o limite válido de quantidade (valor-limite: igual ao estoque) |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · TCOND-WEB-20 |
| **Pré-condições** | Ana logada; carrinho vazio; aplicação recém-iniciada |
| **Dados de entrada** | Produto: Mouse Sem Fio · Quantidade: 5 |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | No card do Mouse, informar 5 e clicar em **Adicionar ao carrinho** | "Produto adicionado ao carrinho. Itens no carrinho: 5." |
| 2 | Acessar `/carrinho` | Mouse com quantidade 5 e total R$ 449,50 |

#### CT-WEB-CAR-06 — Exibir carrinho vazio

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o estado de carrinho vazio |
| **Prioridade** | Baixa |
| **Rastreabilidade** | F4 · TCOND-WEB-23 |
| **Pré-condições** | Ana logada; carrinho vazio |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/carrinho` | Mensagem "Seu carrinho está vazio." e botão **Ver produtos**; tabela e resumo não são exibidos |
| 2 | Clicar em **Ver produtos** | Redireciona para `/` |

#### CT-WEB-CAR-07 — Alterar quantidade e recalcular os totais

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que alterar a quantidade atualiza o total da linha e o resumo |
| **Prioridade** | Média |
| **Rastreabilidade** | RN02 · RF04 · TCOND-WEB-21 |
| **Pré-condições** | Ana logada; carrinho com 1 Teclado Mecânico; pagamento "Cartão de crédito" selecionado |
| **Dados de entrada** | Nova quantidade: 2 |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, alterar a quantidade do Teclado para 2 e sair do campo | Total da linha passa para R$ 500,00 |
| 2 | Conferir o resumo | Subtotal R$ 500,00 · Frete R$ 20,00 · Total R$ 520,00 |

#### CT-WEB-CAR-08 — Recusar no carrinho quantidade acima do estoque

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que a alteração de quantidade no carrinho respeita o estoque |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-WEB-20 |
| **Pré-condições** | Ana logada; carrinho com 2 Mouse Sem Fio; aplicação recém-iniciada |
| **Dados de entrada** | Nova quantidade: 9 |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, digitar 9 na quantidade do Mouse e sair do campo | Mensagem de erro: `Estoque insuficiente para "Mouse Sem Fio". Disponível: 5.` |
| 2 | Conferir a linha do Mouse | Quantidade volta para **2**; totais inalterados |

#### CT-WEB-CAR-09 — Recusar quantidade zero no carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o limite inferior inválido de quantidade (valor-limite: 0) |
| **Prioridade** | Média |
| **Rastreabilidade** | RF04 · RP07 · TCOND-WEB-22 |
| **Pré-condições** | Ana logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | Nova quantidade: 0 |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, digitar 0 na quantidade do Teclado e sair do campo | Mensagem de erro "A quantidade deve ser um número inteiro maior ou igual a 1."; quantidade volta para 1 |

#### CT-WEB-CAR-10 — Remover itens do carrinho

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a remoção de itens e a transição para carrinho vazio |
| **Prioridade** | Média |
| **Rastreabilidade** | F4 · TCOND-WEB-23 |
| **Pré-condições** | Ana logada; carrinho com 1 Teclado Mecânico e 1 Mouse Sem Fio |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Clicar em **Remover** na linha do Mouse | A linha do Mouse some; resumo passa a Subtotal R$ 250,00 |
| 2 | Clicar em **Remover** na linha do Teclado | Exibe "Seu carrinho está vazio." |

#### CT-WEB-CAR-11 — Manter o carrinho após sair e entrar de novo

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o carrinho é salvo no servidor, não apenas no navegador |
| **Prioridade** | Baixa |
| **Rastreabilidade** | F4 · TCOND-WEB-24 |
| **Pré-condições** | Ana logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Clicar em **Sair** e entrar novamente com as credenciais da Ana | Login realizado |
| 2 | Acessar `/carrinho` | O Teclado Mecânico continua no carrinho com quantidade 1 |

---

### 3.6 FS-WEB-05 — Finalização de compra

Os casos CT-WEB-CHK-01 a 04 implementam a **tabela de decisão** do Plano de Testes (seção 6.3a), com 1 Teclado Mecânico (R$ 250,00):

| Caso | Regra | Cliente | Pagamento | Subtotal | Desconto | Frete | Total |
|---|---|---|---|---|---|---|---|
| CT-WEB-CHK-01 | R2 | Ana (não VIP) | Cartão | R$ 250,00 | R$ 0,00 | R$ 20,00 | **R$ 270,00** |
| CT-WEB-CHK-02 | R1 | Ana (não VIP) | Dinheiro | R$ 250,00 | R$ 25,00 | R$ 20,00 | **R$ 245,00** |
| CT-WEB-CHK-03 | R4 | Carla (VIP) | Cartão | R$ 250,00 | R$ 0,00 | Grátis | **R$ 250,00** |
| CT-WEB-CHK-04 | R3 | Carla (VIP) | Dinheiro | R$ 250,00 | R$ 25,00 | Grátis | **R$ 225,00** |

#### CT-WEB-CHK-01 — Calcular total de não VIP pagando com cartão

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a regra R2: sem desconto e com frete |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RP01 · TCOND-WEB-25 |
| **Pré-condições** | Ana logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | Pagamento: Cartão de crédito |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/carrinho` | "Cartão de crédito" vem selecionado por padrão |
| 2 | Conferir o resumo | Subtotal R$ 250,00 · Desconto (dinheiro) − R$ 0,00 · Frete R$ 20,00 · **Total R$ 270,00** |

#### CT-WEB-CHK-02 🤖 — Finalizar compra de não VIP em dinheiro com desconto

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a regra R1 de ponta a ponta: desconto de 10% só sobre os produtos, frete cobrado e pedido confirmado |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RF06 · RP01 · TCOND-WEB-25, TCOND-WEB-27 |
| **Pré-condições** | Ana logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | Pagamento: Dinheiro |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, selecionar **Dinheiro** | Resumo: Subtotal R$ 250,00 · Desconto − R$ 25,00 · Frete R$ 20,00 · **Total R$ 245,00** |
| 2 | Clicar em **Finalizar compra** | Redireciona para `/pedido` |
| 3 | Conferir a página do pedido | "Compra finalizada com sucesso!", "Pedido confirmado", "Pagamento: Dinheiro", item Teclado Mecânico × 1, Desconto − R$ 25,00, Frete R$ 20,00 e **Total pago R$ 245,00** |

#### CT-WEB-CHK-03 — Calcular total de VIP pagando com cartão

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a regra R4: frete grátis e sem desconto |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RP01 · TCOND-WEB-25 |
| **Pré-condições** | Carla logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | Pagamento: Cartão de crédito |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/carrinho` | Texto "VIP Você é cliente VIP: frete grátis em todas as compras." |
| 2 | Conferir o resumo | Subtotal R$ 250,00 · Desconto − R$ 0,00 · Frete **Grátis (VIP)** · **Total R$ 250,00** |

#### CT-WEB-CHK-04 — Calcular total de VIP pagando em dinheiro

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a regra R3: desconto e frete grátis acumulados |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN01 · RN03 · RP01 · TCOND-WEB-25 |
| **Pré-condições** | Carla logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | Pagamento: Dinheiro |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, selecionar **Dinheiro** | Subtotal R$ 250,00 · Desconto − R$ 25,00 · Frete **Grátis (VIP)** · **Total R$ 225,00** |
| 2 | Clicar em **Finalizar compra** | `/pedido` com **Total pago R$ 225,00** e Frete "Grátis (VIP)" |

#### CT-WEB-CHK-05 — Recalcular o resumo ao trocar a forma de pagamento

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que trocar o pagamento atualiza o resumo sem recarregar a página |
| **Prioridade** | Média |
| **Rastreabilidade** | RN01 · TCOND-WEB-26 |
| **Pré-condições** | Ana logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, selecionar **Dinheiro** | Total passa de R$ 270,00 para R$ 245,00; desconto − R$ 25,00 |
| 2 | Selecionar **Cartão de crédito** | Total volta para R$ 270,00; desconto − R$ 0,00 |

#### CT-WEB-CHK-06 — Esvaziar o carrinho e baixar o estoque após a compra

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar os efeitos da compra: carrinho vazio e estoque reduzido |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF06 · RN02 · TCOND-WEB-27 |
| **Pré-condições** | Ana logada; aplicação recém-iniciada; carrinho com 2 Teclados Mecânicos |
| **Dados de entrada** | Pagamento: Cartão de crédito |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, clicar em **Finalizar compra** | `/pedido` exibe o pedido com Teclado Mecânico × 2 e Total pago R$ 520,00 |
| 2 | Acessar `/carrinho` | "Seu carrinho está vazio." |
| 3 | Acessar `/` | Card do Teclado exibe "**8** em estoque" (era 10) |

#### CT-WEB-CHK-07 — Tornar o cliente VIP na compra que atinge R$ 300,00

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a transição Não VIP → VIP: a compra que atinge o limite ainda paga frete e a seguinte é grátis |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN03 · RP02 · TCOND-WEB-28 |
| **Pré-condições** | Aplicação recém-iniciada; Bruno logado (R$ 280,00 gastos, não VIP); carrinho com 1 Mouse Sem Fio |
| **Dados de entrada** | Pagamento: Cartão de crédito |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, conferir o resumo | Subtotal R$ 89,90 · Frete **R$ 20,00** · Total **R$ 109,90** |
| 2 | Clicar em **Finalizar compra** | `/pedido` exibe "**Parabéns!** Você se tornou cliente VIP e terá frete grátis nas próximas compras." e Total pago R$ 109,90 |
| 3 | Observar o cabeçalho | "Olá, Bruno" com o selo **VIP** |
| 4 | Adicionar 1 Teclado e acessar `/carrinho` | Texto de cliente VIP; Frete **Grátis (VIP)**; Total R$ 250,00 |

#### CT-WEB-CHK-08 — Informar quanto falta para virar VIP

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a mensagem de progresso para VIP de clientes não VIP |
| **Prioridade** | Média |
| **Rastreabilidade** | RN03 · TCOND-WEB-28 |
| **Pré-condições** | Aplicação recém-iniciada; carrinho de cada persona com 1 Teclado |
| **Dados de entrada** | (a) Bruno · (b) Ana |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Entrar como Bruno e acessar `/carrinho` | "Faltam R$ 20,00 em compras para você se tornar VIP e ganhar frete grátis." |
| 2 | Entrar como Ana e acessar `/carrinho` | "Faltam R$ 300,00 em compras para você se tornar VIP e ganhar frete grátis." |

#### CT-WEB-CHK-09 — Arredondar o desconto de produto com centavos

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o arredondamento para 2 casas decimais |
| **Prioridade** | Média |
| **Rastreabilidade** | RN01 · RP01 · TCOND-WEB-29 |
| **Pré-condições** | Ana logada; carrinho com 1 Mouse Sem Fio (R$ 89,90) |
| **Dados de entrada** | Pagamento: Dinheiro |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, selecionar **Dinheiro** | Subtotal R$ 89,90 · Desconto − R$ 8,99 · Frete R$ 20,00 · **Total R$ 100,91** |
| 2 | Finalizar a compra | `/pedido` exibe Total pago **R$ 100,91** |

#### CT-WEB-CHK-10 — Recusar a finalização quando o estoque acabou depois da adição

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o estoque é validado de novo no momento da compra |
| **Prioridade** | Alta |
| **Rastreabilidade** | RN02 · RP04 · TCOND-WEB-30 |
| **Pré-condições** | Aplicação recém-iniciada; Ana logada com 5 Mouses Sem Fio no carrinho |
| **Dados de entrada** | Compra paralela pela API: Carla compra 1 Mouse (`POST /api/cart/items` + `POST /api/checkout`) |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Pela API (Postman/curl), fazer a compra de 1 Mouse com a Carla | Compra da Carla concluída; estoque do Mouse passa para 4 |
| 2 | No navegador da Ana, em `/carrinho`, clicar em **Finalizar compra** | Mensagem de erro informando estoque insuficiente para "Mouse Sem Fio" (disponível: 4); permanece em `/carrinho` |
| 3 | Conferir o estoque em `/` | Mouse continua com "4 em estoque"; nenhum pedido da Ana foi gerado |

#### CT-WEB-CHK-11 — Gerar um único pedido com clique duplo em "Finalizar compra"

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que cliques repetidos não geram pedidos duplicados nem baixas de estoque a mais |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF06 · RN02 · RP03 · TCOND-WEB-31 |
| **Pré-condições** | Aplicação recém-iniciada; Ana logada; carrinho com 1 Teclado Mecânico |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Em `/carrinho`, dar um clique duplo rápido em **Finalizar compra** | O botão é desabilitado após o primeiro clique; redireciona para `/pedido` com **um** pedido |
| 2 | Conferir o estoque do Teclado em `/` | "**9** em estoque" (baixa de apenas 1 unidade) |
| 3 | Repetir o fluxo com **duas abas** do carrinho abertas, clicando em Finalizar nas duas quase ao mesmo tempo | Apenas um pedido é gerado; a outra aba informa carrinho vazio; estoque baixa uma única vez |

#### CT-WEB-CHK-12 — Acessar a página de pedido sem ter comprado

| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o comportamento de `/pedido` sem pedido recente |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF06 · TCOND-WEB-27 |
| **Pré-condições** | `sessionStorage` limpo (nova aba) |
| **Dados de entrada** | — |

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Acessar `/pedido` | "Nenhum pedido recente." com o link **Ver produtos** |

---

## 4. Cobertura e rastreabilidade

### 4.1 Requisito → casos

| Requisito | Casos | Total |
|---|---|---|
| RF01 Cadastro | CAD-01 a CAD-11 | 11 |
| RF02 Login | LOG-01 a LOG-05 | 5 |
| RF03 Autenticação | LOG-06 a LOG-09, CAR-02 | 5 |
| F3 Produtos | PRD-01, PRD-03 | 2 |
| RN01 Desconto em dinheiro | CHK-01 a CHK-05, CHK-09 | 6 |
| RN02 Estoque | PRD-02, CAR-01, CAR-03 a CAR-05, CAR-07, CAR-08, CHK-06, CHK-10, CHK-11 | 10 |
| RN03 Frete / VIP | LOG-02, CHK-01 a CHK-04, CHK-07, CHK-08 | 7 |
| RF04 Quantidade | CAR-07, CAR-09 | 2 |
| RF06 Pós-compra | CHK-02, CHK-06, CHK-11, CHK-12 | 4 |
| F4 Carrinho (gestão) | CAR-06, CAR-10, CAR-11 | 3 |

> **RF05** (carrinho vazio e forma de pagamento inválida no checkout) não é alcançável pela interface, que esconde o botão com o carrinho vazio e só oferece as duas formas válidas. É coberto nos [Casos de Teste API](03-casos-de-teste-api.md).

### 4.2 Risco → casos

| Risco | Exposição | Casos |
|---|---|---|
| RP01 Cálculo incorreto do total | 6 | CHK-01 a CHK-04, CHK-09 |
| RP02 Transição VIP no momento errado | 6 | CHK-07, CHK-08 |
| RP03 Concorrência no checkout | 6 | CHK-11 |
| RP04 Estoque no carrinho | 6 | PRD-02, CAR-01, CAR-03 a CAR-05, CAR-08, CHK-10 |
| RP05 Acesso sem autenticação | 3 | LOG-01, LOG-03, LOG-04, LOG-06, LOG-08 |
| RP06 *Open redirect* | 4 | LOG-09 |
| RP07 Entradas inválidas | 4 | CAD-03, CAD-08, CAR-09 |
| RP10 Mensagens e validações da interface | 2 | CAD-01, CAD-09, CAD-10 |

### 4.3 Casos selecionados para automação (Cypress)

| Caso | Motivo da escolha |
|---|---|
| CT-WEB-LOG-01 | Pré-requisito de quase todos os fluxos; *smoke test* da interface |
| CT-WEB-CAR-04 | Regra RN02 com valor-limite; risco RP04 (exposição 6) |
| CT-WEB-CHK-02 | Fluxo de compra completo com a regra RN01; risco RP01 (exposição 6) |
