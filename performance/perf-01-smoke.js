// PERF-01 — Smoke test dos endpoints públicos
// Plano de Testes, seção 6.4.2 · RNF02 · RP09
//
// Objetivo: verificar, com carga mínima (1 usuário virtual por 30 s), que os endpoints públicos
// respondem corretamente e rápido. Serve de linha de base e de pré-requisito para os testes de carga.
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, params, produtos } from './lib/api.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // menos de 1% de erros
    http_req_duration: ['p(95)<300'], // 95% das requisições em até 300 ms
    checks: ['rate>0.99']
  }
};

export function setup() {
  const teclado = produtos()['Teclado Mecânico'];
  if (!teclado) throw new Error('Produto "Teclado Mecânico" não encontrado. A aplicação está rodando?');
  return { tecladoId: teclado.id };
}

export default function (data) {
  const health = http.get(`${BASE_URL}/api/health`, params('health'));
  check(health, {
    'health: status 200': (r) => r.status === 200,
    'health: status ok': (r) => r.json('status') === 'ok'
  });

  const lista = http.get(`${BASE_URL}/api/products`, params('produtos'));
  check(lista, {
    'produtos: status 200': (r) => r.status === 200,
    'produtos: 3 itens': (r) => (r.json('products') || []).length === 3
  });

  const detalhe = http.get(`${BASE_URL}/api/products/${data.tecladoId}`, params('produto'));
  check(detalhe, {
    'produto: status 200': (r) => r.status === 200,
    'produto: Teclado a R$ 250': (r) => r.json('product.price') === 250
  });

  sleep(1);
}
