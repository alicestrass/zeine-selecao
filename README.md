# Painel de Vendedor - Marketplace 🛍️
Este projeto foi desenvolvido como parte de um processo seletivo, simulando o painel de controle de um vendedor em um marketplace. A aplicação permite que usuários se cadastrem, façam login e gerenciem seus produtos (cadastro, visualização, edição, exclusão e filtragem).

![title](./backend/uploads/login.png)
![title](./backend/uploads/cadastro.png)
![title](./backend/uploads/produtos.png)
![title](./backend/uploads/novo.png)
![title](./backend/uploads/editar.png)

## ✨ Funcionalidades
* Autenticação de Usuários: Sistema completo de Cadastro e Login com persistência de sessão via JWT.

* Dashboard de Produtos: Visualização de todos os produtos do vendedor em um layout de grade.

* CRUD de Produtos: Funcionalidade completa para Criar, Ler, Atualizar e Excluir produtos.

* Upload de Imagens: Suporte para upload de imagem no cadastro e na edição de produtos.

* Filtros Dinâmicos: Permite filtrar a lista de produtos por nome (texto) e por status (ativo, inativo, vendido).

* Interface Reativa: Frontend construído em React com uma experiência de usuário fluida e moderna, utilizando Tailwind CSS para estilização.

## 🚀 Tecnologias Utilizadas
O projeto é dividido em duas partes principais:

Frontend:

* React (com Vite): Biblioteca para construção da interface de usuário.

* React Router DOM: Para gerenciamento de rotas.

* Tailwind CSS: Framework de estilização utility-first.

* Axios: Cliente HTTP para comunicação com a API.

* Lucide React: Biblioteca de ícones.

Backend:

* Node.js: Ambiente de execução do servidor.

* Express.js: Framework para construção da API REST.

* PostgreSQL: Banco de dados relacional para armazenamento dos dados.

* JWT (JSON Web Token): Para gerenciamento de sessões e autenticação.

* Bcrypt.js: Para criptografia de senhas.

* Multer: Middleware para manipulação de uploads de arquivos.

Ambiente:

* Docker: Para rodar o banco de dados PostgreSQL em um container isolado, garantindo a consistência do ambiente.

## 📋 Pré-requisitos
Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

* Node.js (v18 ou superior)

* npm ou Yarn

* Docker

## ⚙️ Instalação e Execução
Siga os passos abaixo para rodar o projeto em seu ambiente local.

1. Clone o Repositório

```
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio

```

2. Inicie o Banco de Dados (PostgreSQL com Docker)

Execute o comando abaixo em um terminal para criar e iniciar o container do banco de dados.

```
docker run --name marketplace-db -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=user -e POSTGRES_DB=marketplace -p 5434:5432 -d postgres
```

3. Configure e Rode o Backend

Abra um novo terminal e navegue até a pasta backend:

```
cd backend
```

Crie os arquivos de variáveis de ambiente:

**bd.js**
```
    const { Pool } = require('pg');

    const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'marketplace',
    password: 'admin',
    port: 5434,
    });

    module.exports = pool;

```

**.env**
```
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

```
Instale as dependências:

```
npm install

```

Crie as tabelas no banco de dados:
```
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE produtos (

    id SERIAL PRIMARY KEY,

    nome VARCHAR(255) NOT NULL, 

    descricao TEXT,

    preco NUMERIC(10, 2) NOT NULL, 

    imagem_url VARCHAR(255),

    status VARCHAR(50) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'vendido')),

    

    usuario_id INT NOT NULL,

    categoria_id INT NOT NULL,



    CONSTRAINT fk_usuario

);      REFERENCES categorias(id)

INSERT INTO categorias (nome) VALUES ('Eletrônicos'), ('Roupas'), ('Livros'), ('Casa e Decoração');
```

Inicie o servidor backend:

```
npm run dev
```

O servidor estará rodando em http://localhost:3001.

4. Configure e Rode o Frontend

Abra um terceiro terminal e navegue até a pasta frontend:

```
cd frontend
```

Instale as dependências:

```
npm install
```
Inicie a aplicação React:

```
npm run dev
```

A aplicação será aberta automaticamente no seu navegador em http://localhost:3000 (ou outra porta indicada pelo Vite).

Pronto! A aplicação deve estar totalmente funcional. Você pode se cadastrar, fazer login e começar a gerenciar os produtos.

##🔗 Endpoints da API
Uma visão geral das rotas disponíveis na API:

Método | Rota        |Descrição                                  |Requer Autenticação 
-------|-------------|-------------------------------------------|-------------------	
POST   |/register	 |Registra um novo usuário.                  |Não
POST   |/login	     |Autentica um usuário e retorna um token.   |Não
GET	   |/categorias	 |Lista todas as categorias de produtos.     |Sim
POST   |/produtos	 |Cadastra um novo produto.                  |Sim
GET	   |/produtos	 |Lista/filtra os produtos do usuário logado.|Sim
GET	   |/produtos/:id|Busca um produto específico pelo ID.       |Sim
PUT	   |/produtos/:id|Atualiza um produto existente.             |Sim



