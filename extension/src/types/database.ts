export interface DaysFilled {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export type WeekStatus =
  | 'no-time-cards'
  | 'some-unsaved'
  | 'some-unsubmitted'
  | 'all-submitted-or-approved';

export interface Week {
  status: WeekStatus;
  daysFilled: DaysFilled;
}

export interface Weeks {
  [key: string]: Week;
}

export interface Database {
  weeks: Weeks;
}

export interface DatabaseInformation {
  database: Database;
  isDatabaseInitialized: boolean;
}

export const isDatabase = (input: unknown): input is Database => {
  return (
    input !== undefined &&
    input !== null &&
    typeof input === 'object' &&
    'weeks' in input &&
    input.weeks !== undefined
  );
};
