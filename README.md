# API de Autenticação com Express, Sequelize, SQLite e JWT

Esta é uma API simples de autenticação que utiliza **Express**, **Sequelize**, **SQLite** e **JSON Web Tokens (JWT)** para gerenciar registro e login de usuários e permitir o cadastro e gerenciamento de produtos para usuários autenticados.

## Tecnologias Utilizadas

- **Express**: Framework web para Node.js.
- **Sequelize**: ORM (Object-Relational Mapping) para Node.js, usado para interagir com o banco de dados.
- **SQLite**: Banco de dados relacional leve usado para armazenamento de dados.
- **bcryptjs**: Biblioteca para criptografia de senhas.
- **jsonwebtoken**: Biblioteca para geração e verificação de tokens JWT.

## Cliente para consumir API: 
https://github.com/FernandoIzidio/produtos-api/

## Instalação


### 1. Clone o repositório:

```bash
git clone https://github.com/FernandoIzidio/produtos-api.git
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Execute a API:
```bash
npm start
```

## Endpoints da API
### 1. Registro de Usuário
 * Endpoint: **/register**
 * Método: POST
 * Descrição: Registra um novo usuário no sistema.

 * Corpo da Requisição:
   
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "username": "johndoe",
  "password": "password123",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "cpf": "12345678901",
  "birthdate": "1990-01-01"
}
```

 * Resposta de Sucesso: 201 Created:

```json
{
  "status": "Success"
}
```
* Resposta de Erro: 400 Bad Request:

```json
[
  {
    "field": "usernameError",
    "defaultMessage": "Usuário já cadastrado"
  }
]

```
* Resposta de Falha: 500 Internal Server Error:
```json
{
  "status": "Failure"
}
```

### 2. Login de Usuário
   * Endpoint: **/login**
   * Método: POST
   * Descrição: Autentica um usuário e retorna um token JWT.
   * Corpo da Requisição:

```json
{
  "username": "johndoe",
  "password": "password123"
}
```
 * Resposta de Sucesso: 200 OK
```json
   {
   "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "gender": "Male",
      "username": "johndoe",
      "password": "HASH",
      "email": "johndoe@example.com",
      "phone": "1234567890",
      "cpf": "12345678901",
      "birthdate": "1990-01-01T00:00:00.000Z",
      "createdAt": "2024-09-03T16:43:56.215Z",
      "updatedAt": "2024-09-03T16:43:56.215Z"
   },
   "token": "TOKEN-HERE"
}
```
* Resposta de Erro: 401 Unauthorized

```json
{ 
  "auth": false, 
  "message" : "Invalid Credentials"
}
```


### 3. Listar Produtos do Usuário
* Endpoint: **/user/products**

* Método: GET

* Descrição: Retorna todos os produtos associados ao usuário autenticado.

* Autenticação: Requer um token JWT válido no header da requição **x-access-token**.

* Resposta de Sucesso: 200 OK

```json
[
  {
    "id": 1,
    "name": "Produto A",
    "description": "Descrição do Produto A",
    "price": 99.99,
    "quantity": 10,
    "userId": 1,
    "createdAt": "2024-09-03T16:43:56.215Z",
    "updatedAt": "2024-09-03T16:43:56.215Z"
  },
  {
    "id": 2,
    "name": "Produto B",
    "description": "Descrição do Produto B",
    "price": 149.99,
    "quantity": 5,
    "userId": 1,
    "createdAt": "2024-09-03T16:43:56.215Z",
    "updatedAt": "2024-09-03T16:43:56.215Z"
  }
]
```

* Resposta de Falha: 500 Internal Server Error:
```json
{
  "status": "Failure"
}
```


### 4. Obter Detalhes de um Produto
* Endpoint: **/products/:id**

* Método: GET

* Descrição: Retorna os detalhes de um produto específico pelo seu ID.

* Parâmetros de URL: id (ID do produto)

* Autenticação: Requer um token JWT válido no cabeçalho **x-access-token**.

* Resposta de Sucesso: 200 OK

```json
{
  "id": 1,
  "name": "Produto A",
  "description": "Descrição do Produto A",
  "price": 99.99,
  "quantity": 10,
  "userId": 1,
  "createdAt": "2024-09-03T16:43:56.215Z",
  "updatedAt": "2024-09-03T16:43:56.215Z"
}
```


* Resposta de Falha: 500 Internal Server Error:
```json
{
  "status": "Failure"
}
```

### 5. Criar Novo Produto
* Endpoint: **/products**

* Método: POST

* Descrição: Cria um novo produto para o usuário autenticado.

* Autenticação: Requer um token JWT válido no cabeçalho **x-access-token**.

* Corpo da Requisição:
```json
{
  "name": "Produto C",
  "description": "Descrição do Produto C",
  "price": 199.99,
  "quantity": 20,
  "userId": 1
}
```
* Resposta de Sucesso: 201 Created
```json
{
  "status": "Success"
}
```

* Resposta de Falha: 500 Internal Server Error:
```json
{
  "status": "Failure"
}
```

### 6. Atualizar Produto
   * Endpoint: **/products**

   * Método: PUT

   * Descrição: Atualiza as informações de um produto existente.
    
   * Autenticação: Requer um token JWT válido no cabeçalho **x-access-token**.
    
   * Corpo da Requisição:

```json
{
  "id": 1,
  "name": "Produto A Atualizado",
  "description": "Descrição atualizada",
  "price": 89.99,
  "quantity": 15
}

```

* Resposta de Sucesso: 200 Success

```json
{
  "status": "Success"
}
```


* Resposta de Falha: 500 Internal Server Error:
```json
{
  "status": "Failure"
}
```


### 7. Deletar Produto
   * Endpoint: **/products/:id**
   * Método: DELETE
   *Descrição: Remove um produto específico pelo seu ID.
   * Parâmetros de URL: id (ID do produto)

   * Autenticação: Requer um token JWT válido no cabeçalho **x-access-token**.


* Resposta de Sucesso: 200 Success

```json
{
  "status": "Success"
}
```


* Resposta de Falha: 500 Internal Server Error:
```json
{
  "status": "Failure"
}
```

## Observações
 * Certifique-se de que o arquivo **authToken.js** esteja devidamente configurado para gerenciar tokens JWT.
 * Altere **SECRET_KEY** em app.js para um valor mais seguro em um ambiente de produção.
## Contribuição
* Sinta-se à vontade para contribuir abrindo uma issue ou enviando um pull request.

## Licença
* Este projeto está licenciado sob a licença MIT.
