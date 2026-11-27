// CT-API-CHK-02 — Finalizar compra de não VIP em dinheiro com desconto
// Rastreabilidade: RN01 · RN03 · RF06 · RP01 · TCOND-API-25, TCOND-API-29 (docs/qa/03-casos-de-teste-api.md)
//
// Regra R1 da tabela de decisão: cliente não VIP + dinheiro =
// subtotal 250 − desconto 25 (10% só dos produtos) + frete 20 = 245.
import { expect } from 'chai';
import { api, auth, clienteLogado, buscarProduto } from './support/api.mjs';

describe('Finalização de compra — /api/checkout', () => {
  let token;
  let teclado;

  beforeEach(async () => {
    teclado = await buscarProduto('Teclado Mecânico');
    expect(teclado.stock, 'Teclado precisa ter estoque').to.be.greaterThan(0);
    // Cliente novo: R$ 0,00 gastos e não VIP, sem afetar as personas do seed
    ({ token } = await clienteLogado('qa.api.checkout'));
    await api
      .post('/api/cart/items')
      .set(auth(token))
      .send({ productId: teclado.id, quantity: 1 })
      .expect(201);
  });

  it('CT-API-CHK-02 — deve aplicar 10% de desconto em dinheiro, cobrar frete, registrar o pedido e esvaziar o carrinho', async () => {
    // Passo 1: prévia
    const previa = await api.get('/api/checkout/summary?paymentMethod=cash').set(auth(token));
    expect(previa.status).to.equal(200);
    expect(previa.body).to.include({
      paymentMethod: 'cash',
      isVip: false,
      subtotal: 250,
      discount: 25,
      shipping: 20,
      total: 245
    });

    // Passo 2: finalização
    const compra = await api.post('/api/checkout').set(auth(token)).send({ paymentMethod: 'cash' });
    expect(compra.status).to.equal(201);

    const { order, user } = compra.body;
    expect(order).to.include({
      paymentMethod: 'cash',
      subtotal: 250,
      discount: 25,
      shipping: 20,
      total: 245,
      vipAtPurchase: false,
      becameVip: false
    });
    expect(order.id).to.be.a('string').and.not.be.empty;
    expect(new Date(order.createdAt).toString()).to.not.equal('Invalid Date');
    expect(order.items).to.deep.equal([
      { productId: teclado.id, name: 'Teclado Mecânico', unitPrice: 250, quantity: 1, lineTotal: 250 }
    ]);
    expect(user).to.include({ totalSpent: 245, isVip: false });
    expect(user).to.not.have.property('password');

    // Passo 3: carrinho esvaziado
    const carrinho = await api.get('/api/cart').set(auth(token));
    expect(carrinho.body).to.deep.equal({ items: [], totalItems: 0, subtotal: 0 });

    // Passo 4: total gasto atualizado
    const me = await api.get('/api/users/me').set(auth(token));
    expect(me.body.user.totalSpent).to.equal(245);

    // Efeito adicional (RN02): estoque baixado em 1 unidade
    const produto = await api.get(`/api/products/${teclado.id}`);
    expect(produto.body.product.stock).to.equal(teclado.stock - 1);
  });
});
