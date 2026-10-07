# Catálogo Deskli

Acesse `/design-system` pelo item **Design system** do menu lateral. A entrada `/` redireciona para `/login`; a Home fica em `/home`. O servidor de produção precisa direcionar URLs da SPA para `index.html` (history fallback).

A implementação segue [o design system oficial](../design/design-system.md) v1.1.0: cores semânticas zinc/verde suave, fontes DM Sans locais, raio de 4px nos controles e 8px em Dialog/Sheet. O tema claro, escuro ou do sistema é escolhido no menu do perfil e salvo em `deskli.theme`. O controle de densidade muda os controles entre 32 e 44px; telas de toque mantêm pelo menos 44px.

## Organização e uso

- `src/assets/index.css`: cores light/dark e registro dos tokens Tailwind.
- `src/assets/index.css` também contém a geometria e os estados compartilhados das primitivas shadcn.
- `src/components/ui/`: primitivas shadcn-vue, com foco e teclado gerenciados por Reka UI.
- `src/components/`: componentes do produto derivados das primitivas de `ui/` (botões, avatar, badges, busca, seletor, menu de tema) e shell da aplicação.
- `src/features/tickets/components/`: composições de chamados, mensagens, anexos e editor.
- `src/types/ticket.ts` e `src/constants/ticket-labels.ts`: contratos e traduções centralizadas.
- `src/pages/design-system/`: catálogo e contêiner de demonstração.

| Componente | Contrato e comportamento |
| --- | --- |
| DeskliButton | `variant`, `size`, `disabled`, `loading`, `type`; padrão `button`. Loading bloqueia ativação e anuncia processamento. Slots padrão e `icon`. Enter/Espaço pela primitiva. |
| IconButton | `label` obrigatório, `disabled`; label acessível no botão. |
| Field (shadcn-vue) | `Field` + `FieldLabel` + controle + `FieldDescription` + `FieldError`, de `@/components/ui/field`. Com erro: `data-invalid` no `Field`, `aria-invalid` e `aria-describedby` (ajuda e erro) no controle; `FieldError` leva ícone e usa `danger-fg`. |
| SearchInput | `v-model`, `loading`, `disabled`; eventos `search` após 300ms ou Enter, `clear`. Respeita composição IME e devolve foco ao limpar. O contêiner deve cancelar respostas HTTP antigas. |
| AssigneeSelect | `v-model: string | null`, `options`, `loading`, `disabled`, `error`, `id`; seleção por ID, opção sem responsável, navegação de teclado do Select. |
| StatusBadge / PriorityBadge | `status` / `priority`, `showIcon`; texto e ícone centralizados, fallback neutro para desconhecidos. Não recebem foco. |
| AbAvatar | `name`, `src`, `size: 24/32/36/40`, `decorative`; fallback para iniciais ou ícone de pessoa. |
| TicketListItem | `ticket`, `selected`, `unread`; evento `select(id)`. O link aponta ao chamado de demonstração via query da rota do catálogo. Ajustar destino ao integrar uma rota real de atendimento. |
| MessageItem | `message`; renderiza texto escapado e distingue visibilidade interna com cadeado, título e superfície semântica. |
| AttachmentItem | `attachment`, `removable`, `downloadable`; eventos `remove`, `download`, `retry`. O contêiner implementa acesso ao arquivo. |
| TicketTable | `tickets: TicketSummary[]`, `label` (nome acessível, renderizado como `caption` oculto), `pageSize` (padrão 5), `pageSizeOptions` (padrão 5/10/20). Tabela semântica com `Table` e `Pagination` do shadcn-vue; paginação, “Itens por página” e resumo “Mostrando X–Y de N” ficam no próprio componente, sobre a lista recebida. Sem ordenação, filtros ou chamadas de rede: o contêiner real deve paginar no servidor e trocar o estado local por `v-model:page`. |
| ReplyComposer | `ticketId`, `v-model: ComposerDraft`, `canWriteInternal`, `submitting`, `error`, `uploadPolicy`; eventos `change-visibility`, `attach`, `removeAttachment`, `retryAttachment`, `submit(SubmitReply)`. Abas de ativação manual. Ctrl/Cmd+Enter envia; Enter insere linha. |

O contêiner mantém rascunhos separados por chamado e audiência. Não copie o mesmo corpo ao trocar visibilidade. `requestId` é estável para retry do mesmo payload; a garantia de idempotência depende do servidor. Desabilite o editor durante envio e limpe apenas o rascunho confirmado.

## Toasts com Sonner

Usamos `vue-sonner`, com um único `Toaster` global em `App.vue` e configuração em `src/components/ui/sonner/Sonner.vue`. O tema acompanha `useTheme`; cores semânticas e geometria ficam em `src/assets/index.css`. A pilha fica no canto inferior direito, na camada 80, com até três notificações visíveis, duração padrão de 5s e botão de fechar em português.

```ts
import { toast } from 'vue-sonner'

toast.success('Alterações salvas.')
toast.info('Exportação iniciada.')
toast.warning('Revise os dados antes de continuar.')
const errorId = toast.error('Não foi possível concluir a operação.', {
  duration: Infinity,
})
// Quando a operação for resolvida:
toast.dismiss(errorId)
```

Esses exemplos ilustram a API; não implementam salvamento ou exportação. Não montar outro `Toaster` nas páginas. Usar erros inline para validação e correção de formulários. Evitar toast e região inline anunciando a mesma confirmação. O Sonner usa `aria-live="polite"` inclusive na variante de erro; erros urgentes ficam inline com `role="alert"`. Alt+T acessa a pilha, Tab navega pelos controles e Escape devolve o foco. A duração pausa ao interagir com a pilha.

