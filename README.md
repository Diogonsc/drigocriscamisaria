# DrigoCris Camisaria - Loja de Roupas, Calçados e Acessórios

## Sobre o Projeto

Este é um projeto de e-commerce desenvolvido para a loja DrigoCris Camisaria, especializada em roupas, calçados e acessórios. O projeto oferece uma experiência de compra moderna e responsiva, com checkout integrado via WhatsApp.

## Tecnologias Utilizadas

Este projeto é construído com:

- **Vite** - Build tool e dev server
- **TypeScript** - Linguagem de programação
- **React** - Biblioteca para interfaces de usuário
- **shadcn-ui** - Componentes de UI modernos
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento da aplicação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

```sh
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Navegue para o diretório do projeto
cd shop-share-cart

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run build:dev` - Gera a build de desenvolvimento
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza a build de produção

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
│   ├── store/     # Componentes específicos da loja
│   └── ui/        # Componentes de UI reutilizáveis
├── config/        # Configurações do projeto
├── data/          # Dados estáticos
├── hooks/         # Custom hooks
├── lib/           # Utilitários e configurações
├── pages/         # Páginas da aplicação
├── types/         # Definições de tipos TypeScript
└── utils/         # Funções utilitárias
```

## Funcionalidades

- **Catálogo de Produtos** - Visualização de produtos com imagens e detalhes
- **Carrinho de Compras** - Adição e remoção de produtos
- **Checkout via WhatsApp** - Integração direta com WhatsApp para finalização de compras
- **Layout Responsivo** - Interface otimizada para dispositivos móveis
- **Tema Escuro/Claro** - Suporte a múltiplos temas

## Deploy

Para fazer o deploy do projeto:

1. Execute `npm run build` para gerar os arquivos de produção
2. Faça upload dos arquivos da pasta `dist` para seu servidor web
3. Configure o servidor para servir o `index.html` para todas as rotas (SPA)

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
# drigocriscamisaria
