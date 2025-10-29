# Configuração de Environments

Este diretório contém os arquivos de configuração para diferentes ambientes da aplicação.

## Arquivos

### `environment.ts` - Desenvolvimento Local
- **Uso**: Desenvolvimento local na máquina do desenvolvedor
- **API**: `http://localhost:3000/`
- **Firebase**: Projeto de desenvolvimento
- **Como usar**: `ng serve` ou `npm start`

### `environment.stage.ts` - Stage/Testes
- **Uso**: Ambiente de testes/homologação
- **API**: `https://api-stage.avancapj.com.br/` (configure conforme seu servidor)
- **Firebase**: Mesmo projeto ou projeto separado de stage
- **Como usar**: `ng build --configuration=stage`

### `environment.prod.ts` - Produção
- **Uso**: Ambiente de produção
- **API**: `https://api.avancapj.com.br/` (configure conforme seu servidor)
- **Firebase**: Projeto de produção
- **Como usar**: `ng build --configuration=production` ou `npm run build`

## Configuração

### 1. URLs da API

Atualize as URLs da API em cada arquivo conforme seu ambiente:

```typescript
// Desenvolvimento
API: 'http://localhost:3000/'

// Stage
API: 'https://api-stage.avancapj.com.br/'

// Produção
API: 'https://api.avancapj.com.br/'
```

### 2. Firebase

Idealmente, você deve ter **3 projetos Firebase separados**:
- Um para desenvolvimento
- Um para stage/testes
- Um para produção

Isso garante isolamento total dos dados entre ambientes.

### 3. VAPID Keys (Push Notifications)

Gere chaves VAPID diferentes para cada ambiente se for usar notificações push.

## Comandos de Build

```bash
# Desenvolvimento (usa environment.ts)
ng serve
npm start

# Stage (usa environment.stage.ts)
ng build --configuration=stage

# Produção (usa environment.prod.ts)
ng build --configuration=production
npm run build
```

## Segurança

⚠️ **IMPORTANTE**: 
- Nunca commite credenciais sensíveis (API keys privadas, secrets)
- As credenciais do Firebase aqui são públicas (client-side)
- Para produção, configure regras de segurança no Firebase Console
- Use variáveis de ambiente do servidor para dados sensíveis

## Estrutura do Objeto Environment

```typescript
{
  production: boolean,        // true apenas em produção
  version: string,            // Versão da aplicação
  envName: string,            // Nome do ambiente
  API: string,                // URL base da API backend
  SHARED: string,             // URL de recursos compartilhados
  wa: {                       // WhatsApp
    phoneNumber: number
  },
  push: {                     // Web Push Notifications
    vapidKey: string
  },
  bucketUrl: string,          // URL do bucket de storage
  firebase: {                 // Configuração Firebase
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
  }
}
```
