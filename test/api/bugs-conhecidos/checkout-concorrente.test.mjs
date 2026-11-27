// CT-API-CHK-15 — Gerar um único pedido com checkouts simultâneos
// Rastreabilidade: RF06 · RN02 · RP03 · TCOND-API-33 (docs/qa/03-casos-de-teste-api.md)
//
// ⚠️ Teste de regressão do BUG-001 (docs/qa/04-report-de-bugs.md).
// Ele FALHA enquanto o defeito não for corrigido, por isso fica fora da suíte principal
// e roda com `npm run test:api:bugs`. Quando o BUG-001 for corrigido, mova este arquivo
// para test/api/ para que ele passe a fazer parte da regressão.
import { expect } from 'chai';
import { api, auth, clienteLogado, buscarProduto } from '../support/api.mjs';

describe('Bugs conhecidos — checkout concorrente (BUG-001)', () => {
  it('CT-API-CHK-15 — deve gerar um único pedido quando o mesmo carrinho é finalizado 5 vezes em paralelo', async () => {
    const teclado = await buscarProduto('Teclado Mecânico');
    expect(teclado.stock, 'Teclado precisa ter estoque').to.be.greaterThan(0);
    const { token } = await clienteLogado('qa.api.concorrente');
    await api.post('/api/cart/items').set(auth(token)).send({ productId: teclado.id, quantity: 1 }).expect(201);

    const respostas = await Promise.all(
      Array.from({ length: 5 }, () => api.post('/api/checkout').set(auth(token)).send({ paymentMethod: 'cash' }))
    );
    const status = respostas.map((r) => r.status);

    const estoqueDepois = (await api.get(`/api/products/${teclado.id}`)).body.product.stock;
    const me = (await api.get('/api/users/me').set(auth(token))).body.user;

    // Diagnóstico no relatório, antes das asserções
    console.log(`      status: [${status.join(', ')}] · estoque: ${teclado.stock} → ${estoqueDepois} · totalSpent: ${me.totalSpent}`);

    expect(status, 'nenhuma resposta 500').to.not.include(500);
    expect(status.filter((s) => s === 201), 'exatamente 1 resposta 201').to.have.lengthOf(1);
    expect(status.filter((s) => s === 422), 'as demais 422 (carrinho vazio)').to.have.lengthOf(4);
    expect(estoqueDepois, 'estoque baixado uma única vez').to.equal(teclado.stock - 1);
    expect(me.totalSpent, 'uma única cobrança').to.equal(245);
  });
});
