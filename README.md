# 🍽️ Sistema de Gestão Completo para Restaurantes (ERP/PDV)

Um sistema robusto e completo de ponta a ponta (Full-Stack) projetado para otimizar toda a operação de um restaurante. Desde a captação do pedido na mesa até a baixa automática dos ingredientes no estoque da cozinha.

## 🚀 Visão Geral do Projeto

Este projeto foi desenvolvido para resolver os gargalos reais do setor gastronômico, integrando múltiplos painéis de acesso e automatizando o controle de insumos através de Fichas Técnicas (Receitas).

### 🎯 Principais Módulos

* **📱 Cardápio Digital (Cliente):** Interface amigável e responsiva para que o cliente visualize os produtos disponíveis.
* **📝 Módulo Garçom:** Painel focado em agilidade para o lançamento de pedidos e vinculação de mesas.
* **👨‍🍳 KDS (Kitchen Display System):** Tela interativa para a cozinha gerenciar a fila de pedidos. Controla os status de "Pendente" para "Preparado" em tempo real.
* **⚙️ Painel Administrativo:** Controle total do estabelecimento. Gestão de usuários, criação de produtos, definição de categorias e monitoramento de fechamento de caixa.
* **📦 Motor de Estoque Inteligente:** * Cadastro de Receitas (Ficha Técnica) com conversão automática de unidades (Ex: Gramas para Kg).
  * **Baixa Dinâmica:** Quando o KDS marca um pedido como "Preparado", o sistema calcula e deduz automaticamente do estoque a matéria-prima exata utilizada na receita.
  * Alertas de estoque baixo configuráveis por limite mínimo de segurança.

## 💻 Tecnologias Utilizadas

A stack do projeto foi escolhida para garantir performance, escalabilidade e uma interface moderna:

**Frontend:**
* [React](https://reactjs.org/) - Biblioteca para construção das interfaces.
* [Bootstrap](https://getbootstrap.com/) - Estilização responsiva e componentes ágeis.
* [Axios](https://axios-http.com/) - Integração fluida com a API.
* [JWT-Decode](https://www.npmjs.com/package/jwt-decode) - Controle e decodificação de rotas protegidas por níveis de acesso.

**Backend & Banco de Dados:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Construção da API RESTful.
* [MySQL](https://www.mysql.com/) - Banco de dados relacional para garantia da integridade transacional (ACID) nos pedidos e estoque.

**Infraestrutura / Deploy:**
* O frontend é perfeitamente arquitetado para hospedagem em plataformas serverless, garantindo CI/CD e alta disponibilidade.

## ⚙️ Como executar o projeto localmente

### 1. Clonar o repositório
\`\`\`bash
git clone https://github.com/seu_nick/Cardapio.git
\`\`\`

### 2. Configurar o Banco de Dados
1. Certifique-se de ter o MySQL instalado e rodando.
2. Execute os scripts SQL para criar o banco `lanchonetes` e todas as tabelas e relacionamentos (`cardapio`, `receita`, `estoque`, `pedido`, etc).
3. Configure as credenciais do banco de dados no arquivo correspondente do backend.

### 3. Rodar o Backend (API)
\`\`\`bash
cd server
npm install
npm start 
\`\`\`
A API estará rodando por padrão em `http://localhost:3000`.

### 4. Rodar o Frontend (React)
\`\`\`bash
cd client
npm install
npm start
\`\`\`
Acesse o sistema no seu navegador.

## 🔮 Próximos Passos (Roadmap)
- [ ] Implementação de RPA (Automação Robótica) em Python para realizar pedidos de reposição diretamente no portal/WhatsApp de fornecedores assim que o limite mínimo de estoque for atingido.
- [ ] Dashboards gráficos de faturamento diário.

---
*Desenvolvido para fins didaticos.* ☕💻
