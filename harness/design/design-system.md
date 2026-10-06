# deskli — Design System e especificação de componentes

```yaml
system: deskli
version: 1.1.0
language: pt-BR
created_at: 2026-09-30
status: implementado-com-validacao-browser
source_method: prancha-aprovada-e-decisoes-explicitas-de-design
structure_reference: material-design-design.md fornecido pelo usuário
visual_reference: prancha deskli light/dark aprovada nesta conversa
stack: Vue 3 + TypeScript + Tailwind CSS 4 + shadcn-vue + Reka UI + vue-sonner
platform: web responsiva, desktop prioritário
themes: [light, dark, system]
verification: tokens essenciais verificados matematicamente; fluxos verificados com Playwright, sem certificacao WCAG
```

> Este documento é a fonte de verdade para implementar o deskli. Valores não mensuráveis na imagem, contratos e comportamentos abaixo são decisões propostas nesta especificação. Não são valores extraídos de uma biblioteca existente. A prancha é referência visual; em divergências, prevalecem os tokens, a legibilidade e as regras deste documento.

## 1. Resumo e escopo

Sistema de chamados para atendimento interno e clientes externos. Estilo clean, compacto e operacional: superfícies zinc, verde suave como marca, bordas finas, raio pequeno, tipografia clara e pouca elevação. Mesmo conjunto de componentes para light e dark; somente os tokens mudam.

Escopo funcional confirmado: abertura de chamados, anexos, conversas, notas internas, prioridades, atribuição e dashboard. Não incluir SLA, automações, cobrança, base de conhecimento ou novos status como requisitos só porque apareceram em um mockup.

### Cobertura deste documento

- Fundações: cores, tipografia, espaçamento, dimensões, ícones, bordas, sombras, movimento e tema.
- Componentes da prancha: botões, campos, seletor de responsável, busca, checkbox, switch, badges, avatar, item de chamado, anexo, nota interna, abas e compositor.
- Complementos necessários: seletor de tema, navegação, mensagens, feedback, diálogo e padrões responsivos.
- Contratos de dados e eventos, uso de shadcn-vue, checklist de entrega e instrução para agente de código.
- Dashboard e formulário de abertura são padrões de composição propostos; não se apresentam como telas já aprovadas pixel a pixel.

### Princípios

1. Evidenciar o próximo passo do atendimento; apenas uma ação primária por contexto.
2. Usar alinhamento, espaço e divisores antes de cartões ou sombras.
3. Cor nunca é o único sinal de estado: combinar texto e ícone.
4. Separar resposta pública de nota interna de maneira explícita.
5. Não reduzir fontes para encaixar desktop em celular.
6. Não inventar marca gráfica: usar a assinatura textual `deskli` até existir um logo definitivo.

### Normalizações da prancha

- Substituir verde claro usado como texto sobre branco por `brand-text`.
- Tornar os contornos dos controles identificáveis com `input`; manter `border` suave nos divisores.
- Campo com “Campo obrigatório” deve estar vazio. Um campo preenchido só exibe erro correspondente à validação que falhou.
- Destrutivo suave e preenchido são variantes explícitas disponíveis em ambos os temas; não mudar a variante ao trocar o tema.
- “Resolvido” usa check; prioridade baixa usa seta para baixo. Corrigir ícones ambíguos da imagem.
- Interface e conversas usam DM Sans local; IDs e horários mantêm DM Sans com números tabulares para reduzir variações tipográficas.
- Sem gradientes, brilho, grandes cantos arredondados ou efeitos de vidro.

## 2. Tokens de cores

As cores abaixo são valores sRGB completos. Não envolver em `hsl(var(...))`. Tokens semânticos são preferidos a classes de cor fixas nos componentes.

| Token CSS | Light | Dark | Uso |
| --- | --- | --- | --- |
| `--background` | `#FFFFFF` | `#09090B` | Fundo principal |
| `--foreground` | `#18181B` | `#FAFAFA` | Texto principal |
| `--card` | `#FAFAFA` | `#18181B` | Superfície secundária |
| `--card-foreground` | `#18181B` | `#FAFAFA` | Texto da superfície |
| `--popover` | `#FFFFFF` | `#18181B` | Menus, seletores e popovers |
| `--popover-foreground` | `#18181B` | `#FAFAFA` | Texto dos popovers |
| `--primary` | `#B9E58C` | `#B9E58C` | Ação principal; não usar como texto sobre branco |
| `--primary-foreground` | `#18181B` | `#18181B` | Texto e ícones sobre verde suave |
| `--primary-hover` | `#C9EDA6` | `#C9EDA6` | Hover da ação principal |
| `--primary-active` | `#A4D574` | `#A4D574` | Ação principal pressionada |
| `--secondary` | `#F4F4F5` | `#27272A` | Ações secundárias preenchidas |
| `--secondary-foreground` | `#18181B` | `#FAFAFA` | Texto secundário de botão |
| `--muted` | `#F4F4F5` | `#27272A` | Áreas neutras e skeleton |
| `--muted-foreground` | `#52525B` | `#A1A1AA` | Texto de apoio e placeholder |
| `--accent` | `#EFF5E9` | `#202D24` | Seleção, hover contextual e nota interna |
| `--accent-foreground` | `#365C36` | `#C2DDA9` | Texto sobre seleção verde |
| `--brand-text` | `#365C36` | `#B9E58C` | Links e rótulos verdes legíveis |
| `--border` | `#E4E4E7` | `#3F3F46` | Divisores decorativos |
| `--input` | `#71717A` | `#71717A` | Contorno identificador de controles |
| `--ring` | `#365C36` | `#B9E58C` | Indicador de foco |
| `--destructive` | `#B91C1C` | `#B91C1C` | Ação destrutiva preenchida |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` | Texto de ação destrutiva preenchida |
| `--danger-bg` | `#FEF2F2` | `#450A0A` | Erro, prioridade alta e destrutivo suave |
| `--danger-fg` | `#B91C1C` | `#FCA5A5` | Texto de erro e prioridade alta |
| `--danger-border` | `#B91C1C` | `#F87171` | Borda de erro |
| `--info-bg` | `#EFF6FF` | `#172554` | Aguardando cliente |
| `--info-fg` | `#1D4ED8` | `#93C5FD` | Texto informativo |
| `--success-bg` | `#F0FDF4` | `#052E16` | Resolvido e prioridade baixa |
| `--success-fg` | `#166534` | `#86EFAC` | Texto de sucesso |
| `--warning-bg` | `#FFFBEB` | `#291E0B` | Aviso com ícone e descrição |
| `--warning-fg` | `#92400E` | `#FCD34D` | Texto de aviso |
| `--disabled-bg` | `#E4E4E7` | `#27272A` | Fundo inativo |
| `--disabled-fg` | `#71717A` | `#A1A1AA` | Texto inativo |

