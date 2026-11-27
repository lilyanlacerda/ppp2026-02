// CT-API-AUTH-11 — Fazer login com credenciais válidas
// Rastreabilidade: RF02 · RP05 · TCOND-API-07 (docs/qa/03-casos-de-teste-api.md)
import { expect } from 'chai';
import { api, decodificarJwt } from './support/api.mjs';

describe('Autenticação — POST /api/auth/login', () => {
  it('CT-API-AUTH-11 — deve fazer login com credenciais válidas e devolver um JWT válido por 2 horas', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'ana@email.com', password: '123456' });

    // Status e formato
    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.match(/application\/json/);
    expect(res.body).to.have.all.keys('token', 'user');

    // Dados do cliente, sem a senha
    expect(res.body.user).to.deep.include({
      name: 'Ana Silva',
      email: 'ana@email.com',
      totalSpent: 0,
      isVip: false
    });
    expect(res.body.user.id).to.be.a('string').and.not.be.empty;
    expect(res.body.user).to.not.have.property('password');

    // Token JWT: 3 partes, dono correto e validade de 2 horas (7200 s)
    const { token } = res.body;
    expect(token.split('.')).to.have.lengthOf(3);
    const payload = decodificarJwt(token);
    expect(payload.sub).to.equal(res.body.user.id);
    expect(payload.exp - payload.iat).to.equal(7200);

    // O token é aceito por uma rota protegida
    const me = await api.get('/api/users/me').set('Authorization', `Bearer ${token}`);
    expect(me.status).to.equal(200);
    expect(me.body.user.email).to.equal('ana@email.com');
  });
});
