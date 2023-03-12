import { deserializeDateOnly, minusDays } from './types/dates';
import {
  TimeCard,
  TimeCardStatus,
  TimeSheet,
  TimeSheetDates,
} from './types/time-sheet';

export const isTimeSheetPage = (): boolean => {
  const timeSheetElement = document.querySelector('[data-ffid="TimecardGrid"]');
  const weekEndingElement = document.querySelector('[data-ffid="weekEnding"]');
  return timeSheetElement !== null && weekEndingElement !== null;
};

const getDates = (): TimeSheetDates => {
  const weekEndingElement = document.querySelector(
    '[data-ffid="weekEnding"] input',
  ) as HTMLInputElement;

  if (weekEndingElement === null) {
    throw new Error('Could not find week ending element');
  }

  const weekEnding = deserializeDateOnly(weekEndingElement.value);

  const dates: TimeSheetDates = {
    monday: minusDays(weekEnding, 6),
    tuesday: minusDays(weekEnding, 5),
    wednesday: minusDays(weekEnding, 4),
    thursday: minusDays(weekEnding, 3),
    friday: minusDays(weekEnding, 2),
    saturday: minusDays(weekEnding, 1),
    sunday: minusDays(weekEnding, 0),
  };

  return dates;
};

export const getTimeSheet = (): TimeSheet => {
  const timeSheetElement = document.querySelector('[data-ffid="TimecardGrid"]');
  if (timeSheetElement === null) {
    throw new Error('Could not find time sheet element');
  }

  const timeCardElements = timeSheetElement.getElementsByTagName('table');

  const timeCards: TimeCard[] = [];

  for (const [index, timeCardElement] of Array.from(
    timeCardElements,
  ).entries()) {
    const projectName = getProjectName(timeCardElement);
    if (projectName === null) {
      continue;
    }
    timeCards.push(getTimeCard(timeCardElement, projectName, index));
  }

  const weekEndingElement = document.querySelector(
    '[data-ffid="weekEnding"] input',
  ) as HTMLInputElement;

  if (weekEndingElement === null) {
    throw new Error('Could not find week ending element');
  }

  return {
    dates: getDates(),
    timeCards,
  };
};

const getProjectName = (timeCardElement: HTMLElement): string | null => {
  const columns = timeCardElement.getElementsByTagName('td');

  if (columns.length === 0) {
    throw new Error('Could not find any columns');
  }

  const inputElement = columns[1].querySelector('input');
  if (inputElement === null) {
    return null;
  }

  const projectName = inputElement.value.trim();

  if (projectName === '') {
    return null;
  }

  return projectName;
};

const getTimeCard = (
  timeCardElement: HTMLTableElement,
  projectName: string,
  index: number,
): TimeCard => {
  return {
    index,
    projectName,
    hours: {
      monday: getDayHours(timeCardElement, 1),
      tuesday: getDayHours(timeCardElement, 2),
      wednesday: getDayHours(timeCardElement, 3),
      thursday: getDayHours(timeCardElement, 4),
      friday: getDayHours(timeCardElement, 5),
      saturday: getDayHours(timeCardElement, 6),
      sunday: getDayHours(timeCardElement, 7),
    },
    status: getStatus(timeCardElement),
  };
};

const getStatus = (timeCardElement: HTMLElement): TimeCardStatus => {
  const statusElement = timeCardElement.querySelector(
    '[data-columnid="statusId"]',
  ) as HTMLElement;

  if (statusElement === null) {
    throw new Error('Could not find status element');
  }

  const status = statusElement.innerText.trim().toLocaleLowerCase();

  if (
    status !== 'submitted' &&
    status !== 'saved' &&
    status !== 'unsaved' &&
    status !== 'approved'
  ) {
    throw new Error(`Unknown status: ${status}`);
  }

  return status;
};

const getDayHours = (
  timecardElement: HTMLElement,
  dayNumber: number,
): number => {
  const column = timecardElement.querySelector(
    `[data-columnid="weekDay${dayNumber}"]`,
  ) as HTMLElement;
  if (column === null) {
    throw new Error(`Could not find column for day ${dayNumber}`);
  }

  return parseFloat(column.innerText);
};
