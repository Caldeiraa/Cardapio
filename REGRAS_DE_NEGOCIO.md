# Regras de Negócio - Sistema de Gestão de Restaurante

Este documento descreve as regras de funcionamento do sistema. Você pode modificar este arquivo conforme a necessidade do negócio evoluir.

## 1. Perfis de Acesso e Permissões

O sistema possui quatro níveis de acesso baseados no cargo do usuário:

*   **Cliente:**
    *   Acesso exclusivo ao **Cardápio Digital**.
    *   Não pode realizar pedidos diretamente (visualização apenas).
*   **Garçom:**
    *   Acesso ao **Cardápio de Pedidos**.
    *   Pode realizar novos pedidos vinculados a uma mesa e nome de cliente.
*   **Cozinha:**
    *   Acesso à **Tela de Pedidos (Cozinha)**.
    *   Visualiza pedidos pendentes.
    *   Pode marcar itens individuais ou o pedido completo como "Preparado".
*   **Gerente (Acesso Total):**
    *   Cargo de maior hierarquia.
    *   Gerenciamento de usuários (adicionar/remover/desativar logins).
    *   Gerenciamento de itens do cardápio (CRUD de categorias e produtos).
    *   Gerenciamento de Estoque e Receitas.
    *   Acesso ao **Fechamento de Caixa** (faturamento histórico e exportação para Excel).

## 2. Fluxo de Pedidos

1.  **Criação:** O Garçom registra o pedido informando mesa, nome do cliente e itens selecionados. O status inicial é `pendente`.
2.  **Preparação:**
    *   O pedido aparece na tela da Cozinha.
    *   A cozinha pode marcar itens específicos como preparados.
    *   Ao finalizar o pedido completo (mudar status para `preparado`), o sistema dispara automaticamente a **baixa de estoque**.
3.  **Finalização:** Pedidos preparados saem da fila ativa da cozinha.

## 3. Gestão de Estoque e Receitas

*   **Ingredientes:** Cada ingrediente possui uma unidade de medida (kg, g, unidade) e uma quantidade mínima de segurança.
*   **Receitas:** Um item do cardápio (ex: Hambúrguer) pode ser composto por vários ingredientes (ex: 1 pão, 150g de carne, 20g de queijo).
*   **Baixa Automática:** Quando um pedido é marcado como "Preparado", o sistema consulta a receita de cada item vendido e subtrai as quantidades correspondentes do estoque de ingredientes.
*   **Alerta de Estoque:** O sistema monitora ingredientes que atingem a quantidade mínima definida.

## 4. Financeiro e Fechamento de Caixa

*   **Registro de Vendas:** O total de cada pedido é armazenado no momento da criação.
*   **Fechamento:** O gerente pode filtrar as vendas por período (data/hora).
*   **Exportação:** Os dados de faturamento podem ser exportados para arquivos Excel para contabilidade externa.

## 5. Regras de Cadastro

*   **Ativação/Desativação:** Itens e usuários não devem ser excluídos permanentemente se houver histórico, mas sim marcados como "inativos" (`ativo = false`) para preservar a integridade dos dados antigos.
*   **Imagens:** O upload de imagens é obrigatório para categorias e itens do cardápio para garantir a identidade visual do sistema.

---
*Documento gerado em 01/06/2026. Sinta-se à vontade para editar as seções acima.*
