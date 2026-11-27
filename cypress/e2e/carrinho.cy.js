// CT-WEB-CAR-04 — Recusar adição que faz o carrinho passar do estoque
// Rastreabilidade: RN02 · RP04 · TCOND-WEB-20 (docs/qa/02-casos-de-teste-web.md)
//
// Técnica: análise de valor-limite. Adiciona exatamente o estoque disponível (limite válido)
// e depois mais 1 unidade (limite inválido). O estoque é lido da API no momento do teste,
// para o caso não depender de a aplicação estar recém-iniciada.

describe('Carrinho', () => {
  let mouse;

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.buscarProduto('Mouse Sem Fio').then((produto) => {
      mouse = produto;
      expect(mouse.stock, 'Mouse precisa ter estoque (reinicie a aplicação se zerou)').to.be.greaterThan(0);
    });
    cy.criarCliente().then((cliente) => cy.loginPorApi(cliente));
  });

  it('CT-WEB-CAR-04 — deve recusar a adição que faz a quantidade no carrinho passar do estoque', () => {
    cy.visit('/');

    // Passo 1: adiciona exatamente o estoque disponível (limite válido)
    cy.cardDoProduto(mouse.id).within(() => {
      cy.get('input[name="quantity"]').clear().type(String(mouse.stock));
      cy.contains('button', 'Adicionar ao carrinho').click();
    });
    cy.get('#alert')
      .should('have.class', 'success')
      .and('contain.text', `Produto adicionado ao carrinho. Itens no carrinho: ${mouse.stock}.`);

    // Passo 2: tenta adicionar mais 1 unidade (limite inválido)
    cy.cardDoProduto(mouse.id).within(() => {
      cy.get('input[name="quantity"]').clear().type('1');
      cy.contains('button', 'Adicionar ao carrinho').click();
    });
    cy.get('#alert')
      .should('have.class', 'error')
      .and('contain.text', `Estoque insuficiente para "Mouse Sem Fio". Disponível: ${mouse.stock}.`);
    cy.screenshot('CT-WEB-CAR-04-estoque-insuficiente');

    // Passo 3: o carrinho continua com a quantidade do passo 1
    cy.visit('/carrinho');
    cy.contains('#items tr', 'Mouse Sem Fio').within(() => {
      cy.get('input.qty').should('have.value', String(mouse.stock));
    });
  });
});
