const timeFormat = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})
const dayFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})
const fullFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'medium',
})
const numberFormat = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatTime(iso: string) {
  return timeFormat.format(new Date(iso))
}

/** Hora para o mesmo dia; dia/mês para datas anteriores. */
export function formatListTimestamp(iso: string, now = new Date()) {
  const date = new Date(iso)
  return date.toDateString() === now.toDateString()
    ? timeFormat.format(date)
    : dayFormat.format(date)
}

export function formatDateTime(iso: string) {
  return fullFormat.format(new Date(iso))
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${numberFormat.format(bytes / 1024)} KB`
  return `${numberFormat.format(bytes / 1024 / 1024)} MB`
}
