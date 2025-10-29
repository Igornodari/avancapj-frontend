# AvançaPJ — Setup rápido

## 1) Limpeza feita
- Removidos configs sensíveis de Firebase e API nas `src/environments/*.ts`.
- `.firebaserc` trocado por placeholders.
- `.gitignore` atualizado para ignorar `environment*.ts` locais.
- Arquivo de exemplo criado: `src/environments/environment.sample.ts`.

## 2) Como colocar **seu Firebase**
1. Crie um projeto no [Firebase Console].
2. Adicione um **App Web** e copie o config (apiKey, authDomain, etc.).
3. Em **Authentication > Sign-in method**, ative:
   - Email/Password
   - Google (opcional) e configure o domínio autorizado.
4. Em **Firestore**, clique **Create database** (modo production).
5. Em **Project settings > Cloud Messaging**, gere a **Web Push certificate (VAPID key)** e preencha `push.vapidKey`.
6. No projeto, duplique `src/environments/environment.sample.ts` para:
   - `src/environments/environment.ts` (dev)
   - `src/environments/environment.prod.ts` (prod)
   - Ajuste os campos em `firebase` e `API`.

## 3) Como conectar um **banco de dados** (NestJS + TypeORM)
A aplicação front chama um backend em `environment.API` e usa Firebase ID Token para login.
Implemente um backend NestJS:
```bash
nest new api
cd api
npm i @nestjs/typeorm typeorm mysql2 @nestjs/config firebase-admin jsonwebtoken bcrypt
```

`src/app.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // desative em produção
    }),
  ],
})
export class AppModule {}
```

`.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=avancapj
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_CLIENT_EMAIL=service-account@your-firebase-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=supersecret
```

`src/auth/auth.controller.ts` (troca de token Firebase → sessão do seu backend):
```ts
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';

@Controller('core/auth')
export class AuthController {
  @Post()
  async login(@Body() body: { token: string }) {
    const decoded = await admin.auth().verifyIdToken(body.token).catch(() => null);
    if (!decoded) throw new UnauthorizedException();

    // TODO: buscar/criar usuário no seu banco usando decoded.uid / decoded.email
    const user = { id: decoded.uid, email: decoded.email, unit: null };

    const appToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { token: appToken, user };
  }

  @Post('dev')
  async dev(@Body() body: { email: string, password: string }) {
    // Apenas para ambiente dev. Faça validação no seu banco.
    const firebaseCustomToken = await admin.auth().createCustomToken(body.email);
    const user = { id: body.email, email: body.email, unit: null };
    const appToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { firebaseToken: firebaseCustomToken, token: appToken, user };
  }
}
```

`main.ts` (Firebase Admin):
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as any),
  });
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(''); // API base
  await app.listen(3001);
}
bootstrap();
```

No front, `AuthService` já chama `core/auth/` após login Firebase. Garanta que `environment.API` aponte para `http://localhost:3001/` no dev.

## 4) Como preparar o Firebase para receber usuários
- Ative **Email/Password** em Authentication.
- Crie regras Firestore mínimas para usuários autenticados:
```
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
- Opcional: adicionar Google Sign-In e domínios autorizados.
- Atualize `src/firebase-messaging-sw.js` apenas se usar notificações push.

## 5) Rodar o front
```bash
npm i
npm start
```
Acesse `http://localhost:4200`.

## 6) Deploy
- Firebase Hosting: configure `firebase.json` e `.firebaserc` com seu `projectId`.
- Alternativa: Netlify, Vercel ou Nginx servindo `dist/browser`.
