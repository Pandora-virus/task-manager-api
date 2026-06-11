# Task Manager API (Kanban)

Este repositório implementa uma API REST em Node.js + TypeScript com persistência via Prisma/PostgreSQL e uma interface Kanban interativa servida como arquivos estáticos.

Conteúdo principal
- Backend em TypeScript (Express)
- Prisma ORM para acesso ao PostgreSQL
- Autenticação JWT (Bearer)
- UI estática (HTML/CSS/JS) com board Kanban e drag & drop

--

## Rápido (Getting Started)

1. Instale dependências:

```bash
npm install
```

2. Crie e configure o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
# Edite .env para ajustar DATABASE_URL, JWT_SECRET e PORT
```

3. Inicie o banco com Docker Compose (recomendado) e aplique migrações:

```bash
docker compose up -d
npx prisma migrate deploy
```

4. Rode em modo desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador.

--

## Variáveis de ambiente

Defina ao menos as seguintes variáveis em `.env`:

```env
DATABASE_URL="postgresql://<user>:<pass>@<host>:5432/<db>"
JWT_SECRET="uma-chave-secreta-robusta"
PORT=3000
```

--

## Scripts úteis

- `npm run dev` — executa a aplicação em modo desenvolvimento (ts-node / nodemon)
- `npm run build` — compila TypeScript para `dist`
- `npm run start` — inicia o build compilado em `dist`

--

## Funcionalidades principais (UI)

- Registro / Login de usuários (JWT)
- CRUD de projetos
- Board Kanban com três colunas: `pending` (A Fazer), `in_progress` (Em Progresso), `done` (Concluído)
- Drag & Drop para mover tarefas entre colunas (atualiza status via API)
- Criação e edição de tarefas dentro de um projeto

--

## Rotas principais (resumo)

- `POST /auth/register` — registrar usuário
- `POST /auth/login` — obter token JWT
- `GET /projects` — listar projetos (autenticado)
- `POST /projects` — criar projeto (autenticado)
- `GET /projects/:projectId/tasks` — listar tarefas do projeto
- `POST /projects/:projectId/tasks` — criar tarefa
- `PUT /projects/:projectId/tasks/:id` — atualizar tarefa (ex.: mudar status)

Consulte o código em `src/controllers` e `src/routes` para detalhes de implementação e validação.

--

## Deploy local (passos profissionais)

1. Ajuste `.env` com `DATABASE_URL` apontando para o serviço Postgres (Docker ou host).
2. Levante o banco com `docker compose up -d`.
3. Gere/execute migrações: `npx prisma migrate deploy`.
4. Execute a aplicação: `npm run start` ou `npm run dev` durante desenvolvimento.

Para ambientes de produção, recomenda-se usar um processo gerenciador (systemd, PM2) e configurar HTTPS/proxy reverso (nginx).

--

## Contribuição

1. Crie uma branch com sua feature: `git checkout -b feat/minha-feature`
2. Faça commits claros e pequenos
3. Abra um Pull Request descrevendo a motivação e os testes realizados

--

## Contato

Se precisar de ajuda para rodar ou deployar este projeto, envie detalhes do seu ambiente (OS, Docker instalado, versão do Node) que eu posso gerar comandos específicos ou auxiliar no deploy remoto.

--

_README atualizado automaticamente para clareza e uso profissional._
