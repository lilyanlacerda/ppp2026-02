// PERF-02 — Carga no login
// Plano de Testes, seção 6.4.2 · RF02 · RNF02 · RP09
//
// Objetivo: medir o tempo de resposta do login com até 20 usuários simultâneos.
// O login usa bcrypt, que é custoso por design (protege contra força bruta). Por isso a meta
// é mais folgada que a dos endpoints de leitura.
// Usa as personas do seed: o login não altera dados.
//
// Cenário auxiliar "leitura": 1 usuário consultando produtos durante toda a carga de login.
// Mede se os logins afetam o restante da API. Como o Node.js executa o JavaScript em uma única
// thread e o bcryptjs é JavaScript puro, cada login ocupa essa thread enquanto calcula o hash.
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, params } from './lib/api.js';

const PERSONAS = ['ana@email.com', 'bruno@email.com', 'carla@email.com'];

export const options = {
  scenarios: {
    carga_login: {
      executor: 'ramping-vus',
      exec: 'login',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 10 }, // aquecimento
        { duration: '30s', target: 20 }, // sobe até 20 usuários simultâneos
        { duration: '15s', target: 0 } // desaceleração
      ],
      gracefulRampDown: '5s'
    },
    leitura: {
      executor: 'constant-vus',
      exec: 'leitura',
      vus: 1,
      duration: '60s'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{name:login}': ['p(95)<800'],
    // Mesma meta do PERF-01 para a leitura de produtos, agora com logins acontecendo em paralelo
    'http_req_duration{name:produtos}': ['p(95)<300'],
    checks: ['rate>0.99']
  }
};

export function login() {
  const email = PERSONAS[(__VU + __ITER) % PERSONAS.length];
  const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({ email, password: '123456' }), params('login'));
  check(res, {
    'login: status 200': (r) => r.status === 200,
    'login: devolve token': (r) => typeof r.json('token') === 'string',
    'login: e-mail correto': (r) => r.json('user.email') === email
  });
  sleep(1);
}

export function leitura() {
  const res = http.get(`${BASE_URL}/api/products`, params('produtos'));
  check(res, { 'produtos: status 200': (r) => r.status === 200 });
  sleep(0.5);
}
