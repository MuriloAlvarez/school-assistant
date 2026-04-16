# School Project - React Native

Aplicação mobile para gestão de escolas e turmas municipais, desenvolvida com React Native e Expo.

## Descrição

Sistema de gestão educacional que permite cadastrar, visualizar, editar e excluir escolas e suas respectivas turmas. Implementa arquitetura limpa (Clean Architecture) com separação de responsabilidades entre UI, lógica de negócio e infraestrutura.

## Pré-requisitos

- Node.js >= 20.19.4
- npm ou yarn
- Expo CLI
- Dispositivo físico ou emulador iOS/Android

## Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd school-project-react-native/school-project
```

2. Instale as dependências:

```bash
npm install
```

3. Instale dependências do Expo (se necessário):

```bash
npx expo install
```

## Execução

### Desenvolvimento

```bash
npx expo start
```

Escolha a plataforma desejada:

- `i` para iOS Simulator
- `a` para Android Emulator
- `w` para Web
- `d` para dispositivo físico (scan QR code)

### Build de Produção

```bash
npx expo build:android
npx expo build:ios
```

## Estrutura do Projeto

```
school-project/
├── app/                          # Páginas/Rotas (Expo Router)
│   ├── (tabs)/                   # Layout com abas
│   │   └── index.tsx            # Lista de escolas
│   ├── schools/                  # Rotas de escolas
│   │   ├── [id].tsx             # Detalhes da escola
│   │   ├── new.tsx              # Criação de escola
│   │   └── edit/[id].tsx        # Edição de escola
│   └── classes/                  # Rotas de turmas
│       ├── [id].tsx             # Detalhes da turma
│       ├── new.tsx              # Criação de turma
│       └── edit/[id].tsx        # Edição de turma
├── core/                         # Camada core (regras de negócio compartilhadas)
│   ├── api/                      # Cliente HTTP e configurações
│   ├── components/               # Componentes reutilizáveis
│   ├── constants/                # Constantes da aplicação
│   ├── hooks/                    # Hooks utilitários
│   └── theme/                    # Configurações de tema
├── features/                     # Features (bounded contexts)
│   ├── schools/                  # Feature: Escolas
│   │   ├── components/           # Componentes específicos
│   │   ├── hooks/                # Hooks da feature
│   │   ├── services/             # Serviços/Repositórios
│   │   ├── store/                # Estado global (Zustand)
│   │   └── types/                # Tipos TypeScript
│   └── classes/                  # Feature: Turmas
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       └── types/
├── assets/                       # Recursos estáticos
├── types/                        # Tipos globais
└── scripts/                      # Scripts utilitários
```

### Arquitetura

O projeto segue princípios de **Clean Architecture**:

- **UI Layer**: Páginas e componentes focados apenas em renderização
- **Application Layer**: Hooks customizados encapsulam lógica de negócio e interações
- **Domain Layer**: Serviços e repositórios definem regras de negócio
- **Infrastructure Layer**: Implementações concretas (API, storage local)

### Separação de Responsabilidades

- **Páginas**: Renderizam UI, chamam hooks para ações
- **Hooks**: Encapsulam estado, efeitos colaterais e lógica de negócio
- **Serviços**: Implementam operações de domínio (CRUD)
- **Stores**: Gerenciam estado global por feature
- **Componentes**: Reutilizáveis, sem lógica de negócio

## Funcionalidades

### Escolas

- ✅ Listar escolas com busca e filtros
- ✅ Visualizar detalhes da escola
- ✅ Cadastrar nova escola
- ✅ Editar escola existente
- ✅ Excluir escola (com confirmação)
- ✅ Contador de turmas por escola

### Turmas

- ✅ Listar turmas por escola
- ✅ Visualizar detalhes da turma
- ✅ Cadastrar nova turma
- ✅ Editar turma existente
- ✅ Excluir turma (com confirmação)
- ✅ Vinculação automática com escola

### Recursos Técnicos

- ✅ TypeScript para type safety
- ✅ Zustand para gerenciamento de estado
- ✅ MSW para mock de API em desenvolvimento
- ✅ Expo Router para navegação
- ✅ Gluestack UI para componentes
- ✅ Validação de formulários
- ✅ Tratamento de erros e loading states
- ✅ Persistência local como fallback

## Tecnologias

- **React Native** 0.76.5
- **Expo** SDK 52
- **TypeScript** 5.3.3
- **Zustand** (state management)
- **Expo Router** (navegação)
- **Gluestack UI** (componentes)
- **React Hook Form** (formulários)
- **MSW** (mock API)
- **Lucide React Native** (ícones)

## Desenvolvimento

### Scripts Disponíveis

```bash
npm run android      # Executar no Android
npm run ios         # Executar no iOS
npm run web         # Executar na web
npm run lint        # Executar ESLint
npm run type-check  # Verificar tipos TypeScript
```

### Convenções de Código

- Hooks customizados por fluxo (ex: `useCreateSchool`, `useSchoolDetails`)
- Componentes funcionais com TypeScript
- Imports absolutos com alias `@/`
- Separação de concerns: UI vs lógica
- Testes unitários para hooks e utilitários

### API Integration

A aplicação integra com API REST. Em desenvolvimento, usa MSW para mocks. Endpoints:

- `GET /api/schools` - Listar escolas
- `POST /api/schools` - Criar escola
- `GET /api/schools/:id` - Buscar escola
- `PUT /api/schools/:id` - Atualizar escola
- `DELETE /api/schools/:id` - Excluir escola
- `GET /api/classes` - Listar turmas
- `POST /api/classes` - Criar turma
- `GET /api/classes/:id` - Buscar turma
- `PUT /api/classes/:id` - Atualizar turma
- `DELETE /api/classes/:id` - Excluir turma

Fallback para localStorage quando API indisponível.

- React Native 0.81
- Expo Router
- TypeScript (strict)
- Zustand (estado)
- Axios (cliente HTTP)
- MSW (mock API)
- React Hook Form (formularios)
- Gluestack UI
- Vitest + Testing Library (testes)

## Estrutura do Projeto

```text
app/                       # Rotas/telas (Expo Router)
core/                      # Infra compartilhada (api, componentes, mock, tema)
features/
   schools/                 # Dominio de escolas (types, hooks, store, services, componentes)
   classes/                 # Dominio de turmas (hooks, store, services, componentes)
