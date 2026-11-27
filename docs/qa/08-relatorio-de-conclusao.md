# 🏁 Relatório de Conclusão do Teste — Loja PPP

> Documento estruturado conforme a **ISO/IEC/IEEE 29119-3:2021** (*Test Completion Report*). Encerra o ciclo de testes definido no [Plano de Testes](01-plano-de-testes.md) (`PT-LOJAPPP-001`).

⬅️ [Índice da documentação de QA](README.md)

---

## 1. Visão geral

### 1.1 Identificação do documento

| Item | Valor |
|---|---|
| **Identificador** | `RC-LOJAPPP-001` |
| **Título** | Relatório de Conclusão do Teste — Loja PPP |
| **Versão** | 1.0 |
| **Data** | 27/11/2026 |
| **Status** | Em revisão |
| **Organização emissora** | Lilyan Lacerda — QA (projeto de portfólio) |
| **Itens de teste** | IT-01 API REST, IT-02 Site Web e IT-03 Swagger — versão 1.0.0, commit `f134da6` |

### 1.2 Autoridade de aprovação

| Papel | Nome | Responsabilidade | Assinatura / data |
|---|---|---|---|
| Autora | Lilyan Lacerda (QA) | Elaboração | ____ / ____ |
| Aprovador | Product Owner do projeto | Decisão de liberação com base neste relatório | ____ / ____ |

### 1.3 Histórico de alterações

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.0 | 27/11/2026 | Lilyan Lacerda | Versão inicial: encerramento do primeiro ciclo de testes |

### 1.4 Referências

| ID | Documento |
|---|---|
| [REF-01] | [Plano de Testes `PT-LOJAPPP-001`](01-plano-de-testes.md) |
| [REF-02] | [Casos de Teste Web `ECT-LOJAPPP-WEB-001`](02-casos-de-teste-web.md) |
| [REF-03] | [Casos de Teste API `ECT-LOJAPPP-API-001`](03-casos-de-teste-api.md) |
| [REF-04] | [Report de Bugs `RI-LOJAPPP-001`](04-report-de-bugs.md) |
| [REF-05] | [Automação Web `AUT-LOJAPPP-WEB-001`](05-automacao-web-cypress.md) |
| [REF-06] | [Automação API `AUT-LOJAPPP-API-001`](06-automacao-api.md) |
| [REF-07] | [Performance `PERF-LOJAPPP-001`](07-performance-k6.md) |

---

## 2. Resumo executivo

| | |
|---|---|
| **Recomendação** | 🔴 **Não liberar** a versão 1.0.0 para produção |
| **Motivo principal** | [BUG-001](04-report-de-bugs.md) (crítico): o mesmo carrinho finalizado ao mesmo tempo grava pedidos duplicados e baixa estoque a mais, enquanto o cliente recebe erro 500 |
| **Defeitos** | **8** encontrados: 1 crítico · 4 médios · 3 baixos (todos abertos) · mais 4 sugestões de melhoria |
| **Execução** | 15 de 112 casos funcionais executados formalmente (13%), sendo 6 aprovados e 9 reprovados; 3 de 3 cenários de performance |
| **Automação** | 3 testes Web (Cypress), 3 testes de API + 1 de bug conhecido (Mocha/Chai/Supertest), 3 cenários de performance (k6) |
| **O que está bom** | Regras de preço (desconto, frete) corretas em todos os testes, inclusive sob carga; validações de estoque no carrinho; autenticação recusa tokens forjados e expirados; API rápida em leitura e checkout |

O ciclo **cumpriu o objetivo de encontrar e documentar os riscos mais graves**: os 3 riscos de exposição 6 que foram exercitados revelaram ou descartaram defeitos. Mas **não cumpriu os critérios de conclusão** do plano (seção 4): a execução manual planejada não foi feita e há um defeito crítico aberto.

---

## 3. Testes realizados

### 3.1 Resumo do que foi testado

