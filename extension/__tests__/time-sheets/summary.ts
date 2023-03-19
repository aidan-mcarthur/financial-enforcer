import { describe, expect, test } from '@jest/globals'
import { summarizeTimeSheet } from '../../src/time-sheets/summary'
import { TimeSheet, TimeSheetDates, TimeSheetSummary } from '../../src/types/time-sheet'

const dates: TimeSheetDates = {
  monday: {
    year: 2023,
    month: 3,
    day: 1,
  },
  tuesday: {
    year: 2023,
    month: 3,
    day: 2,
  },
  wednesday: {
    year: 2023,
    month: 3,
    day: 3,
  },
  thursday: {
    year: 2023,
    month: 3,
    day: 4,
  },
  friday: {
    year: 2023,
    month: 3,
    day: 5,
  },
  saturday: {
    year: 2023,
    month: 3,
    day: 6,
  },
  sunday: {
    year: 2023,
    month: 3,
    day: 7,
  },
}

describe('summarizeTimeSheet', () => {
  test('when there are no time cards', () => {
    const emptyTimeSheet: TimeSheet = {
      dates,
      timeCards: [],
    }

    const expected: TimeSheetSummary = {
      daysFilled: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      totalDaysSaved: 0,
      totalDaysSubmitted: 0,
      weekStatus: 'no-time-cards',
    }

    expect(summarizeTimeSheet(emptyTimeSheet)).toEqual(expected)
  })

  test('when all days are filled out but not submitted', () => {
    const timeSheet: TimeSheet = {
      dates,
      timeCards: [
        {
          status: 'saved',
          hours: {
            monday: 8,
            tuesday: 8,
            wednesday: 8,
            thursday: 8,
            friday: 8,
            saturday: 0,
            sunday: 0,
          },
        },
      ],
    }

    const expected: TimeSheetSummary = {
      daysFilled: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      totalDaysSaved: 5,
      totalDaysSubmitted: 0,
      weekStatus: 'some-unsubmitted',
    }

    expect(summarizeTimeSheet(timeSheet)).toEqual(expected)
  })

  test('when there are two time cards and both are submitted', () => {
    const timeSheet: TimeSheet = {
      dates,
      timeCards: [
        {
          status: 'submitted',
          hours: {
            monday: 8,
            tuesday: 8,
            wednesday: 8,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0,
          },
        },
        {
          status: 'submitted',
          hours: {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 8,
            friday: 8,
            saturday: 0,
            sunday: 0,
          },
        },
      ],
    }

    const expected: TimeSheetSummary = {
      daysFilled: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      totalDaysSaved: 0,
      totalDaysSubmitted: 5,
      weekStatus: 'all-submitted-or-approved',
    }

    expect(summarizeTimeSheet(timeSheet)).toEqual(expected)
  })

  test('when there are two time cards and one is submitted', () => {
    const timeSheet: TimeSheet = {
      dates,
      timeCards: [
        {
          status: 'saved',
          hours: {
            monday: 8,
            tuesday: 8,
            wednesday: 8,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0,
          },
        },
        {
          status: 'submitted',
          hours: {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 8,
            friday: 8,
            saturday: 0,
            sunday: 0,
          },
        },
      ],
    }

    const expected: TimeSheetSummary = {
      daysFilled: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      totalDaysSaved: 3,
      totalDaysSubmitted: 2,
      weekStatus: 'some-unsubmitted',
    }

    expect(summarizeTimeSheet(timeSheet)).toEqual(expected)
  })

  test('when there are two time cards and one includes the weekend', () => {
    const timeSheet: TimeSheet = {
      dates,
      timeCards: [
        {
          status: 'saved',
          hours: {
            monday: 8,
            tuesday: 8,
            wednesday: 8,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0,
          },
        },
        {
          status: 'submitted',
          hours: {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 8,
            sunday: 8,
          },
        },
      ],
    }

    const expected: TimeSheetSummary = {
      daysFilled: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: true,
      },
      totalDaysSaved: 3,
      totalDaysSubmitted: 2,
      weekStatus: 'some-unsubmitted',
    }

    expect(summarizeTimeSheet(timeSheet)).toEqual(expected)
  })

  test('when you have a time card that is not saved', () => {
    const timeSheet: TimeSheet = {
      dates,
      timeCards: [
        {
          status: 'unsaved',
          hours: {
            monday: 8,
            tuesday: 8,
            wednesday: 8,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0,
          },
        },
      ],
    }

    const expected: TimeSheetSummary = {
      daysFilled: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      totalDaysSaved: 0,
      totalDaysSubmitted: 0,
      weekStatus: 'some-unsaved',
    }

    expect(summarizeTimeSheet(timeSheet)).toEqual(expected)
  })
})
