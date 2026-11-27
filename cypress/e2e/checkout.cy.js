// CT-WEB-CHK-02 — Finalizar compra de não VIP em dinheiro com desconto
// Rastreabilidade: RN01 · RN03 · RF06 · RP01 · TCOND-WEB-25, TCOND-WEB-27 (docs/qa/02-casos-de-teste-web.md)
//
// Regra R1 da tabela de decisão: cliente não VIP + dinheiro =
// subtotal R$ 250,00 − desconto R$ 25,00 (10% só dos produtos) + frete R$ 20,00 = R$ 245,00.

describe('Finalização de compra', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.buscarProduto('Teclado Mecânico').then((teclado) => {
      expect(teclado.stock, 'Teclado precisa ter estoque').to.be.greaterThan(0);
      // Cliente novo: R$ 0,00 gastos, não VIP, sem afetar as personas do seed
      cy.criarCliente()
        .then((cliente) => cy.loginPorApi(cliente))
        .then((token) => cy.adicionarAoCarrinhoPorApi(token, teclado.id, 1));
    });
  });

  it('CT-WEB-CHK-02 — deve aplicar 10% de desconto em dinheiro, cobrar frete e confirmar o pedido', () => {
    cy.visit('/carrinho');
    cy.contains('#items tr', 'Teclado Mecânico').should('be.visible');

    // Passo 1: seleciona Dinheiro e confere o resumo
    cy.get('input[name="payment"][value="cash"]').check();
    cy.get('#summary .summary-line').should('have.length', 4);
    cy.conferirLinha('#summary', 'Subtotal', 'R$ 250,00');
    cy.conferirLinha('#summary', 'Desconto (dinheiro)', '- R$ 25,00');
    cy.conferirLinha('#summary', 'Frete', 'R$ 20,00');
    cy.conferirLinha('#summary', 'Total', 'R$ 245,00');
    cy.screenshot('CT-WEB-CHK-02-resumo-dinheiro');

    // Passo 2: finaliza a compra
    cy.intercept('POST', '/api/checkout').as('checkout');
    cy.get('#checkout').click();
    cy.wait('@checkout').its('response.statusCode').should('eq', 201);
    cy.location('pathname').should('eq', '/pedido');

    // Passo 3: confere a página do pedido
    cy.get('#content').within(() => {
      cy.contains('.alert.success', 'Compra finalizada com sucesso!').should('be.visible');
      cy.contains('h1', 'Pedido confirmado').should('be.visible');
      cy.contains('.subtitle', 'Pagamento: Dinheiro').should('be.visible');
      cy.contains('tbody tr', 'Teclado Mecânico').within(() => {
        cy.get('td').eq(1).should('have.text', '1');
      });
    });
    cy.conferirLinha('#content', 'Desconto', '- R$ 25,00');
    cy.conferirLinha('#content', 'Frete', 'R$ 20,00');
    cy.conferirLinha('#content', 'Total pago', 'R$ 245,00');
    cy.screenshot('CT-WEB-CHK-02-pedido-confirmado');

    // Efeito pós-compra (RF06): carrinho esvaziado
    cy.visit('/carrinho');
    cy.contains('#empty', 'Seu carrinho está vazio.').should('be.visible');
  });
});
