export interface DateOnly {
  year: number
  month: number
  day: number
}

export const serializeDateOnly = (date: DateOnly): string => {
  const month = date.month.toString().padStart(2, '0')
  const day = date.day.toString().padStart(2, '0')

  return `${month}/${day}/${date.year}`
}

export const deserializeDateOnly = (date: string): DateOnly => {
  const parts = date.split('/')

  if (parts.length !== 3) {
    throw new Error(`Invalid date: ${date}`)
  }

  const [month, day, year] = parts

  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
  }
}

export const minusDays = (date: DateOnly, days: number): DateOnly => {
  const newDate = new Date(date.year, date.month - 1, date.day - days)

  return {
    year: newDate.getFullYear(),
    month: newDate.getMonth() + 1,
    day: newDate.getDate(),
  }
}