### Mapeamento semântico

| Conceito | Fundo | Texto | Ícone sugerido |
| --- | --- | --- | --- |
| Aberto | muted | muted-foreground | FileText |
| Em atendimento | accent | accent-foreground | Clock3 |
| Aguardando cliente | info-bg | info-fg | UserRound |
| Resolvido | success-bg | success-fg | CircleCheck |
| Prioridade alta | danger-bg | danger-fg | ChevronsUp |
| Prioridade média | muted | muted-foreground | Minus |
| Prioridade baixa | success-bg | success-fg | ArrowDown |
| Nota interna | accent | accent-foreground | LockKeyhole |

Verde suave identifica marca, seleção e atendimento; âmbar fica reservado a avisos. O estado resolvido mantém verde semântico com check e rótulo; cor isolada não distingue estados. Avisos sempre incluem título e ícone; notas privadas sempre incluem cadeado e texto de visibilidade. Nenhum badge concede permissão nem determina estado no servidor.

## 3. Tipografia

- Interface: `'DM Sans', ui-sans-serif, system-ui, sans-serif`; pesos 400, 500 e 600.
- IDs e metadados técnicos: `'DM Sans', ui-sans-serif, system-ui, sans-serif`; pesos 400 e 500.
- Carregar fontes preferencialmente como WOFF2 locais, com `font-display: swap`; fallback não pode quebrar o layout.
- Texto e conversa alinhados à esquerda. Usar números tabulares em métricas e horários.

| Token | Tamanho / entrelinha | Peso | Uso |
| --- | --- | --- | --- |
| page-title | 24 / 32px | 600 | Título da página |
| section-title | 18 / 24px | 600 | Seção |
| ticket-title | 16 / 24px | 600 | Assunto na conversa |
| body | 14 / 20px | 400 | Interface |
| message | 14 / 22px | 400 | Mensagens; linha de até 65 caracteres |
| label | 12 / 16px | 500 | Rótulos e badges |
| metadata | 12 / 18px | 400 | ID, data e tamanho de anexo |
| metric | 28 / 36px | 600 | Dashboard |

Usar `rem` para texto: 14px = 0.875rem e 24px = 1.5rem com raiz de 16px. Não diminuir a raiz do documento. Em telas de toque, campos editáveis usam 16px para favorecer leitura e evitar zoom automático em navegadores móveis.

## 4. Espaçamento, geometria e densidade

| Token | Valor | Aplicação |
| --- | --- | --- |
| space-1 | 4px | Microespaço |
| space-2 | 8px | Ícone e texto, label e campo |
| space-3 | 12px | Padding de item compacto |
| space-4 | 16px | Padding de painel |
| space-6 | 24px | Separação padrão de grupos e seções |
| space-8 | 32px | Separação excepcional de grandes blocos |
| radius-sm | 2px | Checkbox e detalhes |
| radius-md | 4px | Botões, inputs, badges, notas, anexos |
| radius-lg | 8px | Dialog e Sheet |
| auth-radius | 12px | Card de login, exceção de composição; não aplicar a controles |
| radius-full | 9999px | Avatar e switch |
| border-width | 1px | Contorno e divisor |
| control-sm | 32px | Ações compactas desktop |
| control-md | 32px | Padrão compacto desktop |
| control-lg | 44px | Ações de toque |

Badges têm altura mínima 24px; podem crescer com zoom. Campo com erro não muda a altura do controle, mas acrescenta texto abaixo. Evitar alturas fixas em conteúdo textual. Ícone 16px em controles, 20px na navegação; espessura visual de 1.75–2px. Usar Lucide pelo pacote, sem emoji como ícone.

### Elevação e camadas

- Base, listas, inputs, notas e botões: `box-shadow: none`.
- Popover/dropdown: `0 4px 12px rgb(0 0 0 / 0.12)` em light, `0 4px 12px rgb(0 0 0 / 0.32)` em dark.
- Modal: mesma linguagem; overlay `rgb(0 0 0 / 0.48)`.
- Camadas: conteúdo 0; cabeçalho sticky 20; menu 40; overlay 50; modal 60; toast 80.
- Popovers dentro de modal devem usar o contexto de portal do modal e ficar acima dele, sem quebrar o focus trap.

### Movimento

Hover e foco: 120ms; expansão de painel: 180ms; curva `cubic-bezier(0.2, 0, 0, 1)`. Animar somente cor, opacidade e transform quando necessário. Não usar `transition: all`. Com `prefers-reduced-motion: reduce`, remover animações não essenciais e smooth scroll.

## 5. Tema e responsividade

`ThemeMode = 'light' | 'dark' | 'system'`. Padrão: `system`. Persistir escolha em `deskli.theme`; aplicar `.dark` no elemento `html` antes da primeira pintura quando possível. Atualizações do sistema só alteram a aparência no modo `system`. Proteger acesso a `window`/armazenamento em SSR; sincronizar o estado após hidratação sem mudar a estrutura do DOM.

O seletor contém “Claro”, “Escuro”, “Sistema”, com ícone e indicação da seleção. Trocar tema preserva foco, navegação, scroll, mensagens e rascunhos. Declarar `color-scheme: light` ou `dark` conforme o tema efetivo, o seletor de tema fica junto com os dados do usuário no dropdown

| Largura | Layout do atendimento |
| --- | --- |
| >= 1280px | Header 48px; fila 260px; conversa flexível `minmax(0,1fr)`; detalhes 280px |
| 768–1279px | Fila 280px + conversa; detalhes em Sheet acionado por “Detalhes” |
| < 768px | Uma área por vez: fila ou conversa; voltar para a fila preserva posição; detalhes em Sheet |

