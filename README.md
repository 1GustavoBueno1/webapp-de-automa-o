# Webapp de Automação

Sistema web para gerenciar **clientes**, **automações** e a execução delas (**jobs**), com autenticação por JWT e dois perfis de acesso (`ADMIN` e `FUNCIONARIO`).

- **Backend:** Node.js + Express 5 + TypeScript, banco PostgreSQL (driver `pg`)
- **Frontend:** HTML, CSS e JavaScript puro (sem build)
- **Banco:** PostgreSQL 16 via Docker Compose

## Estrutura

```
.
├── backend/              # API REST (Express + TypeScript)
│   └── src/
│       ├── config/       # conexão com o banco
│       ├── controllers/  # camada HTTP
│       ├── services/     # regras de negócio e validações
│       ├── repositories/ # acesso ao banco (SQL)
│       ├── middlewares/  # autenticação, checagem de ADMIN, tratamento de erros
│       ├── routes/       # definição das rotas
│       └── database/migrations/  # scripts SQL das tabelas
├── frontend/             # páginas estáticas (login, dashboard, clientes, automações, jobs, usuários)
└── docker-compose.yml    # PostgreSQL
```

## Pré-requisitos

- Node.js e npm
- Docker e Docker Compose

## Como rodar

### 1. Variáveis de ambiente

Crie um arquivo `.env` na **raiz do projeto** (usado pelo Docker Compose) e outro em `backend/.env` (usado pela API). Os arquivos `.env` são ignorados pelo git.

`.env` (raiz):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=sistema_automacao
POSTGRES_PORT=5432
```

`backend/.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=sistema_automacao
JWT_SECRET=uma_chave_secreta_longa
```

> A API conecta em `localhost:5432` (valor fixo em `backend/src/config/database.ts`). Se mudar `POSTGRES_PORT`, ajuste também esse arquivo.

### 2. Subir o banco

```bash
docker compose up -d
```

### 3. Criar as tabelas

As migrations **não são executadas automaticamente**. Rode os scripts de `backend/src/database/migrations/` em ordem (001 a 005), por exemplo:

```bash
for f in backend/src/database/migrations/*.sql; do
  docker exec -i sistema_automacao_db psql -U postgres -d sistema_automacao < "$f"
done
```

(Troque `postgres` e `sistema_automacao` pelos valores do seu `.env`.)

### 4. Criar o primeiro usuário ADMIN

O cadastro de usuários (`POST /usuarios`) exige um ADMIN autenticado, então o primeiro precisa ser inserido direto no banco. A senha deve estar em hash **bcrypt** (custo 10). Gere o hash e insira:

```bash
cd backend
npm install
node -e "require('bcrypt').hash('SUA_SENHA', 10).then(console.log)"
```

```sql
INSERT INTO usuarios (nome, email, senha, role)
VALUES ('Admin', 'admin@exemplo.com', '<hash_gerado>', 'ADMIN');
```

### 5. Iniciar a API

```bash
cd backend
npm install
npm run dev
```

A API sobe em `http://localhost:3000` (porta fixa em `backend/src/server.ts`).

### 6. Abrir o frontend

O frontend é estático e chama a API em `http://localhost:3000` (definido em `frontend/js/api.js`). Sirva a pasta `frontend/` com qualquer servidor estático, por exemplo:

```bash
npx serve frontend
```

e abra `index.html` (tela de login) no endereço indicado.

## Autenticação e perfis

- `POST /usuarios/login` retorna um token JWT (validade de 1 hora).
- As demais rotas exigem o header `Authorization: Bearer <token>`.
- Perfis: `ADMIN` e `FUNCIONARIO`. Rotas marcadas como **ADMIN** abaixo retornam `403` para outros perfis.

## Endpoints

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/usuarios/login` | público | Login (email e senha) |
| POST | `/usuarios` | ADMIN | Cadastra usuário |
| GET | `/clientes` | autenticado | Lista clientes |
| GET | `/clientes/buscar` | autenticado | Busca responsável de cliente |
| POST | `/clientes` | ADMIN | Cadastra cliente |
| PATCH | `/clientes/:id` | ADMIN | Edita cliente |
| DELETE | `/clientes/:id` | ADMIN | Exclui cliente |
| GET | `/automacoes` | autenticado | Lista automações |
| GET | `/automacoes/:id` | autenticado | Busca automação por id |
| POST | `/automacoes` | ADMIN | Cadastra automação |
| POST | `/automacoes/:id/executar` | autenticado | Cria um job para a automação |
| DELETE | `/automacoes/:id` | ADMIN | Exclui automação |
| GET | `/job` | autenticado | Lista jobs |
| GET | `/job/:id` | autenticado | Busca job por id |
| PATCH | `/job/:id` | autenticado | Atualiza job (`status`, `resultado`, `erro`, `iniciado_em`, `finalizado_em`) |
| DELETE | `/job/:id` | ADMIN | Exclui job |

Status válidos de um job: `PENDENTE`, `PROCESSANDO`, `CONCLUIDO`, `ERRO`.

## Modelo de dados

- `clientes` (nome, cnpj único, responsável, email)
- `usuarios` (nome, email único, senha com hash, role)
- `automacao` (nome, tipo, `cliente_id` → clientes)
- `jobs` (`automacao_id` → automacao, status, resultado, erro, datas de criação/início/fim)

Excluir um registro que ainda tem dependentes (ex.: cliente com automações) retorna erro `400`.

## Limitações conhecidas

- Executar uma automação apenas **cria um registro de job**; não há worker que processe o job. O status é atualizado manualmente via `PATCH /job/:id`.
- Não há testes automatizados (`npm test` é um placeholder).
- Porta da API, host/porta do banco e URL da API no frontend são valores fixos no código.
