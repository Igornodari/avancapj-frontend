# AvançaPJ Frontend

Frontend Angular da plataforma AvançaPJ - Interface moderna com questionário de perfil interativo.

## 🚀 Tecnologias

- **Angular 20** - Framework frontend
- **TypeScript 5.9** - Linguagem tipada
- **Angular Material 20** - Componentes UI
- **Firebase 11** - Autenticação e serviços
- **RxJS 7.8** - Programação reativa

## 📋 Funcionalidades

### ✅ Sistema de Autenticação
- Login com email/senha
- Login com Google
- Recuperação de senha
- Guards de proteção de rotas

### ✅ Questionário Interativo
- Interface moderna e responsiva
- 4 perguntas sobre o negócio
- Navegação fluida entre perguntas
- Barra de progresso visual
- Validação de respostas
- Suporte a 3 tipos de pergunta

### ✅ Gestão de Perfil
- Redirecionamento automático
- Perfil personalizado
- Ferramentas recomendadas

## 📦 Instalação

```bash
# Instalar dependências
npm install
```

## 🔧 Configuração

Configure o Firebase em `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "sua-api-key",
    authDomain: "seu-auth-domain",
    projectId: "seu-project-id",
    storageBucket: "seu-storage-bucket",
    messagingSenderId: "seu-sender-id",
    appId: "seu-app-id"
  }
};
```

## 🏃 Execução

```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Testes
npm run test
```

Acesse: **http://localhost:4200**

## 🎨 Componentes Principais

### QuestionnaireComponent
Componente responsável pelo questionário de perfil:
- Carrega perguntas do backend
- Gerencia navegação entre perguntas
- Valida respostas
- Envia dados ao backend

### AuthService
Serviço de autenticação:
- Login com Firebase
- Verificação de questionário
- Redirecionamento inteligente

## 📱 Fluxo de Uso

### Novo Usuário
1. Login → Questionário → Home

### Usuário Existente
1. Login → Home (direto)

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── pages/
│   │   ├── authentication/
│   │   │   ├── login/
│   │   │   ├── questionnaire/      # Componente do questionário
│   │   │   └── forgot-password/
│   │   ├── home/
│   │   └── account/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── questionnaire.service.ts
│   │   └── request.service.ts
│   └── shared/
├── assets/
└── environments/
```

## 🔐 Segurança

- Guards de autenticação em todas as rotas protegidas
- Tokens JWT armazenados de forma segura
- Validação de formulários
- Proteção contra XSS

## ⚠️ Observações

**Firebase**: Configure um projeto Firebase para autenticação funcionar corretamente.

**Backend**: Certifique-se de que o backend está rodando em `http://localhost:3000`.

## 🎯 Próximos Passos

- [ ] Testes E2E com Cypress
- [ ] PWA completo
- [ ] Internacionalização
- [ ] Modo offline
- [ ] Notificações push

## 🔗 Links

- [Backend](https://github.com/Igornodari/avancapj-backend)

## 📝 Licença

Projeto privado - Todos os direitos reservados
