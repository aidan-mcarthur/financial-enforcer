import { getTimeSheet, isTimeSheetPage } from "time-sheet";
import { TimeSheetStateChange } from "types/state";
import { TimeSheet } from "types/time-sheet";

const waitFor = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const sendTimeSheetStateChange = (timeSheet: TimeSheet | null) => {
  const stateChange: TimeSheetStateChange = {
    type: "onTimeSheetStateChange",
    timeSheet,
  };

  chrome.runtime.sendMessage(stateChange);
};

const main = async () => {
  while (true) {
    await waitFor(5000);
    console.log("Checking for time sheet page...");

    if (!isTimeSheetPage()) {
      sendTimeSheetStateChange(null);

      continue;
    }

    const timeSheet = getTimeSheet();
    sendTimeSheetStateChange(timeSheet);
  }
};

main();

export {};
