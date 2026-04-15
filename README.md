# EduGestor Publico

Aplicativo React Native (Expo Router) para cadastro e gerenciamento de escolas municipais e turmas.

## Objetivo

Digitalizar o fluxo de gestao escolar com CRUD completo de:

- Escolas
- Turmas vinculadas a escolas

Com foco em validacao de dados, consistencia de estado local e experiencia de uso simples para operacoes administrativas.

## Funcionalidades

### Escolas

- Listagem com busca por nome/endereco
- Cadastro de nova escola
- Edicao de escola
- Exclusao de escola com confirmacao
- Visualizacao de detalhes da escola

### Turmas

- Listagem de turmas por escola
- Cadastro de turma por escola
- Edicao de turma
- Exclusao de turma com confirmacao
- Visualizacao de detalhes da turma

### Regras de validacao aplicadas

- Nome da escola: apenas letras e espacos (aceita acentos)
- Nome do diretor: apenas letras e espacos (campo opcional)
- Telefone: apenas numeros, maximo de 11 digitos
- Turno: exibido em portugues (Manha, Tarde, Noite, Integral)
- Ano letivo: apenas numeros, intervalo entre 1980 e 2030
- Capacidade: apenas numeros (opcional)
- Professor responsavel: apenas letras e espacos (opcional)

### Consistencia de dados

- `classCount` da escola e atualizado ao criar/excluir turma
- Exclusao de escola remove turmas vinculadas no mock
- Services possuem fallback local para ambiente sem API ativa

## Stack Tecnica

- Expo SDK 54
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
