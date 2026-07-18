function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function getLocalDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function getDateTimeLocalValue(date: Date = new Date()): string {
  return `${getLocalDateKey(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function getLocalDateKeyFromIso(isoDate: string): string | null {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return getLocalDateKey(date)
}

export function isSameLocalDay(firstIsoDate: string, secondDate: Date = new Date()): boolean {
  return getLocalDateKeyFromIso(firstIsoDate) === getLocalDateKey(secondDate)
}
