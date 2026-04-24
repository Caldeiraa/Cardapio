-- CRIAÇÃO DO BANCO
DROP DATABASE IF EXISTS lanchonetes;
CREATE DATABASE lanchonetes;
USE lanchonetes;

-- TABELA DO CARDÁPIO PRINCIPAL
CREATE TABLE cardapio (
	id_cardapio INT PRIMARY KEY AUTO_INCREMENT,
	nome_item VARCHAR(50),
	imagem_item VARCHAR(100)
);
TRUNCATE TABLE cardapio;

-- SUB-ITENS DO CARDÁPIO
CREATE TABLE sub_cardapio (
	id_sup_cardapio INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	preco FLOAT,
	imagem VARCHAR(100),
	descricao_prod VARCHAR(150),
	cardapio_id INT,
    ativo BOOLEAN NOT NULL DEFAULT true,
	FOREIGN KEY (cardapio_id) REFERENCES cardapio(id_cardapio)
);
select * from sub_cardapio where cardapio_id =2;

CREATE TABLE usuario (
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
	nome_usuario VARCHAR(25),
	tipo_usuario CHAR(1) DEFAULT 'g',
    ativo BOOLEAN DEFAULT true,
	login VARCHAR(25) NOT NULL, 
	senha VARCHAR(100) NOT NULL
);
select * from receita;

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
select * from sub_cardapio;


-- INGREDIENTES (estoque)
CREATE TABLE ingredientes (
	id_ingrediente INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	unidade VARCHAR(10), -- kg, g, unidade
	quantidade DECIMAL(10,2),
	minimo DECIMAL(10,2)
);

-- RECEITA (ligação produto -> ingrediente)
CREATE TABLE receita (
	id_receita INT PRIMARY KEY AUTO_INCREMENT,
	sub_cardapio_id INT,
	ingrediente_id INT,
	quantidade DECIMAL(10,2),
	FOREIGN KEY (sub_cardapio_id) REFERENCES sub_cardapio(id_sup_cardapio),
	FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id_ingrediente)
);