| Tipo | Escopo | Ferramenta | Resultado |
|---|---|---|---|
| Projeto de testes | 65 condições de teste e 112 casos (46 Web + 66 API), derivados de risco com técnicas da ISO/IEC/IEEE 29119-4 | Markdown | ✅ Concluído; 100% dos requisitos com pelo menos 1 caso |
| Sondagem durante o projeto | Respostas reais da API e mensagens do site conferidas para escrever os resultados esperados | curl, Playwright | ✅ Expectativas dos casos baseadas no comportamento real |
| Execução funcional | 15 casos (Web e API), priorizando os de risco mais alto e os candidatos a defeito | Manual + automação | 6 aprovados · 9 reprovados |
| Investigação de defeitos | 8 defeitos reproduzidos do zero, com evidências e análise de causa no código | Node.js, Playwright, consulta ao MongoDB | ✅ Concluído |
| Automação Web | CT-WEB-LOG-01, CAR-04 e CHK-02 | Cypress 16 (Chrome) | ✅ 3/3 em 2 execuções seguidas |
| Automação API | CT-API-AUTH-11, CAR-04 e CHK-02 + CT-API-CHK-15 (bug conhecido) | Mocha 12, Chai 6, Supertest 7 | ✅ 3/3 · ❌ CHK-15 reprova (BUG-001), como esperado |
| Performance | PERF-01 *smoke*, PERF-02 carga no login, PERF-03 jornada de compra | k6 1.8.3 | Referência: 2/3 · Mac da autora: 3/3 |

### 3.2 Desvios em relação ao planejado

