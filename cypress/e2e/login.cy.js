// CT-WEB-LOG-01 — Entrar com credenciais válidas
// Rastreabilidade: RF02 · RP05 · TCOND-WEB-09 (docs/qa/02-casos-de-teste-web.md)

describe('Login', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('CT-WEB-LOG-01 — deve entrar com credenciais válidas e identificar o cliente no cabeçalho', () => {
    cy.visit('/login');

    // Passo 1: formulário exibido e cabeçalho de visitante
    cy.contains('h1', 'Entrar').should('be.visible');
    cy.get('#nav').within(() => {
      cy.contains('a', 'Entrar').should('be.visible');
      cy.contains('a', 'Cadastrar').should('be.visible');
    });

    // Passo 2: login com a persona Ana
    cy.get('#email').type('ana@email.com');
    cy.get('#password').type('123456', { log: false });
    cy.contains('button', 'Entrar').click();

    cy.location('pathname').should('eq', '/');

    // Passo 3: cabeçalho de cliente logado, sem selo VIP
    cy.get('#nav').within(() => {
      cy.contains('a', 'Carrinho').should('be.visible');
      cy.contains('.user', 'Olá, Ana').should('be.visible');
      cy.get('.badge.vip').should('not.exist');
      cy.contains('a', 'Sair').should('be.visible');
    });

    // Sessão gravada no navegador
    cy.window().then((win) => {
      expect(win.localStorage.getItem('ecommerce_token'), 'token salvo').to.match(/^[\w-]+\.[\w-]+\.[\w-]+$/);
      expect(JSON.parse(win.localStorage.getItem('ecommerce_user'))).to.include({
        email: 'ana@email.com',
        isVip: false
      });
    });

    cy.screenshot('CT-WEB-LOG-01-logado');
  });
});
