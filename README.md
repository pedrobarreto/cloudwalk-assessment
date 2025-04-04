[![video demo](https://img.youtube.com/vi/NVHjakUPfaQ/0.jpg)](https://www.youtube.com/watch?v=NVHjakUPfaQ)

# Cardápio Digital para Food Trucks

Este projeto foi desenvolvido para oferecer uma solução simples e inovadora de cardápio digital para food trucks. A ideia é eliminar a necessidade de um caixa dedicado, permitindo que o cliente faça o pedido de forma autônoma ao escanear um QR Code. Com a solução *Infinitetap*, o pedido é registrado e processado em tempo real, proporcionando uma experiência rápida, segura e moderna.

---

## Visão Geral do Projeto

- **Pedido Autônomo:** O cliente escaneia o QR Code disponível no food truck, acessa o cardápio digital, seleciona os produtos desejados e finaliza o pedido utilizando a solução *Infinitetap*.
- **Fila Virtual:** Após o pedido, o cliente acompanha em tempo real sua posição na fila virtual e o tempo estimado para a entrega.
- **Insights de IA:** O proprietário do food truck recebe insights avançados de inteligência artificial, que monitoram o tempo de preparo dos pedidos (similar a um Pomodoro) e fornecem recomendações para melhorar o processo, identificando possíveis gargalos.
- **Controle Operacional:** Além de oferecer uma experiência de pedido inovadora, a plataforma permite ao dono do food truck gerir e otimizar o fluxo de atendimento e preparo dos pedidos.

---

## Tecnologias Utilizadas

### Backend
- **Node.js**, **TypeScript** e **Express**
- Autenticação e integração com **Supabase**
- Geração de insights com **OpenAI**

Consulte o [README do Backend](https://github.com/pedrobarreto/cloudwalk-assessment/blob/dev/backend/readme.md) para mais detalhes.

### Frontend
- **Next.js** com renderização no lado do servidor (SSR)
- **Supabase Realtime** para atualização instantânea dos dados
- **Context API** para gerenciamento global de estado
- **Tailwind CSS** para estilização moderna e responsiva

Consulte o [README do Frontend](https://github.com/pedrobarreto/cloudwalk-assessment/blob/dev/frontend/README.md) para mais detalhes.

---

## Funcionalidades

- **Cardápio Digital:** Interface intuitiva que permite aos clientes visualizar e selecionar produtos sem a necessidade de interação com um atendente.
- **Pedido em Tempo Real:** A integração com Supabase Realtime garante que os pedidos sejam atualizados instantaneamente, mantendo todos os usuários sincronizados.
- **Fila Virtual de Pedidos:** Permite que o cliente acompanhe o tempo restante para a entrega, visualizando sua posição na fila.
- **Insights Operacionais:** O sistema monitora o tempo de preparo dos pedidos e, por meio de inteligência artificial, oferece recomendações para otimizar o fluxo operacional do food truck.
- **Segurança e Eficiência:** Uso de rotas de API internas com SSR para aumentar a segurança e desempenho da aplicação, garantindo que informações sensíveis não sejam expostas diretamente.

---

## Benefícios

- **Agilidade no Atendimento:** Redução significativa do tempo de espera e do processo de finalização do pedido.
- **Eficiência Operacional:** Identificação de gargalos e otimização do tempo de preparo, melhorando o fluxo de trabalho.
- **Autonomia para o Cliente:** Eliminação da necessidade de um caixa físico, permitindo que o cliente faça seu pedido de forma independente.
- **Transparência:** Monitoramento em tempo real do status do pedido, proporcionando uma experiência de usuário mais confiável e informada.
- **Insights Valiosos:** A inteligência artificial integrada fornece feedback contínuo para aprimorar os processos internos do food truck.

---

## Como Funciona

1. **Acesso ao Cardápio:** O cliente escaneia o QR Code no food truck e é direcionado ao cardápio digital.
2. **Seleção de Produtos:** Navega pelo cardápio, escolhe os itens desejados e finaliza o pedido utilizando a solução *Infinitetap*.
3. **Registro e Processamento:** O pedido é enviado ao backend e processado em tempo real, atualizando a fila virtual.
4. **Monitoramento de Tempo:** O sistema acompanha o tempo de preparo do pedido, fornecendo ao proprietário insights e recomendações para melhorar a eficiência.
5. **Acompanhamento do Pedido:** O cliente visualiza sua posição na fila virtual e recebe uma estimativa do tempo para a entrega.

---

## Considerações Finais

Esta solução inovadora transforma a experiência de atendimento em food trucks, automatizando o processo de pedidos e integrando tecnologias modernas para oferecer agilidade e eficiência. Ao unir o controle operacional com uma experiência de usuário excepcional, o projeto demonstra conhecimento avançado em desenvolvimento web e integrações em tempo real, ideal para atender às demandas de um ambiente dinâmico e competitivo.

