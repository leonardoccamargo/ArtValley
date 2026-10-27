# ArtValley

> Nome provisório.

Rede social e marketplace para modeladores 3D de Minecraft, com foco em modelos do **Blockbench** (`.bbmodel`).

## Estrutura

Monorepo gerenciado com [pnpm](https://pnpm.io) e [Turborepo](https://turborepo.com).

```
apps/
  web/        # Frontend (Next.js + TypeScript + Tailwind CSS)
packages/     # Código compartilhado (futuro)
```

## Como rodar localmente

Pré-requisitos: Node.js 22+ e pnpm 9.

```bash
pnpm install
pnpm dev        # abre o site em http://localhost:3000
```

Outros comandos:

```bash
pnpm build      # build de produção
pnpm lint       # verificação de código (ESLint)
pnpm typecheck  # verificação de tipos (TypeScript)
```

## Dados de exemplo

Enquanto não há backend, o site usa dados fictícios em `apps/web/src/data/` e modelos de exemplo em `apps/web/content/models/` (pasta privada, nunca servida publicamente). Os modelos são gerados por:

```bash
cd apps/web && node scripts/generate-sample-models.mjs
```