```

## Como executar

### Requisitos

- Node.js >= 20.19.4 (recomendado para Expo SDK 54)
- npm

### Passos

1. Instalar dependencias

```bash
npm install
```

2. Iniciar o projeto

```bash
npm run start
```

3. Executar qualidade de codigo

```bash
npm run lint
npm test
```

## Comandos disponiveis

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`
- `npm test`
- `npm run test:watch`

## Mock API (MSW)

Handlers principais:

- `GET /api/schools`
- `POST /api/schools`
- `GET /api/schools/:id`
- `PUT /api/schools/:id`
- `DELETE /api/schools/:id`
- `GET /api/schools/:id/classes`
- `POST /api/schools/:id/classes`
- `PUT /api/classes/:id`
- `DELETE /api/classes/:id`

## Testes implementados

- `features/schools/utils/formValidation.test.ts`
  - Sanitizacao de digitos
  - Validacao de campos com letras

- `features/schools/store/schoolStore.test.ts`
  - Incremento/decremento seguro de `classCount`
  - Adicao/remocao de escolas

- `features/classes/hooks/useClasses.test.ts`
  - Incremento de `classCount` ao criar turma
  - Decremento de `classCount` ao excluir turma

- `features/schools/hooks/useSchools.test.ts`
  - Carregamento de escolas no mount
  - Criacao de escola com reflexo no estado

## Observacoes

- A app foi estruturada para trabalhar com API real e, em caso de indisponibilidade, manter comportamento local coerente para desenvolvimento.
- Para evitar problemas de runtime com Expo SDK 54, utilize Node 20+ no shell usado para executar `expo`.
