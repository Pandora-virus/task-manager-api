# Task Manager API

API Node.js em TypeScript com Prisma, PostgreSQL e autenticação JWT.

## Instalação

1. Instale dependências:

```bash
npm install
```

2. Copie o arquivo de configuração de ambiente:

```bash
cp .env.example .env
```

3. Configure o banco PostgreSQL localmente e atualize `DATABASE_URL` se necessário.

## Banco de dados

O projeto usa `docker-compose.yml` para PostgreSQL:

```bash
docker compose up -d
```

Se o Docker não estiver integrado ao WSL, use Docker Desktop e habilite a integração WSL.

## Scripts úteis

- `npm run dev` — executa o servidor em modo desenvolvimento.
- `npm run build` — compila TypeScript para `dist`.
- `npm run start` — executa o build compilado.

## Interface gráfica

A interface web estática é servida em `/` e permite:

- Registrar novo usuário em `POST /auth/register`
- Login em `POST /auth/login`
- Consumir rotas protegidas de projetos usando o token JWT

### Navegação

Abra no navegador:

```bash
http://localhost:3000/
```

## Rotas principais

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /projects` — protegido
- `POST /projects` — protegido

## Observação

O backend e a interface estão prontos. Se o banco não estiver rodando, os endpoints de autenticação e projetos retornarão erro de conexão.
