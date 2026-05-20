# ⚙️ Muniz Imóveis - Painel CRM Administrativo

Esta é a aplicação interna de gestão da **Muniz Imóveis**. Trata-se de uma Single Page Application (SPA) restrita a funcionários, projetada para gerenciar todo o fluxo da imobiliária: aprovação de anúncios, controle de clientes, métricas de vendas e agendamentos.

Este projeto é parte de um ecossistema maior e consome o mesmo banco de dados da **Vitrine (Área do Cliente)**.

---

## 🔗 Links Importantes

* ⚙️ **Acesse o Painel (Live Demo):** [https://admin-imob-omega.vercel.app/login](https://admin-imob-omega.vercel.app/login)
* 🌍 **Repositório da Vitrine Frontend:** [[Insira o link do seu outro repositório aqui]](https://muniz-imoveis-vitrine.vercel.app/)

---

## 🏗️ Tecnologias Utilizadas

A aplicação foi construída para ser um painel dinâmico, rápido e altamente interativo, utilizando a arquitetura clássica de SPA:

* **Framework:** React com Vite
* **Roteamento:** React Router DOM
* **Gerenciamento de Estado de Servidor:** React Query (@tanstack/react-query)
* **Estilização:** Styled Components
* **Banco de Dados & Autenticação:** Supabase (PostgreSQL e Supabase Auth)
* **Notificações:** React Hot Toast

---

## 🚀 Como testar localmente

Siga os passos abaixo para rodar o painel administrativo na sua máquina:

1. Clone este repositório e acesse a pasta:
   ```bash
   git clone <link-deste-repositorio>
   cd admin-imob
Instale as dependências:

Bash
npm install
Crie um arquivo .env na raiz do projeto e adicione as chaves públicas (no Vite, é obrigatório o uso do prefixo VITE_):

Snippet de código
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_KEY=sua_chave_anonima_do_supabase
Inicie o servidor de desenvolvimento:

Bash
npm run dev
O Painel Administrativo estará disponível no seu navegador em http://localhost:5173.

👨‍💻 Sobre o Projeto
Desenvolvido por Mateus Muniz, concluinte de Sistemas de Informação na FAM (Centro Universitário das Américas). Este painel foi construído para simular uma ferramenta de retaguarda (backoffice) robusta, aplicando conceitos avançados de gerenciamento de cache e rotas protegidas.