| # | Planejado | Realizado | Justificativa / impacto |
|---|---|---|---|
| D1 | Execução manual de todos os casos (≥ 95%), com sessões exploratórias de 60 min por funcionalidade | 15 de 112 casos executados formalmente; exploração feita durante o projeto dos casos e na investigação dos defeitos, sem *charters* registrados | Esforço direcionado para automação e investigação dos defeitos graves. **Impacto:** 97 casos sem resultado formal (ver risco residual, seção 5) |
| D2 | Cronograma de 10 dias úteis | Ciclo concentrado em 3 dias (25 a 27/11/2026) | Projeto de portfólio com uma pessoa (Plano, risco RJ03) |
| D3 | PERF-03 com 10 VUs fazendo a jornada completa até o checkout | Dividido em "navegação" (60 s) + exatamente 10 compras | A aplicação não permite repor estoque; mais compras gerariam erros 422 que não refletem performance. Detalhes no [doc 07, seção 4.1](07-performance-k6.md#41-desvio-do-plano-compras-limitadas-pelo-estoque) |
| D4 | PERF-02 medindo só o login | Acrescentado um usuário lendo produtos em paralelo | Necessário para medir o efeito dos logins no restante da API; foi o que revelou o BUG-008 |
| D5 | Performance em um único ambiente | Executada em 2 máquinas (Linux de referência e Mac da autora) | Os resultados divergiram no PERF-02; a comparação confirmou o risco RJ05 e fortaleceu a análise do BUG-008 |
| D6 | Registro dos defeitos como Issues no GitHub | Defeitos documentados no report e template de Issue criado; Issues ainda não abertas | Depende de ativar as Issues no repositório |
| D7 | Execução das suítes no GitHub Actions a cada *push* | Não implementado | Fica como próximo passo |

### 3.3 Fatores que limitaram o progresso

- **Banco em memória sem rota de reposição de estoque:** cada execução que compra produtos consome a massa de dados, e testes que dependem do estoque inicial exigem reiniciar a aplicação.
- **Ambiente de execução com rede restrita:** a instalação do Cypress e do k6 exigiu liberar endereços ou compilar a ferramenta, o que consumiu tempo do ciclo.
- **Mudanças recentes nas ferramentas:** o Cypress 16 removeu `Cypress.env()` e descontinuou o Electron; o Chai 6 e o Mocha 12 só funcionam como ES Modules. Tudo foi resolvido e documentado.

---

## 4. Avaliação dos critérios de conclusão

Critérios definidos no [Plano de Testes, seção 6.4](01-plano-de-testes.md#64-critérios-de-conclusão-do-teste):

| Critério | Meta | Resultado | Situação |
|---|---|---|---|
| Casos de prioridade Alta executados | 100% | 8 de 43 (19%) | ❌ Não atendido |
| Total de casos executados | ≥ 95% | 15 de 112 (13%) | ❌ Não atendido |
| Defeitos Críticos ou Altos abertos sem plano de correção aprovado | 0 | 1 (BUG-001: correção **sugerida**, ainda não aprovada pelo PO) | ❌ Não atendido |
| Requisitos com pelo menos 1 caso de teste | 100% | 100% ([Anexo A do plano](01-plano-de-testes.md#anexo-a--matriz-de-rastreabilidade-requisito--caso-de-teste)) | ✅ Atendido |
| Suítes automatizadas aprovadas na última execução | 100% | Web 3/3 · API 3/3 (a suíte de bugs conhecidos é separada de propósito) | ✅ Atendido |
| Metas de performance (seção 6.4.2) | 3/3 cenários | Referência: 2/3 (PERF-02 reprovado) · Mac da autora: 3/3 | ⚠️ Parcial |

**Conclusão:** 2 critérios atendidos, 1 parcial e 3 não atendidos. **O teste não pode ser considerado concluído para fins de liberação**; este relatório encerra o **primeiro ciclo** e define o que falta (seção 8).

---

## 5. Métricas

### 5.1 Execução dos casos funcionais

| | Web | API | Total |
|---|---|---|---|
| Casos especificados | 46 | 66 | **112** |
| Executados | 6 | 9 | **15 (13%)** |
| ✅ Aprovados | 3 | 3 | **6** |
| ❌ Reprovados | 3 | 6 | **9** |
| ⏳ Não executados | 40 | 57 | **97** |
| Taxa de aprovação (sobre os executados) | 50% | 33% | **40%** |

| Prioridade | Especificados | Executados | Aprovados | Reprovados |
|---|---|---|---|---|
| Alta | 43 | 8 (19%) | 6 | 2 |
| Média | 50 | 2 (4%) | 0 | 2 |
| Baixa | 19 | 5 (26%) | 0 | 5 |

> A taxa de aprovação baixa (40%) é efeito da **seleção**: além dos casos automatizados, foram executados de propósito os casos com maior chance de revelar defeitos (suposição de erro). Ela não representa a qualidade geral do produto.

### 5.2 Defeitos

| Severidade | Quantidade | Defeitos |
|---|---|---|
| 🔴 Crítica | 1 | BUG-001 |
| 🟠 Alta | 0 | — |
| 🟡 Média | 4 | BUG-002, BUG-003, BUG-004, BUG-008 |
| 🟢 Baixa | 3 | BUG-005, BUG-006, BUG-007 |
| **Total** | **8** | Todos **abertos**; BUG-005 e BUG-006 aguardam decisão do PO |

| Funcionalidade | Defeitos |
|---|---|
| Login e autenticação | BUG-002, BUG-007, BUG-008 |
| Finalização de compra | BUG-001, BUG-006 |
| Carrinho | BUG-004 |
| Cadastro | BUG-005 |
| Geral (tratamento de erros) | BUG-003 |

| Como foram encontrados | Defeitos |
|---|---|
| Suposição de erro (concorrência, payload grande, tipos, espaços, carrinho vazio) | BUG-001, 003, 004, 005, 006 |
| Verificações de segurança e conformidade com RFC | BUG-002, 007 |
| Teste de performance | BUG-008 |

> Todos os defeitos vieram de técnicas que vão **além do caminho feliz**. Os casos de caminho feliz executados (automações) passaram.

### 5.3 Automação

| Suíte | Testes | Execuções | Resultado | Duração |
|---|---|---|---|---|
| Web (Cypress) | 3 | 2 seguidas (Chrome) | 3/3 nas duas | ~4 s |
| API (Mocha) | 3 | 2 seguidas | 3/3 nas duas | < 1 s |
| API — bugs conhecidos | 1 | 2 | Reprova (BUG-001), como esperado | < 1 s |
| Performance (k6) | 3 cenários | Referência: 3 (PERF-02) · Mac: 1 | Ver seção 4 | ~3 min |

Nenhum teste instável (*flaky*) foi observado nas execuções.

### 5.4 Cobertura por risco

| Risco de produto | Exposição | Exercitado? | Resultado |
|---|---|---|---|
| RP01 Cálculo do total | 6 | ✅ Sim (CHK-02 Web e API; 445 cálculos no PERF-03) | Sem defeito no caminho principal; BUG-006 na prévia vazia |
| RP02 Transição VIP | 6 | ❌ **Não** (CHK-07/CHK-10 não executados) | **Risco residual** |
| RP03 Concorrência no checkout | 6 | ✅ Sim (CHK-15 API e CHK-11 Web) | **BUG-001 (crítico)** |
| RP04 Estoque no carrinho | 6 | ✅ Sim (CAR-04 Web e API; teardown do PERF-03) | Sem defeito |
| RP05 Acesso sem autenticação | 3 | ⚠️ Parcial (AUTH-11, SEC-06; SEC-01 a 04 sondados, não executados formalmente) | BUG-007 |
| RP06 *Open redirect* | 4 | ✅ Sim (LOG-09) | **BUG-002** |
| RP07 Entradas inválidas | 4 | ⚠️ Parcial (SEC-09, CAR-08, AUTH-10) | BUG-003, 004, 005 |
| RP08 Swagger × implementação | 4 | ⚠️ Parcial (sondagem; CAR-16 não executado) | MEL-01 |
| RP09 Desempenho | 4 | ✅ Sim (PERF-01 a 03, em 2 máquinas) | **BUG-008** |
| RP10 Mensagens da interface | 2 | ⚠️ Parcial | BUG-005 |

---

## 6. Risco residual

O que **continua arriscado** se a versão for liberada como está:

| Risco | Nível | Por quê | Como reduzir |
|---|---|---|---|
| **Pedidos duplicados e estoque inconsistente** (BUG-001) | 🔴 Alto | Defeito crítico confirmado; acontece com duplo envio, várias abas ou nova tentativa automática do cliente HTTP | Corrigir antes da liberação; mover o CT-API-CHK-15 para a regressão |
| **Transição VIP** (RP02, exposição 6) | 🟠 Médio | Regra que mexe no valor cobrado e **nenhum caso dela foi executado formalmente** | Executar CT-WEB-CHK-07/08 e CT-API-CHK-10/11 no próximo ciclo |
| **97 casos sem resultado formal** | 🟠 Médio | Os resultados esperados foram conferidos na sondagem, mas sem execução registrada não há garantia de regressão | Executar pelo menos os 35 casos de prioridade Alta restantes |
| **Phishing pelo *open redirect*** (BUG-002) | 🟡 Médio | Link legítimo da loja pode levar a um site falso após o login | Correção simples no `login.html` |
| **Lentidão geral em picos de login** (BUG-008) | 🟡 Médio | Depende do hardware de produção; confirmado em 2 máquinas | `bcrypt` nativo e limite de tentativas |
| Defeitos de validação (BUG-003 a 007) | 🟢 Baixo | Afetam clientes da API ou casos de borda, não o fluxo principal do site | Corrigir no backlog |

---

## 7. Entregáveis e ativos reutilizáveis

| Entregável | Local | Reutilizável em próximos ciclos? |
|---|---|---|
| Plano de Testes | [01-plano-de-testes.md](01-plano-de-testes.md) | ✅ Atualizar o cronograma e os critérios |
| Casos de Teste Web e API (112) | [02](02-casos-de-teste-web.md) · [03](03-casos-de-teste-api.md) | ✅ Base para a execução pendente e a regressão |
| Report de Bugs + template de Issue | [04](04-report-de-bugs.md) · [`.github/ISSUE_TEMPLATE/`](../../.github/ISSUE_TEMPLATE/bug_report.md) | ✅ Reteste após as correções |
| Suíte Cypress (comandos `criarCliente`, `loginPorApi`, `conferirLinha`...) | [`cypress/`](../../cypress/) | ✅ Novos casos reaproveitam os comandos |
| Suíte de API (funções `clienteLogado`, `buscarProduto`, `decodificarJwt`...) | [`test/api/`](../../test/api/) | ✅ Idem; inclui o teste de regressão do BUG-001 |
| Scripts k6 + executor | [`performance/`](../../performance/) | ✅ Linha de base para comparar após a correção do BUG-008 |
| Evidências (logs, prints, relatórios HTML, dashboards) | [`evidencias/`](evidencias/) | Registro histórico deste ciclo |

Comandos de regressão: `npm run test:web`, `npm run test:api`, `npm run test:api:bugs` e `npm run test:perf`.

---

## 8. Lições aprendidas

| # | O que aconteceu | Lição |
|---|---|---|
| L1 | O BUG-001 parecia "só um 500" na primeira sondagem; a consulta direta ao banco mostrou **5 pedidos gravados** | Em erros 500, conferir os **efeitos colaterais** (banco, estoque), não só a resposta |
| L2 | O PERF-02 só mostrou o impacto real do BUG-008 depois de incluir um usuário lendo produtos em paralelo | Em performance, medir também o efeito **no resto do sistema**, não só no endpoint testado |
| L3 | O PERF-02 reprovou em uma máquina e passou em outra | Metas de performance precisam vir com o ambiente; analisar **comportamento**, não só números |
| L4 | O BUG-001 pelo navegador era intermitente; pela API, reproduzia 100% | Reproduzir condições de corrida no nível mais baixo possível |
| L5 | Um achado inicial (DELETE com 404) estava de acordo com o Swagger | Conferir o **contrato** antes de abrir defeito; separar defeito de sugestão de melhoria |
| L6 | O teste de concorrência falha enquanto o bug existe | Manter testes de bugs conhecidos em **suíte separada**, para a regressão principal continuar confiável |
| L7 | A automação consumiu o tempo que estava planejado para a execução manual | Planejar a execução manual dos casos de risco Alto **antes** de começar a automação |
| L8 | Testes que dependem de estoque falharam quando a aplicação já estava rodando | Documentar pré-condições de ambiente e fazer o teste **recusar** a execução quando elas não são atendidas |

---

## 9. Próximos passos recomendados

| Prioridade | Ação | Responsável |
|---|---|---|
| P1 | Corrigir o BUG-001 e mover o CT-API-CHK-15 para a regressão | Desenvolvimento / QA |
| P1 | Executar os 35 casos de prioridade Alta pendentes, começando pela transição VIP (RP02) | QA |
| P2 | Corrigir BUG-002 e BUG-008 e repetir o PERF-02 contra a linha de base | Desenvolvimento / QA |
| P2 | Abrir as 8 Issues no GitHub e vincular ao report | QA |
| P2 | Configurar o GitHub Actions com as suítes Web, API e o PERF-01 | QA |
| P3 | Executar os casos de prioridade Média e Baixa; decidir BUG-005 e BUG-006 com o PO | QA / PO |
| P3 | Testes de estresse e de resistência (*soak*) | QA |

Depois do segundo ciclo, este relatório deve ser reemitido (versão 1.1) com a nova avaliação dos critérios de conclusão.