Área principal usa altura disponível de `100dvh`, com fallback apropriado; header e compositor não podem cobrir a última mensagem. Teclado virtual não deve ocultar a ação de enviar. Texto longo quebra com `overflow-wrap:anywhere` em nomes e URLs; IDs curtos podem ficar em uma linha. Título da fila: até duas linhas e acesso ao texto completo. Não ocultar informação indispensável apenas em tooltip.

Em celular: padding 16px, ações de pelo menos 44px, formulário em uma coluna. A marca, menu e ação de voltar permanecem claros. Não comprimir três colunas horizontalmente.

## 6. Regras compartilhadas de componentes

Todos os componentes interativos têm estados default, hover, focus-visible, disabled e, quando aplicável, active, loading, error e selected. Disabled bloqueia ativação por mouse e teclado. Loading bloqueia envio duplicado, mantém largura e anuncia processamento. Foco não pode depender do hover.

- `focus-visible`: outline 2px em `ring`, offset 2px; não cortar com overflow do pai.
- `disabled`: tokens próprios, sem reduzir opacidade indiscriminadamente em toda a seção.
- `error`: texto + ícone + contorno `danger-border`, com `aria-invalid` e descrição associada.
- `selected`: fundo accent + indicação persistente e semântica correta.
- Botão só com ícone exige nome acessível. Tooltip não substitui o nome.
- Repassar `id`, atributos ARIA, eventos e refs pertinentes para o elemento que recebe foco.
- Reutilizar primitivas shadcn-vue/Reka UI para menus, diálogos e seletores; evitar reimplementar foco e teclado.

## 7. Catálogo de componentes

Os contratos abaixo pertencem aos wrappers do deskli. Não afirmam reproduzir a API exata da versão instalada do shadcn-vue. Usar valores controlados e emitir mudanças; componentes visuais não fazem chamadas HTTP diretamente.

### 7.1 Button e IconButton

**Anatomia:** ícone opcional 16px, rótulo, spinner opcional; gap 8px. Padding horizontal: 12px em sm/md e 16px em lg. Texto 14px/20px peso 500.

| Variante | Default | Hover | Uso |
| --- | --- | --- | --- |
| primary | primary / primary-foreground | primary-hover | Novo chamado; Enviar resposta |
| outline | background / foreground, borda input | secondary | Cancelar |
| secondary | secondary / secondary-foreground | muted com contorno input | Ações auxiliares |
| ghost | transparente / foreground | secondary | Toolbar |
| link | transparente / brand-text, sublinhado | sublinhado mais forte | Navegação textual |
| destructive-soft | danger-bg / danger-fg, borda danger-border | mesmo fundo com sublinhado | Excluir em contexto |
| destructive | destructive / destructive-foreground | mesmo fundo com outline | Confirmar exclusão |

Props: `variant`, `size: 'sm'|'md'|'lg'`, `disabled=false`, `loading=false`, `type='button'`. Evento: `click` somente se habilitado. Botão de formulário precisa de `type='submit'` explícito. Links usam elemento `a`, não button com navegação improvisada. IconButton acrescenta `label` obrigatório.

Loading: spinner ocupa o slot do ícone e rótulo muda para “Enviando…” quando apropriado; manter largura mínima anterior. Enter e Espaço ativam button. Ação destrutiva real usa diálogo com nome do objeto, “Cancelar” e “Excluir”; foco inicial em Cancelar, retorno ao acionador após fechar.

### 7.2 FormField, Input e Textarea

**Anatomia:** label persistente → campo → ajuda → erro. Gap 6px; erro logo abaixo do controle. Input 32px, padding horizontal 10px, radius 4px, background, foreground e borda input. Textarea mínimo 80px, resize vertical, sem cortar texto.

Props do campo: `id`, `label`, `description?`, `error?`, `required=false`. Props do input: `modelValue`, `type`, `name`, `autocomplete`, `placeholder`, `disabled`, `readonly`, `maxlength?`. Emitir `update:modelValue`, `blur` e `focus`.

Obrigatório recebe indicador textual ou asterisco explicado no formulário. Placeholder é exemplo, não substitui label. Erros aparecem após blur ou tentativa de envio; ao corrigir, revalidar sem apagar o valor. Campo readonly é legível e copiável; disabled não é usado para exibir informação consultável.

Exemplo válido: Assunto vazio → “Informe o assunto do chamado.” Campo “Relatório mensal” não recebe erro de obrigatoriedade. Validação de limites deve vir das mesmas regras do backend. Leitor de tela recebe ajuda e erro via `aria-describedby`.

### 7.3 SearchInput

Input com Search à esquerda e ação Limpar à direita quando preenchido; área útil não sobrepõe ícones. Label “Buscar chamados”, placeholder “Buscar por assunto, ID ou cliente…”. Props: `modelValue`, `loading`, `disabled`; eventos `update:modelValue`, `search`, `clear`.

Busca após 300ms de pausa; Enter executa imediatamente; cancelar/ignorar respostas antigas. Não buscar durante composição IME. Limpar mantém foco e restaura lista. Loading mostra spinner discreto; erro mantém consulta e oferece tentar novamente; vazio mostra “Nenhum chamado encontrado” e “Limpar filtros”. Resultados anunciados sem interromper digitação.

### 7.4 AssigneeSelect

Trigger 32px com avatar 24px, nome e chevron. Painel mínimo da largura do trigger, máximo 320px e altura 280px com scroll. Opção “Sem responsável” no início. Mostrar nome e complemento de equipe quando houver homônimos.

Props: `modelValue: string|null`, `options: Assignee[]`, `loading`, `disabled`, `error?`; emitir `update:modelValue`. Seleção baseada em ID, nunca no objeto inteiro nem somente no nome. Para poucas opções usar Select; para lista pesquisável usar Combobox. Sem resultados, loading e falha têm mensagens próprias.

Setas navegam, Enter seleciona, Escape fecha e restaura foco. Seleção em perfil somente leitura vira texto, não controle desabilitado. Persistência e falha de atribuição são responsabilidade do contêiner, que reverte mudança otimista se necessário.

### 7.5 Checkbox

