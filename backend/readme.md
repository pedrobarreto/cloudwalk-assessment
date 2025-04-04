# Backend API

Esta API foi desenvolvida utilizando Node.js, TypeScript e Express. O projeto adota uma arquitetura modular, onde as responsabilidades estão bem separadas em rotas, controladores (controllers), serviços (services), middlewares e modelos (interfaces/types). Além disso, a aplicação integra o Supabase para autenticação e o OpenAI para geração de insights de produtos.

## Índice
- [Visão Geral](#visão-geral)
- [Arquitetura e Organização](#arquitetura-e-organização)
- [Rotas e Endpoints](#rotas-e-endpoints)
- [Middlewares](#middlewares)
- [Controllers e Serviços](#controllers-e-serviços)
- [Modelos e Tipagens](#modelos-e-tipagens)
- [Instalação e Configuração](#instalação-e-configuração)
- [Execução e Testes](#execução-e-testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral
Esta API fornece funcionalidades para:

- **Usuários**: Criação, autenticação (login), verificação via SMS, e operações de consulta, atualização e deleção.
- **Produtos**: Criação, listagem, atualização e remoção de produtos, além de listagem filtrada por marca.
- **Pedidos**: Criação, consulta, atualização e deleção de pedidos, bem como a listagem de pedidos vinculados a um usuário ou cliente.
- **Insights**: Geração de insights sobre produtos utilizando inteligência artificial (OpenAI).

## Arquitetura e Organização
O projeto segue uma estrutura modular com as seguintes pastas principais:

- **routes/**: Contém os arquivos de rota para usuários, pedidos, produtos e insights. Cada módulo exporta um array de AppRoute que define o método HTTP, o caminho, os middlewares associados e o controlador correspondente.
- **controllers/**: Responsáveis por receber as requisições, processar dados via serviços e retornar as respostas apropriadas.
- **services/**: Implementam a lógica de negócio e comunicação com a camada de persistência (banco de dados ou APIs externas).
- **middlewares/**: Contêm funções intermediárias, como o authMiddleware, que valida tokens de autenticação utilizando o Supabase.
- **types/**: Define as interfaces e tipagens do projeto, incluindo os modelos para User, Product, Order, Payment e Insight.
- **config/**: Configurações de ambiente e clientes externos, como o supabaseClient e a integração com o OpenAI.

## Rotas e Endpoints

O arquivo principal de rotas agrega os módulos:

```typescript
export const routes: AppRoute[] = [
  ...usersRoutes,
  ...ordersRoutes,
  ...productsRoutes,
  ...insightsRoutes
];
```

### Exemplos de Endpoints

#### Usuários
- **POST /users** - Criação de usuário.
- **POST /login** - Autenticação via login.
- **POST /verify-sms** - Verificação de código via SMS e login.
- **GET /users/:id** - Consulta de usuário (autenticado).
- **PUT /users/:id** - Atualização de usuário (autenticado).
- **DELETE /users/:id** - Remoção de usuário (autenticado).

#### Pedidos
- **POST /orders** - Criação de pedido.
- **GET /orders** - Listagem de pedidos (autenticado).
- **GET /orders/:id** - Consulta de pedido específico (autenticado).
- **PUT /orders/:id** - Atualização de pedido (autenticado).
- **DELETE /orders/:id** - Exclusão de pedido (autenticado).

#### Produtos
- **POST /products** - Criação de produto (autenticado).
- **GET /products** - Listagem de produtos do usuário (autenticado).
- **GET /products/:id** - Consulta de produto (autenticado).
- **PUT /products/:id** - Atualização de produto (autenticado).
- **DELETE /products/:id** - Exclusão de produto (autenticado).
- **GET /:brand** - Listagem de produtos filtrados por marca.

#### Insights
- **POST /insights** - Geração de insights sobre produto com base em dados (nome, descrição, preço).

## Middlewares

O middleware de autenticação (authMiddleware) é responsável por:

- Verificar se o header da requisição possui o token no formato Bearer <token>.
- Validar o token utilizando a API do Supabase.
- Bloquear o acesso caso o token seja inválido ou ausente, retornando um erro 401 Unauthorized.

Este mecanismo garante que endpoints críticos estejam protegidos e acessíveis apenas a usuários autenticados.

## Controllers e Serviços

Cada controlador é responsável por:

- Receber a requisição do cliente.
- Invocar a camada de serviços para executar a lógica de negócio.
- Tratar erros e retornar respostas HTTP apropriadas.

### Exemplos:
- **usersController**: Gerencia operações de criação de usuário, login, verificação via SMS e manipulação de dados do usuário.
- **productsController**: Gerencia operações CRUD para produtos e filtração por marca.
- **ordersController**: Gerencia a criação e manipulação de pedidos, garantindo a consistência e validação dos dados.
- **insightsController**: Utiliza o serviço generateProductInsightsService para processar dados de produto e retornar insights gerados por IA.

## Modelos e Tipagens

O projeto utiliza tipagens TypeScript para garantir a consistência dos dados. Alguns exemplos:

### Product

```typescript
export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  created_at: string;
}
```

### Order e OrderItem

```typescript
export interface Order {
  id: string;
  user_id: string;
  customer_id?: string | null;
  customer_name: string;
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}
```

### Insight

```typescript
export interface Insight {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}
```

Além disso, existem definições de tipos para usuários (OwnerUser, CustomerUser), métodos de pagamento, status e outros.

## Instalação e Configuração

### Pré-requisitos
- Node.js (versão LTS recomendada)
- npm ou yarn
- Conta no Supabase para autenticação
- API Key do OpenAI para geração de insights

### Passos para instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configuração das variáveis de ambiente:

Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```dotenv
PORT=3000
SUPABASE_URL=https://sua-url.supabase.co
SUPABASE_API_KEY=sua-chave-supabase
OPENAI_API_KEY=sua-chave-openai
```

4. Build do projeto (se necessário):
```bash
npm run build
```

## Execução e Testes

Para iniciar o servidor em ambiente de desenvolvimento:
```bash
npm run dev
```

O servidor iniciará na porta configurada (por padrão, 3000). Você pode testar os endpoints utilizando ferramentas como Postman ou Insomnia.

Caso haja testes unitários ou de integração, você pode executá-los com:
```bash
npm test
```

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir com o projeto:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Faça as modificações e commits com mensagens descritivas.
4. Abra um Pull Request para a branch main.

## Licença

Este projeto está licenciado sob a MIT License.
