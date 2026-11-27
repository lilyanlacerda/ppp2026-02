// Funções de apoio dos scripts k6.
import http from 'k6/http';
import { check } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3030';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** Parâmetros de requisição com nome (agrupa métricas por endpoint) e, opcionalmente, token. */
export function params(name, token) {
  const headers = { ...JSON_HEADERS };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { headers, tags: { name } };
}

/** Lista os produtos e devolve um mapa { 'Teclado Mecânico': {...}, ... }. */
export function produtos() {
  const res = http.get(`${BASE_URL}/api/products`, params('produtos'));
  const lista = res.json('products') || [];
  return Object.fromEntries(lista.map((p) => [p.name, p]));
}

/** Cadastra um cliente com e-mail único e faz login. Devolve o token. */
export function novoClienteLogado(prefixo) {
  const email = `${prefixo}+${Date.now()}-${__VU}-${__ITER}-${Math.floor(Math.random() * 1e6)}@email.com`;
  const cadastro = http.post(
    `${BASE_URL}/api/auth/register`,
    JSON.stringify({ name: 'Cliente k6', email, password: 'senha123' }),
    params('cadastro')
  );
  check(cadastro, { 'cadastro: status 201': (r) => r.status === 201 });
  return login(email, 'senha123');
}

/** Faz login e devolve o token (ou undefined se falhar). */
export function login(email, password) {
  const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({ email, password }), params('login'));
  check(res, {
    'login: status 200': (r) => r.status === 200,
    'login: devolve token': (r) => typeof r.json('token') === 'string'
  });
  return res.status === 200 ? res.json('token') : undefined;
}