Quadrado visual 16px, raio 2px, borda input; marcado: primary com check primary-foreground. Label clicável e alinhado ao centro; área interativa mínima de 32px desktop e 44px toque. Props: `modelValue: boolean|'indeterminate'`, `disabled`, `id`, `label`. Emitir `update:modelValue`.

Espaço alterna; estado parcial corresponde a seleção de grupo, com `aria-checked='mixed'`. Não usar checkbox para ação imediata irreversível. Exemplo da prancha: “Receber notificações”.

### 7.6 Switch

Track 36×20px, thumb 16px, deslocamento interno 2px. Inativo: muted com borda input; ativo: primary com thumb primary-foreground. Área de toque 44px; nome acessível constante, ex. “Receber notificações”, separado do texto “Ativo/Inativo”.

Props: `modelValue: boolean`, `disabled`, `loading`, `label`; emitir `update:modelValue`. Enter/Espaço conforme a primitiva. Se persistir imediatamente, mostrar processamento e reverter em falha; se fizer parte de formulário, salvar junto. Não representar três modos de tema com um switch binário.

### 7.7 StatusBadge e PriorityBadge

Altura mínima 24px, padding 2px 8px, gap 4px, raio 4px, label 12px/16px peso 500, ícone 14px. Aplicar a tabela semântica da seção 2. Badges informativos não entram na ordem de Tab. Um badge editável precisa ser envolvido por trigger real e indicar abertura de menu.

Props: `status: TicketStatus` ou `priority: TicketPriority`, `showIcon=true`. Traduções são centralizadas. Desconhecido: badge neutro “Status desconhecido”; não mapear silenciosamente para Aberto. Texto não é truncado.

### 7.8 AbAvatar

Tamanhos: 24px em seletor, 32px em lista, 32px em mensagem, 40px no perfil. Círculo neutro, iniciais com até duas letras, imagem opcional com `object-fit:cover`. Props: `name`, `src?`, `size`. Falha da imagem retorna às iniciais; nome vazio usa ícone de pessoa.

Quando o nome já está ao lado, imagem é decorativa e usa alt vazio. Se isolado e significativo, fornecer nome acessível. Não inferir cargo ou identidade por cores de avatar.

### 7.9 TicketListItem

Padding 12px; gap interno 6px. Ordem: ID + horário → assunto → organização + prioridade + status. Assunto 14px/20px semibold; metadados 12px. Separação entre itens por border; nenhum efeito de elevação.

Props: `ticket: TicketSummary`, `selected=false`, `unread=false`; evento `select(id)`. Preferir link real para rota do chamado, com `aria-current='page'` quando aberto. Evitar buttons dentro de um link; ações extras ficam em elemento irmão.

Hover usa secondary; selected usa accent, contorno brand-text e assunto foreground; unread usa peso e texto acessível “Não lido”. Não depender de ponto colorido. Seleção não dispara alteração de status. Loading usa skeleton equivalente; erro e vazio são estados da lista, com ação de recuperação.

### 7.10 AttachmentItem e AttachmentUpload

Item com ícone/thumbnail 32px, nome, extensão e tamanho legível, ação baixar/remover. Padding 12px, gap 12px, borda border, raio 4px. Nome quebra ou trunca com acesso ao nome completo. Nunca mostrar thumbnail quebrado.

Props: `attachment: Attachment`, `removable=false`, `downloadable=true`; eventos `download(id)`, `remove(id)`, `retry(localId)`. Estados: queued, uploading (progresso), ready, failed, removing. Durante upload anunciar início/fim, não cada percentual. Falha mostra motivo e Tentar novamente.

Upload: seletor nativo acessível e drag-and-drop complementar. Configuração obrigatória vinda do produto/backend: `acceptedTypes`, `maxFiles`, `maxBytesPerFile`. Não inventar limites de produção. Mostrar esses limites antes da seleção. Validar também no servidor. Arquivos de notas internas herdam a visibilidade privada; URL não pode contornar a autorização.

### 7.11 MessageItem e InternalNote

Mensagem: avatar 32px, autor, papel visível (“Cliente” ou “Atendente”), data e corpo com até 65ch. Espaço vertical 16px; entre mensagens 24px. Conteúdo e horário em DM Sans; horário com números tabulares. Ordem cronológica e sem dependência da posição direita/esquerda para identificar autor.

Nota interna: padding 16px, fundo accent, texto accent-foreground, borda brand-text 1px, raio 4px. Cabeçalho fixo “Nota interna · Visível apenas para a equipe” com cadeado; depois autor, data e corpo. Props: `message: TicketMessage`; nota interna exige `visibility='internal'`.

Não enviar notas internas ao cliente e apenas escondê-las por CSS: o backend deve omitir esses registros e seus anexos. Renderizar texto/HTML sanitizado, sem conteúdo executável. URLs longas quebram. Data visível abre informação completa acessível; formato pt-BR e timezone do usuário.

### 7.12 Tabs

Lista horizontal com altura mínima 32px, labels 14px, gap 16px, indicador inferior 2px brand-text. Ativa: brand-text + peso 500; inativas: muted-foreground. Sem cards ao redor de cada aba.

Props: `modelValue`, `items`, `activation: 'automatic'|'manual'`; evento `update:modelValue`. Setas navegam; Home/End extremos; no modo manual Enter/Espaço ativa. Relação tab/tablist/tabpanel e roving tabindex gerenciados pela primitiva. Para troca de modo do compositor, usar ativação manual para evitar mudar audiência ao apenas navegar com teclado.

### 7.13 ReplyComposer

**Anatomia:** abas “Resposta pública” e “Nota interna” → editor → anexos pendentes → toolbar → botão de envio. Borda input, raio 4px. Editor mínimo 80px, cresce até 320px e então rola. Toolbar quebra em telas estreitas.

Props: `ticketId`, `modelValue: ComposerDraft`, `canWriteInternal`, `submitting`, `error?`, `uploadPolicy`. Eventos: `update:modelValue`, `attach(files)`, `removeAttachment(id)`, `submit(payload)`.

