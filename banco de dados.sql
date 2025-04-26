-- CRIAÇÃO DO BANCO
DROP DATABASE IF EXISTS lanchonete;
CREATE DATABASE lanchonetes;
USE lanchonetes;

-- TABELA DO CARDÁPIO PRINCIPAL
CREATE TABLE cardapio (
	id_cardapio INT PRIMARY KEY AUTO_INCREMENT,
	nome_item VARCHAR(50),
	imagem_item VARCHAR(100)
);

-- SUB-ITENS DO CARDÁPIO
CREATE TABLE sub_cardapio (
	id_sup_cardapio INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	preco FLOAT,
	imagem VARCHAR(100),
	descricao_prod VARCHAR(150),
	cardapio_id INT,
	FOREIGN KEY (cardapio_id) REFERENCES cardapio(id_cardapio)
);

-- TABELA DE USUÁRIOS
CREATE TABLE usuario (
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
	nome_usuario VARCHAR(25),
	tipo_usuario CHAR(1) DEFAULT 'g',
	login VARCHAR(25) NOT NULL, 
	senha VARCHAR(100) NOT NULL
);

INSERT INTO usuario (nome_usuario, tipo_usuario, login, senha) VALUES
('murilo', 'a', 'murilo.caldeira', 'murilo123');

-- TABELA DE PEDIDOS (com total agora)
CREATE TABLE pedido (
	id_pedido INT PRIMARY KEY AUTO_INCREMENT,
	nome_cliente VARCHAR(50),
	mesa INT,
	total DECIMAL(10,2),
	data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ITENS DO PEDIDO
CREATE TABLE itens_pedido (
	id_item INT PRIMARY KEY AUTO_INCREMENT,
	quantidade INT NOT NULL,
	preco DECIMAL(10,2),
	pedido_id INT,
	sub_cardapio_id INT,
	FOREIGN KEY (pedido_id) REFERENCES pedido(id_pedido),
	FOREIGN KEY (sub_cardapio_id) REFERENCES sub_cardapio(id_sup_cardapio)
);

-- DADOS EXEMPLO
INSERT INTO cardapio (nome_item, imagem_item) VALUES
('Lanche', 'hamburguer.png'),
('Espetinho', 'espetinho.png');

INSERT INTO sub_cardapio (nome, preco, imagem, descricao_prod, cardapio_id) VALUES
('X-Tudo', 12.50, 'xtudo.png', 'Pão, carne, ovo, bacon, queijo, salada', 1),
('Sorvete', 6.00, 'sorvete.png', 'Sorvete de creme com cobertura', 1),
('Espetinho de Boi', 5.00, 'espetinho.png', 'Espetinho de boi com molho e farinha', 2);

-- EXEMPLO DE PEDIDO
INSERT INTO pedido (nome_cliente, mesa, total) VALUES ('Murilo', 10, 31.00);

INSERT INTO itens_pedido (quantidade, preco, pedido_id, sub_cardapio_id) VALUES
(2, 12.50, 1, 1),  -- 2 X-Tudo
(1, 6.00, 1, 2);   -- 1 Sorvete

-- CONSULTA PARA A COZINHA VER PEDIDOS
SELECT 
	p.nome_cliente,
	p.mesa,
	sc.nome AS item,
	ip.quantidade,
	ip.preco,
	p.data_hora
FROM pedido p
JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
JOIN sub_cardapio sc ON ip.sub_cardapio_id = sc.id_sup_cardapio
ORDER BY p.data_hora DESC;
