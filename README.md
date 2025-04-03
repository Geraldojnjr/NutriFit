# NutriFit - Gerenciador de Receitas Fitness

NutriFit é uma aplicação web moderna para gerenciamento de receitas fitness, desenvolvida com React, TypeScript e Node.js. A aplicação permite que usuários armazenem, organizem e visualizem receitas com foco em nutrição e fitness.

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - React Router

- **Backend:**
  - Node.js
  - Express
  - MariaDB
  - Multer (para upload de imagens)

- **Infraestrutura:**
  - Docker
  - Docker Compose

## 📁 Estrutura do Projeto

```
recipe-fitness-haven/
├── src/                    # Código fonte do frontend
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── ui/            # Componentes de UI base (shadcn)
│   │   └── ...            # Outros componentes
│   ├── context/           # Contextos React (gerenciamento de estado)
│   ├── hooks/             # Hooks personalizados
│   ├── integrations/      # Integrações com serviços externos
│   │   ├── database/      # Configuração e cliente do banco de dados
│   │   └── supabase/      # Configuração do Supabase (alternativa)
│   ├── lib/               # Utilitários e funções auxiliares
│   ├── pages/             # Páginas/rotas da aplicação
│   └── types/             # Definições de tipos TypeScript
├── server.ts              # Servidor backend Express
├── uploads/               # Diretório para arquivos enviados
├── db/                    # Scripts e configurações do banco de dados
├── public/                # Arquivos estáticos
├── Dockerfile.frontend    # Dockerfile para o frontend
├── Dockerfile.backend     # Dockerfile para o backend
├── docker-compose.yml     # Configuração do Docker Compose
└── package.json           # Dependências e scripts
```

## 🛠️ Pré-requisitos

- Docker
- Docker Compose
- Git

## 🔧 Configuração do Ambiente

### Usando Docker (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/recipe-fitness-haven.git
   cd recipe-fitness-haven
   ```

2. Inicie os containers:
   ```bash
   docker-compose up -d
   ```

3. Acesse a aplicação:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8083
   - MariaDB: localhost:3306

### Configuração Manual (Alternativa)

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/recipe-fitness-haven.git
   cd recipe-fitness-haven
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Crie um banco de dados MariaDB chamado `recipe_manager`
   - Execute o script SQL em `db/export.sql` para criar as tabelas

4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=recipe_manager
   ```

## 🚀 Executando o Projeto

### Usando Docker

1. Inicie todos os serviços:
   ```bash
   docker-compose up -d
   ```

2. Para parar os serviços:
   ```bash
   docker-compose down
   ```

3. Para ver os logs:
   ```bash
   docker-compose logs -f
   ```

### Configuração Manual

1. Inicie o servidor backend:
   ```bash
   npm run dev:server
   ```
   O servidor backend rodará na porta 8083.

2. Em outro terminal, inicie o servidor frontend:
   ```bash
   npm run dev
   ```
   O frontend estará disponível em http://localhost:5173

## 📱 Funcionalidades

- 📝 Cadastro e gerenciamento de receitas
- 🖼️ Upload de imagens para as receitas
- 📊 Informações nutricionais detalhadas
- 🔍 Busca e filtros de receitas
- 📱 Interface responsiva
- 🌙 Modo escuro/claro

## 🔒 Segurança

- Validação de entrada de dados
- Sanitização de dados
- Headers de segurança configurados
- Proteção contra uploads maliciosos
- Isolamento de containers Docker
- Rede Docker dedicada

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Seu Nome - [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) pelos componentes
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [React](https://reactjs.org/) pela biblioteca
- [Node.js](https://nodejs.org/) pelo runtime
- [Docker](https://www.docker.com/) pela plataforma de containerização

