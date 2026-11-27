# 🛒 Loja PPP — API REST e Site Web de E-commerce

## O que é esta aplicação

Um e-commerce simples, com uma **API REST** e um **site Web**, criado para estudo e prática de testes.
A aplicação tem só quatro funcionalidades:

| Funcionalidade | Site Web | API |
|---|---|---|
| **Login** | `/login` | `POST /api/auth/login` |
| **Cadastro** | `/cadastro` | `POST /api/auth/register` |
| **Carrinho** | `/` (vitrine) e `/carrinho` | `GET/POST/PATCH/DELETE /api/cart...` |
| **Finalização de Compra** | `/carrinho` → `/pedido` | `GET /api/checkout/summary` e `POST /api/checkout` |

Tecnologias: Node.js, Express 5, Mongoose e **mongodb-memory-server** (MongoDB em memória). A autenticação usa JWT (token Bearer válido por 2 horas). O site é feito em HTML, CSS e JavaScript puro, servido pela própria API.

> ⚠️ O banco de dados é **em memória**: toda vez que a aplicação é reiniciada, os dados voltam ao estado inicial (veja [Dados de teste](#quais-dados-de-teste-estão-incluídos)).

## Como instalar

Pré-requisitos: **Node.js 18 ou superior** e **npm**.

```bash
git clone <url-deste-repositorio>
cd ppp2026-02
npm install
```

Na primeira execução, o `mongodb-memory-server` baixa o binário do MongoDB (cerca de 100 MB). Ele fica em cache nas execuções seguintes.

## Como executar

```bash
npm start
```

Para desenvolvimento, com reinício automático ao salvar arquivos:

```bash
npm run dev
```

A aplicação sobe na porta **3030**. Para usar outra porta:

```bash
PORT=4000 npm start
```

Variáveis de ambiente opcionais:

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3030` | Porta HTTP da aplicação |
| `JWT_SECRET` | `ppp-ecommerce-dev-secret` | Segredo usado para assinar os tokens JWT |

## Quais dados de teste estão incluídos

Os dados são carregados automaticamente a cada inicialização ([src/database/seed.js](src/database/seed.js)).

### Usuários

| Nome | E-mail | Senha | Total já gasto | VIP | Para que serve |
|---|---|---|---|---|---|
| Ana Silva | `ana@email.com` | `123456` | R$ 0,00 | Não | Cliente novo, paga frete |
| Bruno Souza | `bruno@email.com` | `123456` | R$ 280,00 | Não | Vira VIP na próxima compra (faltam R$ 20,00) |
| Carla Lima | `carla@email.com` | `123456` | R$ 450,00 | **Sim** | Cliente VIP, frete grátis |

### Produtos

| Produto | Preço | Estoque | Para que serve |
|---|---|---|---|
| Teclado Mecânico | R$ 250,00 | 10 | Produto com bastante estoque |
| Mouse Sem Fio | R$ 89,90 | 5 | Estoque baixo, bom para testar o limite |
| Monitor 24" Full HD | R$ 899,00 | **0** | Sem estoque, não pode ir para o carrinho |

## Quais são as regras de negócio

1. **Desconto para pagamento em dinheiro:** se o cliente pagar em dinheiro (`paymentMethod: "cash"`), recebe **10% de desconto** sobre o subtotal dos produtos. O desconto não incide sobre o frete. Pagamento com cartão de crédito (`credit_card`) não tem desconto.
2. **Carrinho só com estoque:** um produto só pode ser adicionado ao carrinho se houver estoque. A quantidade total do produto no carrinho não pode passar do estoque disponível (resposta **HTTP 422**). O estoque é validado de novo e baixado ao finalizar a compra.
3. **Frete grátis só para VIP:** clientes que não são VIP pagam **frete fixo de R$ 20,00**. Clientes **VIP** têm **frete grátis** em todas as compras. O cliente se torna VIP quando o **total gasto** em compras (soma dos totais pagos) chega a **R$ 300,00**. A compra que atinge esse valor ainda paga frete; o frete grátis vale **a partir da compra seguinte**.

Fórmula do total de uma compra:

```
subtotal = Σ (preço × quantidade)
desconto = 10% do subtotal, se o pagamento for em dinheiro; senão 0
frete    = 0 se o cliente já for VIP; senão R$ 20,00
total    = subtotal − desconto + frete
```

Exemplos com os dados de teste:

| Cliente | Carrinho | Pagamento | Subtotal | Desconto | Frete | Total |
|---|---|---|---|---|---|---|
| Ana | 1 Teclado | Dinheiro | 250,00 | 25,00 | 20,00 | **245,00** |
| Ana | 1 Teclado | Cartão | 250,00 | 0,00 | 20,00 | **270,00** |
| Carla (VIP) | 1 Teclado | Dinheiro | 250,00 | 25,00 | 0,00 | **225,00** |
| Bruno | 1 Mouse | Cartão | 89,90 | 0,00 | 20,00 | **109,90** → Bruno passa a ser VIP |

## Quais são as URLs importantes para acessar a aplicação

Com a aplicação rodando localmente:

| O quê | URL |
|---|---|
| Site Web (vitrine de produtos) | http://localhost:3030 |
| Login | http://localhost:3030/login |
| Cadastro | http://localhost:3030/cadastro |
| Carrinho e Finalização de Compra | http://localhost:3030/carrinho |
| API REST (base) | http://localhost:3030/api |
| Health check | http://localhost:3030/api/health |
| **Swagger UI** (documentação interativa) | http://localhost:3030/api-docs |
| Arquivo YAML da especificação | http://localhost:3030/api-docs/swagger.yaml |

### Endpoints da API

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | — | Cadastra um cliente |
| POST | `/api/auth/login` | — | Faz login e retorna o token JWT |
| GET | `/api/users/me` | Bearer | Dados do cliente (total gasto e status VIP) |
| GET | `/api/products` | — | Lista os produtos |
| GET | `/api/products/{id}` | — | Detalha um produto |
| GET | `/api/cart` | Bearer | Mostra o carrinho |
| POST | `/api/cart/items` | Bearer | Adiciona um produto (`productId`, `quantity`) |
| PATCH | `/api/cart/items/{productId}` | Bearer | Altera a quantidade |
| DELETE | `/api/cart/items/{productId}` | Bearer | Remove um produto |
| DELETE | `/api/cart` | Bearer | Esvazia o carrinho |
| GET | `/api/checkout/summary?paymentMethod=cash` | Bearer | Prévia de subtotal, desconto, frete e total |
| POST | `/api/checkout` | Bearer | Finaliza a compra (`paymentMethod`: `cash` ou `credit_card`) |

A especificação completa está em [docs/swagger.yaml](docs/swagger.yaml).

### Exemplo rápido com curl

```bash
TOKEN=$(curl -s -X POST http://localhost:3030/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana@email.com","password":"123456"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -s http://localhost:3030/api/products

curl -s -X POST http://localhost:3030/api/cart/items \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"productId":"<id-do-produto>","quantity":1}'

curl -s -X POST http://localhost:3030/api/checkout \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"paymentMethod":"cash"}'
```

## Estrutura do projeto

```
├── docs/swagger.yaml          # Especificação OpenAPI 3 da API
├── public/                    # Site Web (HTML, CSS e JS)
└── src/
    ├── server.js              # Sobe o MongoDB em memória, carrega os dados e inicia o servidor
    ├── app.js                 # Configuração do Express, rotas e Swagger UI
    ├── config.js              # Porta, JWT e valores das regras de negócio
    ├── database/              # Conexão (mongodb-memory-server) e dados de teste
    ├── models/                # User, Product, Cart e Order (Mongoose)
    ├── routes/                # auth, users, products, cart e checkout
    ├── services/              # Regras de carrinho, preço e finalização de compra
    └── middleware/            # Autenticação JWT e tratamento de erros
```

## Códigos de resposta

| Código | Quando acontece |
|---|---|
| 200 / 201 | Sucesso |
| 400 | Dados inválidos (campo obrigatório, quantidade, forma de pagamento, JSON malformado) |
| 401 | Token ausente/inválido ou e-mail/senha incorretos |
| 404 | Produto ou item do carrinho não encontrado |
| 409 | E-mail já cadastrado |
| 422 | Regra de negócio violada (sem estoque, estoque insuficiente, carrinho vazio) |
