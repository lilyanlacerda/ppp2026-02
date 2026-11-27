// Funções de apoio da suíte de API.
// Os testes rodam contra a aplicação em execução (caixa-preta), como um cliente real da API.
import request from 'supertest';

export const BASE_URL = process.env.API_URL || 'http://localhost:3030';
export const api = request(BASE_URL);

/** Cabeçalho de autenticação Bearer. */
export const auth = (token) => ({ Authorization: `Bearer ${token}` });

/** Cadastra um cliente novo com e-mail único e devolve { name, email, password, id }. */
export async function criarCliente(prefixo = 'qa.api') {
  const cliente = {
    name: 'Cliente API',
    email: `${prefixo}+${Date.now()}${Math.floor(Math.random() * 10000)}@email.com`,
    password: 'senha123'
  };
  const res = await api.post('/api/auth/register').send(cliente).expect(201);
  return { ...cliente, id: res.body.user.id };
}

/** Faz login e devolve o token JWT. */
export async function login({ email, password }) {
  const res = await api.post('/api/auth/login').send({ email, password }).expect(200);
  return res.body.token;
}

/** Cria um cliente novo e devolve { cliente, token }. */
export async function clienteLogado(prefixo) {
  const cliente = await criarCliente(prefixo);
  return { cliente, token: await login(cliente) };
}

/** Busca um produto pelo início do nome (os IDs mudam a cada inicialização da aplicação). */
export async function buscarProduto(nome) {
  const res = await api.get('/api/products').expect(200);
  const produto = res.body.products.find((p) => p.name.startsWith(nome));
  if (!produto) throw new Error(`Produto "${nome}" não encontrado`);
  return produto;
}

/** Decodifica o payload de um JWT (sem validar a assinatura). */
export function decodificarJwt(token) {
  const [, payload] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}
