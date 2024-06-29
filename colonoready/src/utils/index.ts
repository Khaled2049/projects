import { createEvents, EventAttributes } from "ics";
import { parse } from "date-fns";
import { saveAs } from "file-saver";
const convertToDateArray = (
  dateStr: string
): [number, number, number, number, number] => {
  const parsedDate = parse(dateStr, "MM/dd/yyyy h:mm aa", new Date());
  return [
    parsedDate.getFullYear(),
    parsedDate.getMonth() + 1,
    parsedDate.getDate(),
    parsedDate.getHours(),
    parsedDate.getMinutes(),
  ];
};

export const exportToICS = (dates: any) => {
  if (!dates) return;

  const events: EventAttributes[] = [
    {
      start: convertToDateArray(dates.twoWeeksPrior),
      duration: { hours: 1, minutes: 0 },
      title: "Two Weeks Prior",
      description: "Reminder for two weeks prior to the procedure",
    },
    {
      start: convertToDateArray(dates.sixHoursPrior),
      duration: { hours: 1, minutes: 0 },
      title: "Six Hours Prior",
      description: "Reminder for six hours prior to the procedure",
    },
    {
      start: convertToDateArray(dates.fourHoursPrior),
      duration: { hours: 1, minutes: 0 },
      title: "Four Hours Prior",
      description: "Reminder for four hours prior to the procedure",
    },
    {
      start: convertToDateArray(dates.fiveDaysPrior),
      duration: { hours: 1, minutes: 0 },
      title: "Five Days Prior",
      description: "Reminder for five days prior to the procedure",
    },
    {
      start: convertToDateArray(dates.fortyEightHoursPrior),
      duration: { hours: 1, minutes: 0 },
      title: "48 Hours Prior",
      description: "Reminder for 48 hours prior to the procedure",
    },
    {
      start: convertToDateArray(dates.sevenDaysPrior),
      duration: { hours: 1, minutes: 0 },
      title: "Seven Days Prior",
      description: "Reminder for seven days prior to the procedure",
    },
    {
      start: convertToDateArray(dates.threeDaysPrior),
      duration: { hours: 1, minutes: 0 },
      title: "Three Days Prior",
      description: "Reminder for three days prior to the procedure",
    },
    {
      start: convertToDateArray(dates.oneDayPrior),
      duration: { hours: 1, minutes: 0 },
      title: "One Day Prior",
      description: "Reminder for one day prior to the procedure",
    },
    {
      start: convertToDateArray(dates.dayOfProcedure),
      duration: { hours: 1, minutes: 0 },
      title: "Day of Procedure",
      description: "Reminder for the day of the procedure",
    },
  ];

  createEvents(events, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }

    const blob = new Blob([value], {
      type: "text/calendar;charset=utf-8",
    });
    saveAs(blob, "schedule.ics");
  });
};
