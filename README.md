# School Project - React Native

Aplicativo mobile multiplataforma para gestao de escolas publicas e turmas, desenvolvido com Expo e React Native.

## Objetivo

Centralizar o cadastro e o controle de escolas e turmas em uma aplicacao unica, substituindo o processo manual em planilhas.

## Stack e Versoes

- Expo SDK 54 (`expo` ~54.0.33)
- React 19 (`react` 19.1.0)
- React Native 0.81 (`react-native` 0.81.5)
- TypeScript (`typescript` ~5.9.2, `strict: true`)
- Expo Router (`expo-router` ~6.0.23)
- Gluestack UI (`@gluestack-ui/themed` ^1.1.73)
- Zustand (`zustand` ^5.0.12)
- MSW (`msw` ^2.13.3)
- React Hook Form + Yup
- Vitest + Testing Library

## Requisitos

- Node.js >= 20.19.4
- npm

## Instalacao

```bash
npm install
```

## Execucao

```bash
npm run start
```

Atalhos do Expo CLI:

- `a` Android
- `i` iOS
- `w` Web
- `d` dispositivo fisico (QR Code)

## Scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run test:watch`
- `npm run reset-project`

## Funcionalidades Entregues

### Escolas

- Listar escolas
- Buscar escolas por nome/endereco
- Cadastrar escola
- Editar escola
- Excluir escola
- Exibir quantidade de turmas por escola

### Turmas

- Listar turmas por escola
- Cadastrar turma
- Editar turma
- Excluir turma
- Navegacao entre detalhe de escola e detalhe de turma

## Arquitetura (resumo)

```text
src/
  app/                      # Rotas Expo Router
  modules/
    schools/                # Dominio de escolas (screens, components, useSchools, services, store, schemas)
    classes/                # Dominio de turmas (screens, components, useClasses, services, store, schemas)
  shared/
    constants/              # rotas, mensagens, placeholders, etc.
    services/api/           # axios client + mock adapter nativo
    testing/mock/           # MSW handlers + worker web
    hooks/                  # hooks compartilhados
    store/                  # stores compartilhadas
```

## Mock de Back-end (Item de Avaliacao)

A aplicacao simula backend para os endpoints de escolas e turmas em desenvolvimento, sem precisar subir servidor separado.

### Web

- Usa MSW com `setupWorker`.
- Inicializa automaticamente em desenvolvimento.

Arquivos:
- `src/shared/testing/mock/browser.web.ts`
- `src/shared/testing/mock/handlers.ts`

### Android/iOS

- Usa adapter de mock na camada de API (axios), tambem automatico em desenvolvimento.
- Mantem os mesmos contratos principais do mock.

Arquivos:
- `src/shared/services/api/nativeMockAdapter.ts`
- `src/shared/services/api/apiClient.ts`

### Endpoints simulados

Escolas:
- `GET /api/schools`
- `POST /api/schools`
- `GET /api/schools/:id`
- `PUT /api/schools/:id`
- `DELETE /api/schools/:id`

Turmas (contrato global + compatibilidade por escola):
- `GET /api/classes`
- `POST /api/classes` (requer `schoolId` no payload)
- `GET /api/classes/:id`
- `PUT /api/classes/:id`
- `DELETE /api/classes/:id`
- `GET /api/schools/:id/classes`
- `POST /api/schools/:id/classes`

## Qualidade

Executar validacoes:

```bash
npm run type-check
npm test
npm run lint
```

## Testes Existentes

- `src/modules/schools/utils/formValidation.test.ts`
- `src/modules/schools/store/schoolStore.test.ts`
- `src/modules/schools/useSchools.test.ts`
- `src/modules/classes/useClasses.test.ts`

## Observacoes para Entrega

- Projeto pronto para rodar em Expo Go/Emulador com os mocks de desenvolvimento.
- Para avaliacao, recomenda-se validar os fluxos completos de CRUD em escolas e turmas nas duas plataformas (web e mobile).
