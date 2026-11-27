// Comandos reutilizáveis.
// A preparação de dados (cadastro, login, carrinho) é feita pela API, que é mais rápida e estável;
// a interface é usada só para o comportamento que o caso de teste quer verificar.

const apiUrl = () => Cypress.expose('apiUrl');

/** Cria um cliente novo com e-mail único e devolve { name, email, password }. */
Cypress.Commands.add('criarCliente', (prefixo = 'qa.cypress') => {
  const cliente = {
    name: 'Cliente Cypress',
    email: `${prefixo}+${Date.now()}${Cypress._.random(1000, 9999)}@email.com`,
    password: 'senha123'
  };
  return cy
    .request('POST', `${apiUrl()}/auth/register`, cliente)
    .its('status')
    .should('eq', 201)
    .then(() => cliente);
});

/** Faz login pela API e grava a sessão no localStorage, como o site faz após o login. */
Cypress.Commands.add('loginPorApi', ({ email, password }) => {
  return cy.request('POST', `${apiUrl()}/auth/login`, { email, password }).then(({ body }) => {
    window.localStorage.setItem('ecommerce_token', body.token);
    window.localStorage.setItem('ecommerce_user', JSON.stringify(body.user));
    return body.token;
  });
});

/** Busca um produto pelo início do nome (os IDs mudam a cada inicialização da aplicação). */
Cypress.Commands.add('buscarProduto', (nome) => {
  return cy.request(`${apiUrl()}/products`).then(({ body }) => {
    const produto = body.products.find((p) => p.name.startsWith(nome));
    expect(produto, `produto "${nome}" encontrado`).to.exist;
    return produto;
  });
});

/** Adiciona um produto ao carrinho do cliente pela API. */
Cypress.Commands.add('adicionarAoCarrinhoPorApi', (token, productId, quantity) => {
  return cy.request({
    method: 'POST',
    url: `${apiUrl()}/cart/items`,
    headers: { Authorization: `Bearer ${token}` },
    body: { productId, quantity }
  });
});

/** Card de um produto na vitrine. */
Cypress.Commands.add('cardDoProduto', (productId) => cy.get(`[data-testid="product-${productId}"]`));

/**
 * Confere o valor de uma linha de resumo (<div class="summary-line"><span>rótulo</span><span>valor</span></div>).
 * Usa should(callback) para repetir a verificação até o resumo terminar de atualizar.
 * Normaliza o espaço não separável (U+00A0) que Intl.NumberFormat usa em "R$ 245,00".
 */
Cypress.Commands.add('conferirLinha', (container, rotulo, esperado) =>
  cy.get(`${container} .summary-line`).should(($linhas) => {
    const linha = [...$linhas].find((l) => l.firstElementChild.textContent.trim() === rotulo);
    expect(linha, `linha "${rotulo}"`).to.exist;
    expect(linha.lastElementChild.textContent.replace(/\u00a0/g, ' ').trim(), rotulo).to.eq(esperado);
  })
);
