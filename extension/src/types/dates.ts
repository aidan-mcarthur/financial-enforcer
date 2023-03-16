export interface DateOnly {
  year: number
  month: number
  day: number
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export const serializeDateOnly = (date: DateOnly): string => {
  const month = date.month.toString().padStart(2, '0')
  const day = date.day.toString().padStart(2, '0')

  return `${month}/${day}/${date.year}`
}

export const isDateOnlyEqual = (first: DateOnly, second: DateOnly) => {
  return first.month === second.month && first.day === second.day && first.year === second.year
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

export const getTodayDateOnly = (): DateOnly => {
  const now = new Date()

  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()

  return {
    year,
    month,
    day,
  }
}

export const getDayOfWeek = (dateOnly: DateOnly): DayOfWeek => {
  const dateObject = new Date(dateOnly.year, dateOnly.month - 1, dateOnly.day)
  const dayOfWeekIndex = dateObject.getDay()

  const daysOfWeek: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return daysOfWeek[dayOfWeekIndex]
}

export const dayOfWeekIndexes: Record<DayOfWeek, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
}

// This gets the Monday *prior* to the date you provide, which can be used to determine Financial Force's start date for the current week.
export const getMondayOfDateOnly = (dateOnly: DateOnly): DateOnly => {
  const dayOfWeek = getDayOfWeek(dateOnly)
  return minusDays(dateOnly, dayOfWeekIndexes[dayOfWeek])
}

export const isBusinessDayOfWeek = (dayOfWeek: DayOfWeek): boolean => {
  return (
    dayOfWeek === 'monday' ||
    dayOfWeek === 'tuesday' ||
    dayOfWeek === 'wednesday' ||
    dayOfWeek === 'thursday' ||
    dayOfWeek === 'friday'
  )
}

export const getAllDaysPriorInWeek = (
  dayOfWeek: DayOfWeek,
  inclusive: boolean,
  onlyBusinessDays: boolean,
): DayOfWeek[] => {
  const dayOfWeekIndex = dayOfWeekIndexes[dayOfWeek]
  const startIndex = 0
  const endIndex = dayOfWeekIndex + (inclusive ? 1 : 0)

  const daysOfWeek = Object.keys(dayOfWeekIndexes) as DayOfWeek[]
  return daysOfWeek.slice(startIndex, endIndex).filter((singleDayOfWeek) => {
    if (onlyBusinessDays && !isBusinessDayOfWeek(singleDayOfWeek)) {
      return false
    }

    return true
  })
}