O catálogo inclui quatro botões de demonstração em **Feedback e sobreposições**. Confirmações de ações, exclusão e envio simulado de mensagens também usam Sonner.

## Simulação e dependências do backend

Envio, upload e exclusão são simulados. Arquivos não são transmitidos nem persistidos; não há download no exemplo. A política PDF/PNG/JPEG, 3 arquivos e 5 MB por arquivo é uma fixture explícita, não uma regra de produção. Mensagens e rascunhos ficam em memória e são descartados ao sair da página.

Autorização de notas internas, URLs de anexos, validação de arquivos no servidor, permissões de atribuição, persistência e idempotência real dependem do backend. Não use ocultação visual de notas como autorização.

## Validação

Use `npm run build` e `npm run test:design-system`. O runner Playwright inicia Vite automaticamente na porta 4173, ou usa `DESKLI_URL` quando definida. Consulte [testes e execução](testing.md) para instalação, cache do Chromium, comandos específicos e relatórios.

Testes em `tests/e2e/` cobrem temas, persistência, diálogo, Select dentro de Sheet, teclado nas abas, isolamento de rascunhos, falha/retry, envio duplicado, upload, nota interna e responsividade. Capturas atuais ficam em `test-results/`; o relatório fica em `playwright-report/`. As imagens em `harness/docs/screenshots/` são históricas.

Leitor de tela, zoom de navegador e uma auditoria completa de contraste de todos os estados precisam de revisão humana; os testes não equivalem a certificação WCAG.

## Revisão visual 1.1

Marca verde suave `#B9E58C`, seleção verde discreta e avisos âmbar independentes. Espaços de label/campo de 6px, badges de 24px (padding 2px 8px), seções de 16px e conteúdo desktop com padding de 16px. Os controles preservam 32px desktop e 44px em toque. O login usa uma composição minimalista: formulário à esquerda, conversa ilustrativa à direita, superfícies planas e tokens globais; o painel lateral é ocultado abaixo de 1024px. A Home apresenta chamados demonstrativos com links para as conversas do playground. A especificação atual está na seção 16 de `design-system.md`; revisões fotográficas e oliva anteriores são históricas.

### Validação da revisão minimalista

Execute `npx playwright test tests/e2e/login.spec.js` com o runner gerenciando Vite (ou `DESKLI_URL` apontando para outro servidor). O teste usa Playwright e Chromium para verificar duas aparências e quatro larguras, formulário, navegação, modo Sistema e foco por teclado. Se os browsers estiverem instalados fora do cache padrão, defina `PLAYWRIGHT_BROWSERS_PATH`. Evidências atuais são gravadas em `test-results/`.

Resultado em 2026-10-02: build e `login.spec.js` aprovados. Antes da migração para o runner, a suíte geral `test:design-system` era interrompida pela asserção `Escuro: success keyboard access` do Sonner; isso limita a validação completa do catálogo. Capturas de login e Home foram inspecionadas em desktop e celular.

O login adapta os espaçamentos à altura disponível (até 950px). A regressão `npx playwright test tests/e2e/login.spec.js` cobre ausência de rolagem em treze viewports, incluindo 1280×720 e 1366×768, nos dois temas e com erros visíveis. Em 320×480, verifica acesso por teclado e rolagem até o rodapé. O conteúdo pode crescer naturalmente em telas baixas.

Em janelas com até 740px de altura útil, o login compacta também títulos e espaçamentos internos, incluindo o cabeçalho em tablets. A regressão cobre 1280×600, 1366×650, 1536×703, 1024×600, 768×600 e 375×600, em claro/escuro, com e sem erros. As dimensões representam a área de conteúdo do navegador. Capturas: `harness/docs/screenshots/login-short-light.png` e `login-short-dark.png`.

Densidade compacta global: títulos 24/32px, sidebar 224px, cabeçalho 48px, painéis 12px e editor de resposta a partir de 80px. Texto de corpo continua em 14px. Tokens e contratos atualizados na seção 17 da especificação. Verifique com `npx playwright test tests/e2e/compact.spec.js` (Playwright/Chromium; `DESKLI_URL` opcional), além da regressão do login.

Validação da densidade: suíte compacta e regressão de login aprovadas em 2026-10-02. Antes da migração, a suíte geral parava na falha preexistente `Escuro: success keyboard access` do Sonner.

### Sidebar recolhível em ícones

A navegação segue o comportamento do [shadcn-vue sidebar-07](https://www.shadcn-vue.com/blocks#sidebar-07), com `collapsible="icon"`: 224px expandida e 48px recolhida no desktop. Recolhida, mantém os links com ícones, nomes acessíveis, tooltips, assinatura textual abreviada e avatar com menu de aparência. O botão do cabeçalho, a borda lateral e Ctrl/Cmd+B alternam o estado, persistido pelo cookie existente. Abaixo de 768px, abre como painel sobreposto com texto completo. Validação: `npx playwright test tests/e2e/sidebar.spec.js`, incluindo ambos os temas, teclado, tooltips, navegação, recarga e mobile.

## Migração para o harness

A especificação oficial fica em `harness/design/design-system.md`; o guia do catálogo fica em `harness/docs/catalogo.md`. Testes são descobertos pelo runner Playwright em `tests/e2e/*.spec.js`, com configuração na raiz. Novas capturas, traces e relatórios ficam em `test-results/` e `playwright-report/`, não sobrescrevem evidências históricas em `harness/docs/screenshots/`. As referências a capturas anteriores neste documento registram o histórico. Consulte `harness/docs/testing.md` para os comandos atuais.
