import { storageLocalGetAsync, storageLocalSetAsync } from "chrome";
import { Database, DaysFilled, isDatabase, WeekStatus } from "types/database";
import { serializeDateOnly } from "types/dates";
import { isTimeSheetStateChange, StateChange } from "types/state";
import { TimeCard } from "types/time-sheet";

chrome.runtime.onStartup.addListener(function () {
  main();
});

const getDatabase = async (): Promise<Database | null> => {
  const database = await storageLocalGetAsync("database");
  console.log("database", database);

  if (!isDatabase(database)) {
    return null;
  }

  return database;
};

const initializeDatabase = async () => {
  const database: Database = {
    weeks: {},
  };
  await storageLocalSetAsync({ database });
};

const main = async () => {
  const database = await getDatabase();

  if (database === null) {
    console.log("Initializing database...");
    await initializeDatabase();
  }

  flashBadge("!", 100000, 500);
};

main();

function flashBadge(message: string, times: number, interval: number) {
  flash();
  function flash() {
    setTimeout(function () {
      if (times == 0) {
        chrome.action.setBadgeText({ text: message });
        return;
      }
      if (times % 2 == 0) {
        chrome.action.setBadgeText({ text: message });
      } else {
        chrome.action.setBadgeText({ text: "" });
      }
      times--;
      flash();
    }, interval);
  }
}

const determineWeekStatusFromTimeCards = (
  timeCards: TimeCard[]
): WeekStatus => {
  if (!timeCards.length) {
    return "no-time-cards";
  }

  const firstUnsaved = timeCards.find(
    (timeCard) => timeCard.status === "unsaved"
  );
  if (firstUnsaved) {
    return "some-unsaved";
  }

  if (
    timeCards.every(
      (timeCard) =>
        timeCard.status === "submitted" || timeCard.status === "approved"
    )
  ) {
    return "all-submitted-or-approved";
  }

  return "some-unsubmitted";
};

const determineDaysFilledFromTimeCards = (
  timeCards: TimeCard[]
): DaysFilled => {
  const daysFilled: DaysFilled = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };

  for (const timeCard of timeCards) {
    if (timeCard.hours.monday > 0) {
      daysFilled.monday = true;
    }

    if (timeCard.hours.tuesday > 0) {
      daysFilled.tuesday = true;
    }

    if (timeCard.hours.wednesday > 0) {
      daysFilled.wednesday = true;
    }

    if (timeCard.hours.thursday > 0) {
      daysFilled.thursday = true;
    }

    if (timeCard.hours.friday > 0) {
      daysFilled.friday = true;
    }

    if (timeCard.hours.saturday > 0) {
      daysFilled.saturday = true;
    }

    if (timeCard.hours.sunday > 0) {
      daysFilled.sunday = true;
    }
  }

  return daysFilled;
};

chrome.runtime.onMessage.addListener(async (request: StateChange, _, __) => {
  if (!isTimeSheetStateChange(request)) {
    return;
  }

  if (!request.timeSheet) {
    return;
  }

  const database = await getDatabase();

  if (database === null) {
    throw new Error("Database is not initialized, but it should be.");
  }

  const mondaySerialized = serializeDateOnly(request.timeSheet.dates.monday);

  database.weeks[mondaySerialized] = {
    status: determineWeekStatusFromTimeCards(request.timeSheet.timeCards),
    daysFilled: determineDaysFilledFromTimeCards(request.timeSheet.timeCards),
  };

  console.log(database);

  await storageLocalSetAsync({ database });
});

export {};
