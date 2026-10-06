export type ThemeMode = 'light' | 'dark' | 'system'
export type TicketStatus =
  'open' | 'in_progress' | 'waiting_customer' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'
export type MessageVisibility = 'public' | 'internal'
export type UploadState =
  'queued' | 'uploading' | 'ready' | 'failed' | 'removing'

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
