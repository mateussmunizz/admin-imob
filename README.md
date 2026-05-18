# ⚙️ Muniz Imóveis - Painel CRM Administrativo

Sistema de back-office exclusivo para a gestão da imobiliária. Construído como uma Single Page Application (SPA) ultrarrápida, ele consome o mesmo banco de dados da vitrine, permitindo a gestão em tempo real de imóveis, captações e visitas.

## 🚀 Tecnologias Utilizadas

* **Framework:** [React](https://react.dev/) com [Vite](https://vitejs.dev/)
* **Gerenciamento de Estado:** [React Query (@tanstack/react-query)](https://tanstack.com/query/latest)
* **Estilização:** [Styled Components](https://styled-components.com/)
* **Formulários & Validação:** React Hook Form
* **Backend & Banco de Dados:** [Supabase](https://supabase.com/)

## ✨ Funcionalidades

* **Gestão de Imóveis (CRUD):** Criação, edição e exclusão de anúncios, com upload múltiplo de imagens para o Supabase Storage.
* **Funil de Captação:** Recebimento em tempo real de leads (proprietários que desejam anunciar) vindos da vitrine, com esteira de status (Novo, Em Contato, Captado).
* **Gestão de Visitas:** Controle total sobre os agendamentos solicitados pelos clientes no site principal.
* **Interface Responsiva:** Tabelas adaptativas que se transformam em cards interativos em dispositivos móveis.

## 🛠️ Como rodar localmente

1. Clone o repositório: `git clone https://github.com/SEU_USUARIO/muniz-imoveis-admin.git`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` na raiz e adicione suas chaves do Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
4. Inicie o servidor de desenvolvimento: `npm run dev`
5. Acesse a porta indicada no terminal (geralmente `http://localhost:5173`)
