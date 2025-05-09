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
    ativo BOOLEAN DEFAULT true,
	login VARCHAR(25) NOT NULL, 
	senha VARCHAR(100) NOT NULL
);
select * from usuario;


-- TABELA DE PEDIDOS (com total agora)
CREATE TABLE pedido (
	id_pedido INT PRIMARY KEY AUTO_INCREMENT,
	nome_cliente VARCHAR(50),
	mesa INT,
     status ENUM('pendente', 'preparado') DEFAULT 'pendente',
	total DECIMAL(10,2),
	data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ITENS DO PEDIDO
CREATE TABLE itens_pedido (
	id_item INT PRIMARY KEY AUTO_INCREMENT,
	quantidade INT NOT NULL,
	preco DECIMAL(10,2),
	pedido_id INT,
    preparado BOOLEAN DEFAULT false,
	sub_cardapio_id INT,
	FOREIGN KEY (pedido_id) REFERENCES pedido(id_pedido),
	FOREIGN KEY (sub_cardapio_id) REFERENCES sub_cardapio(id_sup_cardapio)
);

-- DADOS EXEMPLO
INSERT INTO cardapio (nome_item, imagem_item) VALUES
('hamburguer', 'hamburguer.png'),
('espetinho', 'espetinho.png'),
('Sorvete', 'hamburguer.png'),
('Bebidas', 'espetinho.png');

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

select * from sub_cardapio;

SELECT 
    p.id_pedido,
    p.nome_cliente,
    p.mesa,
    p.data_hora,
    p.total AS total_pedido,
    sc.nome AS item,
    ip.quantidade,
    (ip.quantidade * sc.preco) AS total_item
FROM pedido p
JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
JOIN sub_cardapio sc ON ip.sub_cardapio_id = sc.id_sup_cardapio
WHERE p.data_hora BETWEEN '2025-05-01 00:00:00' AND '2025-05-04 23:59:59'
  AND p.status = 'preparado'
ORDER BY p.data_hora ASC, p.id_pedido, sc.nome;


