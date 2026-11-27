// PERF-03 — Jornada de compra
// Plano de Testes, seção 6.4.2 · RN01 · RN02 · RN03 · RF06 · RNF02 · RP09
//
// Dois cenários em paralelo, cada usuário virtual com o próprio cliente (carrinhos independentes):
//
//  1. navegacao: até 10 usuários montando carrinho → alterando quantidade → consultando a prévia → esvaziando.
//     Representa a maior parte do tráfego de um e-commerce (quem pesquisa e não compra).
//
//  2. compra: 10 compras efetivadas por 5 usuários simultâneos (cadastro → login → carrinho → prévia → checkout).
//     O número de compras é limitado pelo ESTOQUE: a aplicação não tem rota para repor estoque e o
//     Teclado começa com 10 unidades. Por isso este script exige a aplicação recém-iniciada.
//
// As compras são de clientes DIFERENTES, então não exercitam o BUG-001 (mesmo carrinho em paralelo).
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, params, produtos, novoClienteLogado } from './lib/api.js';

const COMPRAS = Number(__ENV.COMPRAS || 10);

export const options = {
  scenarios: {
    navegacao: {
      executor: 'ramping-vus',
      exec: 'navegacao',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '15s', target: 0 }
      ],
      gracefulRampDown: '5s'
    },
    compra: {
      executor: 'shared-iterations',
      exec: 'compra',
      vus: 5,
      iterations: COMPRAS,
      startTime: '20s', // começa com a navegação já em 10 usuários
      maxDuration: '40s'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{scenario:navegacao}': ['p(95)<1000'],
    'http_req_duration{name:checkout}': ['p(95)<1000'],
    'http_req_duration{name:previa}': ['p(95)<1000'],
    checks: ['rate>0.99']
  }
};

export function setup() {
  const lista = produtos();
  const teclado = lista['Teclado Mecânico'];
  const mouse = lista['Mouse Sem Fio'];
  if (!teclado || !mouse) throw new Error('Produtos não encontrados. A aplicação está rodando?');
  if (teclado.stock < COMPRAS) {
    throw new Error(`Estoque do Teclado (${teclado.stock}) menor que o número de compras (${COMPRAS}). Reinicie a aplicação.`);
  }
  if (mouse.stock < 2) throw new Error('O Mouse precisa de estoque ≥ 2. Reinicie a aplicação.');
  return { tecladoId: teclado.id, mouseId: mouse.id, estoqueInicial: teclado.stock };
}

// Cliente do usuário virtual na navegação (criado na primeira iteração e reaproveitado)
let tokenNavegacao;

export function navegacao(data) {
  if (!tokenNavegacao) tokenNavegacao = novoClienteLogado('qa.k6.navegacao');
  const token = tokenNavegacao;

  http.get(`${BASE_URL}/api/products`, params('produtos'));

  const adicionar = http.post(
    `${BASE_URL}/api/cart/items`,
    JSON.stringify({ productId: data.mouseId, quantity: 1 }),
    params('adicionar', token)
  );
  check(adicionar, { 'adicionar: status 201': (r) => r.status === 201 });

  const alterar = http.patch(
    `${BASE_URL}/api/cart/items/${data.mouseId}`,
    JSON.stringify({ quantity: 2 }),
    params('alterar', token)
  );
  check(alterar, { 'alterar: subtotal 179,80': (r) => r.status === 200 && r.json('subtotal') === 179.8 });

  // 2 Mouses em dinheiro: 179,80 − 17,98 + 20,00 = 181,82
  const previa = http.get(`${BASE_URL}/api/checkout/summary?paymentMethod=cash`, params('previa', token));
  check(previa, { 'previa: total 181,82': (r) => r.status === 200 && r.json('total') === 181.82 });

  const esvaziar = http.del(`${BASE_URL}/api/cart`, null, params('esvaziar', token));
  check(esvaziar, { 'esvaziar: carrinho vazio': (r) => r.status === 200 && r.json('totalItems') === 0 });

  sleep(1);
}

export function compra(data) {
  // Cliente novo a cada compra: não VIP, total esperado fixo
  const token = novoClienteLogado('qa.k6.compra');

  const adicionar = http.post(
    `${BASE_URL}/api/cart/items`,
    JSON.stringify({ productId: data.tecladoId, quantity: 1 }),
    params('adicionar', token)
  );
  check(adicionar, { 'adicionar: status 201': (r) => r.status === 201 });

  // 1 Teclado no cartão, não VIP: 250,00 + 20,00 de frete = 270,00
  const previa = http.get(`${BASE_URL}/api/checkout/summary?paymentMethod=credit_card`, params('previa', token));
  check(previa, { 'previa: total 270,00': (r) => r.status === 200 && r.json('total') === 270 });

  const checkout = http.post(
    `${BASE_URL}/api/checkout`,
    JSON.stringify({ paymentMethod: 'credit_card' }),
    params('checkout', token)
  );
  check(checkout, {
    'checkout: status 201': (r) => r.status === 201,
    'checkout: total 270,00': (r) => r.json('order.total') === 270
  });

  sleep(1);
}

export function teardown(data) {
  // Confere a consistência do estoque depois da carga: deve ter baixado exatamente o número de compras
  const teclado = produtos()['Teclado Mecânico'];
  const esperado = data.estoqueInicial - COMPRAS;
  check(teclado, { 'estoque final do Teclado = inicial − compras': (t) => t.stock === esperado });
  console.log(`Estoque do Teclado: ${data.estoqueInicial} → ${teclado.stock} (esperado: ${esperado})`);
}