- Público: indicação “Visível ao solicitante”; CTA “Enviar resposta”.
- Interno: indicação “Visível apenas para a equipe”, cadeado e superfície accent; CTA “Adicionar nota interna”.
- Manter rascunhos separados por chamado e por visibilidade; ao trocar aba, não transportar texto privado para público.
- Não mudar automaticamente para público após falha, upload ou atualização do chamado.
- Enviar somente texto não vazio ou pelo menos um anexo ready. Bloquear enquanto houver upload pendente ou falho não resolvido.
- Ctrl/Cmd+Enter envia, Enter cria linha. Não enviar durante composição IME. Disponibilizar botão; atalho é complementar.
- Durante envio, congelar o payload e prevenir duplicatas. Limpar somente o rascunho enviado após confirmação do servidor; falha preserva texto e anexos.
- Formatação inicial permitida: negrito, itálico, link, listas e código inline. Sanitizar na renderização; sem editor HTML livre. Se usar textarea simples, não exibir toolbar de formatação inoperante.
- Rascunhos em memória por padrão. Persistência local de dados de atendimento requer decisão explícita do produto; tema pode persistir sem essa decisão.
- Ao receber mensagens novas, não puxar o scroll se a pessoa estiver lendo o histórico; mostrar “Novas mensagens”.

### 7.14  Feedback e Dialog

Feedback: inline para erros que exigem correção, **Sonner (`vue-sonner`)** para confirmações transitórias. Um único `Toaster`, de `src/components/ui/sonner`, fica em `App.vue`, fora das rotas. Não criar hosts por página nem um sistema paralelo de toasts.

- Usar `import { toast } from 'vue-sonner'` e `toast.success`, `toast.info`, `toast.warning` ou `toast.error`; `toast()` para mensagem neutra.
- Configuração global: canto inferior direito, até 3 toasts visíveis, duração de 5s, botão “Fechar notificação”, cores semânticas, raio 4px e camada 80. Tema sincronizado com `useTheme` (claro/escuro/sistema).
- Sonner anuncia notificações em região `aria-live='polite'`, sem mover foco automaticamente; Alt+T permite acessar os toasts pelo teclado. O temporizador pausa durante interação com a pilha.
- Erro acionável usa `{ duration: Infinity }` e permanece até fechar ou resolver. Guardar o ID retornado e chamar `toast.dismiss(id)` ao resolver; atualizações podem reutilizar `{ id }`.
- Erros urgentes que precisam interromper a leitura devem usar feedback inline com `role='alert'`; a variante visual `toast.error` mantém o anúncio educado do Sonner.
- Não anunciar a mesma mensagem simultaneamente em duas regiões. Confirmações de envio/exclusão simulados usam toast; validação e falhas que exigem corrigir o formulário permanecem inline.

O catálogo `/design-system` demonstra sucesso, informação, aviso e erro persistente. Os exemplos continuam sem persistência ou integração de backend.

Dialog: título obrigatório, descrição quando necessária, foco preso enquanto modal, Escape fecha se não houver operação crítica em curso, retorno ao acionador. Clique externo não descarta formulário sujo sem aviso. Sheet segue as mesmas regras de foco e fechamento; inclui ação Fechar com nome acessível.

## 8. Composição de telas

### Atendimento — referência aprovada

Header: assinatura textual, Chamados, Dashboard, Equipe, busca, tema e perfil. Fila: busca, filtros de status e itens. Conversa: assunto, organização, autor, histórico, anexos e compositor. Detalhes: status, prioridade e responsável. Mostrar informações adicionais apenas quando previstas no domínio.

No portal do solicitante, usar a mesma linguagem; retirar controles internos, notas privadas e atribuição editável. Perfis internos podem ver/alterar somente o que suas permissões permitem.

### Novo chamado — padrão proposto

Formulário com assunto, descrição e anexos. Solicitante/organização vêm da sessão no portal externo; equipe interna pode selecionar quando autorizado. Prioridade editável depende da permissão. CTA “Criar chamado”. Validar no cliente e servidor, focar primeiro erro após envio e preservar dados em falha. Confirmação navega ao chamado criado.

### Dashboard — padrão proposto

Métricas compactas (Abertos, Em atendimento, Resolvidos no período), lista de chamados prioritários e distribuição por responsável. Período selecionado visível. Cada métrica deve declarar se conta estoque atual ou ocorrências no período; não misturar ambos sem rótulo. Estados loading, erro, zero real e sem dados são distintos. Gráficos devem ter resumo e dados acessíveis; não comunicar séries só por cor.

### Permissões mínimas sugeridas, a confirmar no backend

| Ação | Solicitante | Atendente | Administrador |
| --- | --- | --- | --- |
| Abrir chamado | Sim | Sim | Sim |
| Ver/responder | Chamados autorizados | Filas autorizadas | Escopo autorizado |
| Ver/criar nota interna | Não | Conforme permissão | Conforme permissão |
| Alterar responsável/prioridade | Não por padrão | Conforme permissão | Conforme permissão |
| Excluir | Não por padrão | Não por padrão | Permissão explícita |

Perfis são convenções propostas; não presumir acesso global do administrador nem acesso de toda a empresa a um chamado. Autorização é aplicada no servidor em cada operação.

## 9. Contratos de dados e eventos

```ts
export type ThemeMode = 'light' | 'dark' | 'system'
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'
export type MessageVisibility = 'public' | 'internal'
export type UploadState = 'queued' | 'uploading' | 'ready' | 'failed' | 'removing'

export interface Assignee {
  id: string
  name: string
  avatarUrl?: string
  teamName?: string
}
export interface TicketSummary {
  id: string
  code: string
  subject: string
  organizationName: string
  status: TicketStatus
  priority: TicketPriority
  assignee: Assignee | null
  updatedAt: string // ISO 8601 com timezone
  unread: boolean
}
export interface Attachment {
  localId: string
  id?: string // presente após persistência
  name: string
  mimeType: string
  sizeBytes: number
  state: UploadState
  progress?: number // 0..100; apenas uploading
  error?: string
}
export interface TicketMessage {
  id: string
  ticketId: string
  author: { id: string; name: string; roleLabel: string; avatarUrl?: string }
  visibility: MessageVisibility
  body: string // texto ou conteúdo sanitizado conforme contrato da API
  createdAt: string
  attachments: Attachment[]
}
export interface ComposerDraft {
  visibility: MessageVisibility
  body: string
  attachments: Attachment[]
}
export interface SubmitReply {
  ticketId: string
  visibility: MessageVisibility
  body: string
  attachmentIds: string[]
  requestId: string // identificador estável para a mesma tentativa lógica
}
export interface UploadPolicy {
  acceptedTypes: string[]
  maxFiles: number
  maxBytesPerFile: number
}
```

