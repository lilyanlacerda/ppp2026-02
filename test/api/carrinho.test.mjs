// CT-API-CAR-04 — Recusar adição que faz o carrinho passar do estoque
// Rastreabilidade: RN02 · RP04 · TCOND-API-21 (docs/qa/03-casos-de-teste-api.md)
//
// Técnica: análise de valor-limite. Adiciona exatamente o estoque disponível (limite válido)
// e depois mais 1 unidade (limite inválido). O estoque é lido da API no momento do teste,
// para o caso não depender de a aplicação estar recém-iniciada.
import { expect } from 'chai';
import { api, auth, clienteLogado, buscarProduto } from './support/api.mjs';

describe('Carrinho — POST /api/cart/items', () => {
  let token;
  let mouse;

  beforeEach(async () => {
    mouse = await buscarProduto('Mouse Sem Fio');
    expect(mouse.stock, 'Mouse precisa ter estoque (reinicie a aplicação se zerou)').to.be.greaterThan(0);
    ({ token } = await clienteLogado('qa.api.carrinho'));
  });

  it('CT-API-CAR-04 — deve recusar com 422 a adição que faz a quantidade no carrinho passar do estoque', async () => {
    // Passo 1: quantidade igual ao estoque (limite válido)
    const primeira = await api
      .post('/api/cart/items')
      .set(auth(token))
      .send({ productId: mouse.id, quantity: mouse.stock });
    expect(primeira.status).to.equal(201);
    expect(primeira.body.items).to.have.lengthOf(1);
    expect(primeira.body.items[0]).to.include({ productId: mouse.id, quantity: mouse.stock });

    // Passo 2: mais 1 unidade (limite inválido)
    const segunda = await api
      .post('/api/cart/items')
      .set(auth(token))
      .send({ productId: mouse.id, quantity: 1 });
    expect(segunda.status).to.equal(422);
    expect(segunda.body).to.deep.equal({
      error: `Estoque insuficiente para "Mouse Sem Fio". Disponível: ${mouse.stock}.`
    });

    // Passo 3: carrinho inalterado
    const carrinho = await api.get('/api/cart').set(auth(token));
    expect(carrinho.status).to.equal(200);
    expect(carrinho.body.items).to.have.lengthOf(1);
    expect(carrinho.body.items[0].quantity).to.equal(mouse.stock);
    expect(carrinho.body.totalItems).to.equal(mouse.stock);
  });
});
