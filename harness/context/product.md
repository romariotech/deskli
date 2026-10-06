# Produto e limites

Deskli é um frontend de atendimento em Vue 3/TypeScript. A demonstração cobre chamados, conversas, respostas públicas, notas internas, anexos e estados de interface.

| Rota | Comportamento |
| --- | --- |
| `/` | Redireciona para `/login` |
| `/login` | Validação local; e-mail válido e senha preenchida levam à Home |
| `/home` | Chamados de exemplo e entrada no catálogo |
| `/design-system` | Componentes e playground; `?ticket=` seleciona chamado e `#playground` aponta ao atendimento |
| Demais URLs | Página não encontrada |

Não há backend, autenticação real, proteção de rotas ou persistência de chamados. Credenciais não são transmitidas nem salvas. Rascunhos e mensagens existem em memória. Preferência de tema usa `deskli.theme`; estado da sidebar usa cookie `sidebar_state`.

Contratos de chamados: `src/types/ticket.ts`; rótulos: `src/constants/ticket-labels.ts`. Os dados e políticas de anexos do playground são fixtures, não requisitos de produção. Respostas públicas e notas internas mantêm rascunhos distintos; autorização real depende do servidor.