IDs são strings opacas. Rótulos pt-BR ficam em um mapa central, separados dos enums. `requestId` deve ser reutilizado no retry da mesma submissão se o backend suportar idempotência; emitir o campo sozinho não garante proteção. A API deve retornar estado confirmado, erros por campo e falha geral. Transições permitidas de status vêm das regras de negócio, não do badge.

## 10. Quick start — tokens CSS e Tailwind 4

Base de integração proposta para projeto que já tenha Tailwind 4 e shadcn-vue configurados. Mesclar no stylesheet global, preservando imports necessários do projeto; não duplicar `@import` nem blocos de tema existentes. Configurar `tailwind.cssVariables: true` em `components.json`. A definição usa cores completas em hexadecimal.

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light;
  --background: #FFFFFF;
  --foreground: #18181B;
  --card: #FAFAFA;
  --card-foreground: #18181B;
  --popover: #FFFFFF;
  --popover-foreground: #18181B;
  --primary: #B9E58C;
  --primary-foreground: #18181B;
  --primary-hover: #C9EDA6;
  --primary-active: #A4D574;
  --secondary: #F4F4F5;
  --secondary-foreground: #18181B;
  --muted: #F4F4F5;
  --muted-foreground: #52525B;
  --accent: #EFF5E9;
  --accent-foreground: #365C36;
  --brand-text: #365C36;
  --border: #E4E4E7;
  --input: #71717A;
  --ring: #365C36;
  --destructive: #B91C1C;
  --destructive-foreground: #FFFFFF;
  --danger-bg: #FEF2F2;
  --danger-fg: #B91C1C;
  --danger-border: #B91C1C;
  --info-bg: #EFF6FF;
  --info-fg: #1D4ED8;
  --success-bg: #F0FDF4;
  --success-fg: #166534;
  --warning-bg: #FFFBEB;
  --warning-fg: #92400E;
  --disabled-bg: #E4E4E7;
  --disabled-fg: #71717A;
  --radius: 0.25rem;
  --ab-font-sans: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  --ab-font-mono: 'DM Sans', ui-sans-serif, monospace;
  --ab-space-1: 0.25rem;
  --ab-space-2: 0.5rem;
  --ab-space-3: 0.75rem;
  --ab-space-4: 1rem;
  --ab-space-6: 1.5rem;
  --ab-space-8: 2rem;
  --ab-duration-fast: 120ms;
  --ab-duration-panel: 180ms;
  --ab-ease: cubic-bezier(0.2, 0, 0, 1);
  --ab-shadow-overlay: 0 4px 12px rgb(0 0 0 / 0.12);
}
.dark {
  color-scheme: dark;
  --background: #09090B;
  --foreground: #FAFAFA;
  --card: #18181B;
  --card-foreground: #FAFAFA;
  --popover: #18181B;
  --popover-foreground: #FAFAFA;
  --primary: #B9E58C;
  --primary-foreground: #18181B;
  --primary-hover: #C9EDA6;
  --primary-active: #A4D574;
  --secondary: #27272A;
  --secondary-foreground: #FAFAFA;
  --muted: #27272A;
  --muted-foreground: #A1A1AA;
  --accent: #202D24;
  --accent-foreground: #C2DDA9;
  --brand-text: #B9E58C;
  --border: #3F3F46;
  --input: #71717A;
  --ring: #B9E58C;
  --destructive: #B91C1C;
  --destructive-foreground: #FFFFFF;
  --danger-bg: #450A0A;
  --danger-fg: #FCA5A5;
  --danger-border: #F87171;
  --info-bg: #172554;
  --info-fg: #93C5FD;
  --success-bg: #052E16;
  --success-fg: #86EFAC;
  --warning-bg: #291E0B;
  --warning-fg: #FCD34D;
  --disabled-bg: #27272A;
  --disabled-fg: #A1A1AA;
  --ab-shadow-overlay: 0 4px 12px rgb(0 0 0 / 0.32);
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
  --color-primary-active: var(--primary-active);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-brand-text: var(--brand-text);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-danger-bg: var(--danger-bg);
  --color-danger-fg: var(--danger-fg);
  --color-danger-border: var(--danger-border);
  --color-info-bg: var(--info-bg);
  --color-info-fg: var(--info-fg);
  --color-success-bg: var(--success-bg);
  --color-success-fg: var(--success-fg);
  --color-warning-bg: var(--warning-bg);
  --color-warning-fg: var(--warning-fg);
  --color-disabled-bg: var(--disabled-bg);
  --color-disabled-fg: var(--disabled-fg);
  --font-sans: var(--ab-font-sans);
  --font-mono: var(--ab-font-mono);
  --radius-sm: 0.125rem;
  --radius-md: var(--radius);
  --radius-lg: 0.5rem;
}
@layer base {
  body {
    margin: 0;
    background: var(--background);
    color: var(--foreground);
    font-family: var(--ab-font-sans);
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  :focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
}
@media (prefers-reduced-motion: reduce) {
  :root { --ab-duration-fast: 0ms; --ab-duration-panel: 0ms; }
}
```

Aplicação nos wrappers:

```vue
<!-- Superfície usa semântica, sem duplicação light/dark no template. -->
<section class="rounded-md border border-border bg-card p-4 text-card-foreground">
  <h2 class="text-lg font-semibold">Detalhes do chamado</h2>
</section>
```

Classes base sugeridas para botão primário: `bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active`. Inputs: `bg-background text-foreground border-input placeholder:text-muted-foreground`. Nota: `bg-accent text-accent-foreground border-brand-text`. O wrapper deve remover estilos default conflitantes, incluindo raios excessivos, sombras, `outline-none` e rings de opacidade baixa; não acumular duas implementações de foco.

## 11. Organização da implementação

```text
src/
  styles/deskli.css
  components/ui/                # primitivas shadcn-vue existentes
  features/tickets/components/  # TicketListItem, MessageItem, ReplyComposer
  composables/useTheme.ts
  types/ticket.ts
  constants/ticket-labels.ts
  pages/design-system/          # catálogo navegável
```

### Matriz de composição

| Componente deskli | Base a reutilizar |
| --- | --- |
| Botão / ícone | Button |
| Campo | Label + Input / Textarea + descrição/erro |
| Seletor responsável | Select ou Combobox + Avatar |
| Checkbox / Switch | Checkbox / Switch |
| Status / prioridade | Badge com mapa semântico |
| Abas / compositor | Tabs + editor + Button |
| Tema / ações | DropdownMenu com grupo radio |
| Modal / detalhes | Dialog / Sheet |
| Anexos e notas | Composição própria com primitivas |
| Lista de chamados | Elementos semânticos e wrappers, sem novo framework |

Catálogo precisa mostrar todas as variantes e estados em ambos os temas, com controles para alternar tema, densidade e dados de demonstração. Incluir exemplo interativo de fila → conversa → nota interna → anexo → envio simulado. Distinguir claramente simulação de persistência real.

## 12. Acessibilidade e critérios de aceite

Meta: WCAG 2.2 AA. A especificação não equivale a auditoria do produto implementado. Texto normal visa contraste mínimo 4.5:1; texto grande, 3:1; contornos e indicadores necessários, 3:1 contra cores adjacentes. Alvos devem atender ao mínimo de 24×24 CSS px ou às condições/exceções previstas no critério; a convenção deskli é 32px desktop e 44px toque.

- [ ] Todos os componentes têm light/dark com mesma geometria e sem perda de conteúdo.
- [ ] Contraste verificado também em hover, seleção, erro e overlays, não apenas nos tokens base.
- [ ] Navegação completa por teclado; foco visível e não oculto por sticky header/compositor.
- [ ] Labels, nomes acessíveis, estados e mensagens são anunciados corretamente.
- [ ] Dialog/Sheet prende foco, Escape fecha quando permitido e devolve foco.
- [ ] A 320px de largura e com zoom, formulário e conversa não exigem scroll horizontal da página.
- [ ] Texto longo, nomes com acentos, anexos grandes e ausência de avatar não quebram layout.
- [ ] Trocar tema não apaga dados nem muda audiência de mensagem.
- [ ] Nota interna nunca aparece em payloads autorizados apenas ao cliente.
- [ ] Rascunhos público/interno e por chamado permanecem separados.
- [ ] Falha de envio preserva rascunho; retry não duplica mensagem confirmada.
- [ ] Upload possui progresso, erro, retry, remoção e validação coerentes com o servidor.
- [ ] Nenhum controle visual de demonstração é apresentado como funcional sem implementação.
- [ ] Estados vazio, zero, carregando, erro e sem permissão são diferentes.
- [ ] Preferência de movimento reduzido e tema do sistema funcionam.

### Verificações com maior valor

1. Teste de componente: alternar aba do compositor preserva rascunhos separados e payload correto.
2. Teste de integração: clique duplo/retry, falha de upload e falha de resposta não perdem conteúdo.
3. Teste de autorização: notas/anexos internos são inacessíveis ao solicitante no backend.
4. Verificação manual: teclado, leitor de tela, zoom e layouts 390, 768, 1280 e 1440px.
5. Comparação visual de componentes light/dark contra a prancha, admitindo normalizações documentadas.


### Contraste calculado dos tokens

Razões calculadas em sRGB para cores sólidas, sem transparência. Não substituem inspeção do componente renderizado. Divisores decorativos e estados inativos não estão nesta matriz.

| Par texto ou indicador / fundo | Light | Dark | Meta |
| --- | --- | --- | --- |
| `foreground` / `background` | 17.72:1 | 19.06:1 | 4.5:1 |
| `muted-foreground` / `card` | 7.41:1 | 6.91:1 | 4.5:1 |
| `primary-foreground` / `primary` | 12.36:1 | 12.36:1 | 4.5:1 |
| `primary-foreground` / `primary-hover` | 13.62:1 | 13.62:1 | 4.5:1 |
| `primary-foreground` / `primary-active` | 10.42:1 | 10.42:1 | 4.5:1 |
| `accent-foreground` / `accent` | 6.90:1 | 9.72:1 | 4.5:1 |
| `brand-text` / `background` | 7.66:1 | 13.88:1 | 4.5:1 |
| `danger-fg` / `danger-bg` | 5.91:1 | 8.51:1 | 4.5:1 |
| `info-fg` / `info-bg` | 6.16:1 | 8.15:1 | 4.5:1 |
| `success-fg` / `success-bg` | 6.81:1 | 10.62:1 | 4.5:1 |
| `destructive-foreground` / `destructive` | 6.47:1 | 6.47:1 | 4.5:1 |
| `input` / `background` | 4.83:1 | 4.12:1 | 3:1 |
| `input` / `card` | 4.63:1 | 3.67:1 | 3:1 |
| `ring` / `background` | 7.66:1 | 13.88:1 | 3:1 |

## 13. Governança

Versionar tokens e contratos junto ao código. Mudança de contrato/semântica exige revisão e registro de migração; novo componente precisa demonstrar necessidade que as primitivas existentes não cobrem. Cada componente deve documentar propósito, props, estados, teclado e exemplos. Atualizar a prancha após mudanças intencionais; não ajustar tokens para reproduzir artefatos de geração de imagem.

Decisões de produto ainda configuráveis: políticas de anexos, limites de texto, matriz final de permissões, transições de status e critérios das métricas. Usar fixtures explícitas em demonstrações; não transformar valores de exemplo em regras silenciosas de produção.

## 14. Instrução para implementação com IA

> Implemente o design system deskli conforme este documento, usando Vue 3, TypeScript, Tailwind e primitivas shadcn-vue existentes no projeto. Preserve o visual compacto aprovado: zinc, verde suave, raio 4px e bordas de 1px. Use os tokens semânticos de light/dark; não aplique gradientes ou cartões decorativos. Comece pelas fundações e wrappers, depois componha chamados, anexos, notas internas e compositor. Respeite contratos, estados e teclado. Separe rascunhos públicos e internos. Não invente permissões, limites de upload, métricas ou APIs. Mostre todas as variantes no catálogo e identifique operações simuladas. Valide critérios de aceite e relate o que foi implementado, testado e o que depende do backend.

## 15. Fontes e limites

- Prancha deskli light/dark selecionada pelo usuário: direção visual.
- [Vue Sonner](https://github.com/xiaoluoboding/vue-sonner): biblioteca de toasts e API.
- [shadcn-vue — Theming](https://shadcn-vue.com/docs/theming): uso de variáveis e configuração de tema.
- [Tailwind CSS — Theme variables](https://tailwindcss.com/docs/theme): registro de tokens com `@theme inline`.
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/): critérios de acessibilidade de referência.

## 16. Revisão minimalista — entrada e início (2026-10-02)

Esta revisão substitui as composições anteriores de login fotográfico, ondas SVG e tema oliva local. Segue as skills `redesign-existing-projects` e `minimalist-ui`, adaptadas aos contratos deste projeto: DM Sans, ícones existentes, verde suave e tokens semânticos permanecem como fonte de verdade.

- Login: cabeçalho com assinatura textual e seletor Claro/Escuro/Sistema; formulário à esquerda, apresentação com conversa ilustrativa à direita. Layout de até 1200px, formulário de até 368px, superfícies planas, bordas de 1px e raio de 8px. Sem gradientes ou sombras decorativas.
- Abaixo de 1024px, a apresentação é ocultada; formulário em uma coluna com padding de 24px e controles de 44px. Nenhuma informação necessária ao acesso depende do painel ilustrativo.
- Login usa diretamente os tokens globais. Alternar o tema preserva os campos; o menu compacto reutiliza `ThemeMenu` sem identidade fictícia.
- Início: cabeçalho editorial, identificação explícita do ambiente demonstrativo, três chamados de exemplo e acesso ao catálogo. Cada chamado abre a conversa correspondente no playground existente; links com hash levam à seção correta.
- Fluxo: `/` → `/login` → `/home`. Autenticação, chamados, mensagens e anexos continuam demonstrativos, sem persistência ou proteção de rotas. A Home não apresenta métricas operacionais fictícias.
- Validação: `npm run build` e `npx playwright test tests/e2e/login.spec.js` (Playwright/Chromium; `DESKLI_URL` opcional). O script cobre login e Home em 320, 390, 768 e 1440px, claro/escuro, erros, exibição de senha, navegação, modo Sistema e foco por teclado. Capturas em `harness/docs/screenshots/*-refresh-*.png`.

### Altura do login

Até 950px de altura disponível, cabeçalho, rodapé e apresentação usam espaçamentos compactos. O login cabe sem rolagem em 1280×720, 1366×768, 1440×900, 1920×1080, 1024×768, 768×800 e 390×844, inclusive com erros de validação nos dois campos. Em telas muito baixas, o conteúdo mantém rolagem natural para preservar acesso ao formulário e ao rodapé. Não usar altura fixa nem cortar conteúdo com `overflow: hidden`.

Regressão: `npx playwright test tests/e2e/login.spec.js`, com Playwright/Chromium, verifica essas dimensões em claro/escuro e acesso por teclado em 320×480. Capturas: `harness/docs/screenshots/login-fit-light.png` e `login-fit-dark.png`.

Em janelas com até 740px de altura útil, o login compacta também títulos e espaçamentos internos, incluindo o cabeçalho em tablets. A regressão cobre 1280×600, 1366×650, 1536×703, 1024×600, 768×600 e 375×600, em claro/escuro, com e sem erros. As dimensões representam a área de conteúdo do navegador. Capturas: `harness/docs/screenshots/login-short-light.png` e `login-short-dark.png`.

## 17. Densidade compacta padrão

O sistema usa controles de 32px no desktop, texto de corpo 14/20px e títulos de página 24/32px. A raiz permanece em 16px. Tokens em `src/styles/deskli.css`: `--control-height`, `--field-height` (32px), `--panel-padding` (12px), `--section-gap` (16px). A opção Confortável no catálogo eleva controles para 44px; não é uma preferência global persistida.

Layout: cabeçalho 48px, sidebar desktop 224px, conteúdo com padding 16px. Home com linhas de 12px de padding e seções separadas por 20px; catálogo com seções de 16px. Fila do playground 260px, itens e mensagens com padding 12px, avatar 32px, editor mínimo 80px redimensionável. Login acompanha títulos e controles compactos, preservando a adaptação à altura da janela.

Em telas estreitas ou com ponteiro de toque, os controles mantêm altura mínima 44px e os campos usam texto de 16px. Textos, mensagens de erro e conteúdo continuam podendo crescer. Sem zoom ou redução global da fonte.

Validação: `npx playwright test tests/e2e/compact.spec.js`, `npx playwright test tests/e2e/login.spec.js` e `npm run build` no container. A suíte compacta mede controles e densidade, verifica as três telas em claro/escuro, responsividade, menus, diálogo, seletor e foco; capturas `harness/docs/screenshots/compact-*.png`.

### Sidebar recolhível em ícones

A navegação segue o comportamento do [shadcn-vue sidebar-07](https://www.shadcn-vue.com/blocks#sidebar-07), com `collapsible="icon"`: 224px expandida e 48px recolhida no desktop. Recolhida, mantém os links com ícones, nomes acessíveis, tooltips, assinatura textual abreviada e avatar com menu de aparência. O botão do cabeçalho, a borda lateral e Ctrl/Cmd+B alternam o estado, persistido pelo cookie existente. Abaixo de 768px, abre como painel sobreposto com texto completo. Validação: `npx playwright test tests/e2e/sidebar.spec.js`, incluindo ambos os temas, teclado, tooltips, navegação, recarga e mobile.

## Migração para o harness

A especificação oficial fica em `harness/design/design-system.md`; o guia do catálogo fica em `harness/docs/catalogo.md`. Testes são descobertos pelo runner Playwright em `tests/e2e/*.spec.js`, com configuração na raiz. Novas capturas, traces e relatórios ficam em `test-results/` e `playwright-report/`, não sobrescrevem evidências históricas em `harness/docs/screenshots/`. As referências a capturas anteriores neste documento registram o histórico. Consulte `harness/docs/testing.md` para os comandos atuais.
