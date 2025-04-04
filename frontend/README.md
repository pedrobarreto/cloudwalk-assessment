## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Integração com Supabase Realtime](#integração-com-supabase-realtime)
- [Gerenciamento Global de Estado](#gerenciamento-global-de-estado)
- [Rotas de API Internas e SSR](#rotas-de-api-internas-e-ssr)
- [Instalação e Configuração](#instalação-e-configuração)
- [Execução e Testes](#execução-e-testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

Esta aplicação frontend é parte de um projeto completo que se integra com um backend robusto. Foi desenvolvida em Next.js, proporcionando:
- **Renderização no Lado do Servidor (SSR)** para maior segurança e desempenho.
- **Rotas de API internas** para abstrair e proteger as chamadas externas.
- **Integração com Supabase Realtime** para atualização dinâmica de componentes, como o módulo de pedidos, trazendo dados em tempo real.
- **Context API** para gerenciamento global de estado, facilitando a comunicação entre componentes e melhorando a escalabilidade da aplicação.
- **Tailwind CSS** para estilização rápida, eficiente e responsiva, garantindo uma interface moderna e consistente.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização no lado do servidor e construção de aplicações escaláveis.
- **React**: Biblioteca para construção de interfaces de usuário.
- **Supabase Realtime**: Serviço que possibilita a comunicação em tempo real, trazendo atualizações instantâneas para o componente de pedidos.
- **Context API**: Para gerenciamento global de estado, permitindo uma experiência consistente e performática.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **TypeScript**: Para tipagem estática e garantia de qualidade do código.

## Funcionalidades Principais

- **Renderização no Lado do Servidor (SSR)**: Utilização de SSR para garantir a segurança dos dados e melhorar o SEO, além de reduzir o tempo de carregamento inicial.
- **Rotas de API Internas**: Implementação de endpoints internos que atuam como camada intermediária, agregando segurança e facilitando a integração com serviços externos.
- **Integração com Supabase Realtime**: Componente de pedidos que se atualiza em tempo real, refletindo alterações assim que ocorrem no backend.
- **Gerenciamento Global de Estado**: Uso da Context API para gerenciar estados críticos da aplicação, permitindo que informações sejam compartilhadas entre componentes sem a necessidade de prop drilling.
- **Estilização com Tailwind CSS**: Permite um desenvolvimento rápido e responsivo, com classes utilitárias que garantem uma interface moderna e consistente.

## Integração com Supabase Realtime

A aplicação faz uso intensivo do **Supabase Realtime** para oferecer uma experiência interativa e dinâmica. Por meio dessa integração, o componente de pedidos é atualizado automaticamente sempre que há alterações no backend, garantindo que o usuário tenha acesso a dados atualizados em tempo real sem a necessidade de recarregar a página.

## Gerenciamento Global de Estado

Para otimizar a performance e a manutenção da aplicação, foi implementada a **Context API** do React. Essa abordagem permite:
- **Centralização do estado**: Todos os estados críticos da aplicação ficam centralizados, facilitando a manutenção e escalabilidade.
- **Compartilhamento de dados**: Componentes em diferentes níveis da hierarquia podem acessar e modificar o estado global sem a necessidade de passar props manualmente.
- **Melhor experiência do usuário**: Atualizações e sincronizações ocorrem de maneira rápida e fluida.

## Rotas de API Internas e SSR

A aplicação utiliza **rotas de API internas** para:
- **Abstrair a comunicação** com serviços externos e o backend.
- **Melhorar a segurança**: Ao utilizar rotas internas e SSR, informações sensíveis não são expostas diretamente no cliente.
- **Otimizar a performance**: A renderização no lado do servidor (SSR) proporciona carregamento mais rápido das páginas e melhor indexação por mecanismos de busca.

## Instalação e Configuração

### Pré-requisitos

- **Node.js** (versão LTS recomendada)
- **npm** ou **yarn**

### Passos para instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio-frontend.git
   cd seu-repositorio-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuração das variáveis de ambiente:**

   Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias, por exemplo:
   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://sua-url.supabase.co
   NEXT_PUBLIC_SUPABASE_API_KEY=sua-chave-supabase
   ```

## Execução e Testes

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000.

Para construir o projeto para produção:
```bash
npm run build
npm start
```

Testes unitários e de integração podem ser executados com:
```bash
npm test
```

## Contribuição

Contribuições são sempre bem-vindas! Siga os passos abaixo para colaborar com o projeto:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Realize as modificações e commits com mensagens claras e descritivas.
4. Abra um Pull Request para a branch principal do projeto.

## Licença

Este projeto está licenciado sob a MIT License.
