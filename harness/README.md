# Harness Deskli

Contexto versionado para desenvolver, revisar e validar o projeto. Não é um serviço em runtime nem uma segunda implementação da aplicação.

## Ordem de leitura

1. [Contexto do produto](context/product.md): escopo, rotas e limites da demonstração.
2. [Arquitetura](context/architecture.md): responsabilidades e fontes do código.
3. [Regras de desenvolvimento](rules/development.md).
4. [Design system oficial](design/design-system.md) para alterações visuais.
5. [Testes](docs/testing.md) e [checklist de entrega](checklists/delivery.md).

## Mapa

| Área | Responsabilidade |
| --- | --- |
| `context/` | Estado atual, domínio e arquitetura |
| `design/` | Fonte oficial de tokens, componentes e comportamento visual |
| `rules/` | Regras de implementação e manutenção |
| `docs/` | Uso do catálogo, execução e evidências |
| `decisions/` | Decisões duráveis e justificativas |
| `checklists/` | Critérios verificáveis de entrega |
| `../tests/e2e/` | Testes executáveis; não duplicar em documentos ou scripts |

O guia de componentes está em [docs/catalogo.md](docs/catalogo.md). [Decisões](decisions/0001-harness-and-tests.md) explica a migração. Imagens em `docs/screenshots/` são evidências históricas, não snapshots aprovados automaticamente.

## Manutenção

Atualize contexto quando rotas, dependências ou limites do produto mudarem. Atualize o design system junto dos componentes. Uma regra visual deve ter uma fonte oficial; outros documentos apontam para ela. Registre divergências entre documentação e código, sem inventar funcionalidades. Instruções explícitas do usuário prevalecem sobre convenções locais. O harness não concede autorização para publicar ou enviar mensagens.
