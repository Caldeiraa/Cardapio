create database lanchonete;

use lanchonete;

create table cardapio(
	id_cardapio int primary key auto_increment,
	nome_item varchar(50),
    imagem_item varchar(100)
);

create table sub_cardapio(
	id_sup_cardapio int primary key auto_increment,
    nome varchar(50),
    preco float,
    imagem varchar(100),
    cardapio_id int,
	FOREIGN KEY (cardapio_id) REFERENCES cardapio(id_cardapio)
);

insert into cardapio(nome_item,imagem_item)values(
	"lanche","hamburguer.png"
);

insert into sub_cardapio(nome,preco,imagem,cardapio_id)values(
	"x-tudo",19.99,"hamburguer.png",1
);

SELECT * FROM sub_cardapio
WHERE cardapio_id = 1;


