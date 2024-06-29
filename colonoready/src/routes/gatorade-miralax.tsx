import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format, subWeeks, subHours, subDays } from "date-fns";
import { exportToICS } from "../utils";

interface Dates {
  twoWeeksPrior: string;
  sixHoursPrior: string;
  fourHoursPrior: string;
  fiveDaysPrior: string;
  fortyEightHoursPrior: string;
  sevenDaysPrior: string;
  threeDaysPrior: string;
  oneDayPrior: string;
  dayOfProcedure: string;
}

const calculateDates = (procedureDate: Date): Dates => {
  return {
    twoWeeksPrior: format(subWeeks(procedureDate, 2), "MM/dd/yyyy h:mm aa"),
    sixHoursPrior: format(subHours(procedureDate, 6), "MM/dd/yyyy h:mm aa"),
    fourHoursPrior: format(subHours(procedureDate, 4), "MM/dd/yyyy h:mm aa"),
    fiveDaysPrior: format(subDays(procedureDate, 5), "MM/dd/yyyy h:mm aa"),
    fortyEightHoursPrior: format(
      subDays(procedureDate, 2),
      "MM/dd/yyyy h:mm aa"
    ),
    sevenDaysPrior: format(subDays(procedureDate, 7), "MM/dd/yyyy h:mm aa"),
    threeDaysPrior: format(subDays(procedureDate, 3), "MM/dd/yyyy h:mm aa"),
    oneDayPrior: format(subDays(procedureDate, 1), "MM/dd/yyyy h:mm aa"),
    dayOfProcedure: format(procedureDate, "MM/dd/yyyy h:mm aa"),
  };
};

const GatoradeMiralax = () => {
  const { state } = useLocation();
  const { date, time } = state || {};
  const [dates, setDates] = useState<Dates | null>(null);

  useEffect(() => {
    if (date && time) {
      const selectedDate = new Date(date);
      const selectedTime = new Date(time);

      const combinedDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getUTCHours() - 5,
        selectedTime.getUTCMinutes(),
        selectedTime.getUTCSeconds(),
        selectedTime.getUTCMilliseconds()
      );

      setDates(calculateDates(combinedDateTime));
    }
  }, [date, time]);

  return (
    <div className="max-w-md mx-auto my-8 p-6 ">
      <h1 className="text-2xl font-bold mb-4">Gatorade/ Miralax Schedule</h1>
      <button
        onClick={() => exportToICS(dates)}
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Export to Calendar
      </button>

      <div className="space-y-2">
        {dates?.twoWeeksPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              <strong>2 Weeks Prior</strong> <br />
              <span className="text-sm">{dates.twoWeeksPrior}</span>
            </h1>
            <p>
              Read all instructions at-least 2 weeks prior to your procedure.
              Failure to follow instructions may result in rescheduling of
              procedure. Stool must be clear to yellow at time of procedure
            </p>
          </div>
        )}

        {dates?.sevenDaysPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              <strong>7 Days Prior</strong> <br />
              <span className="text-sm">{dates.sevenDaysPrior}</span>
            </h1>

            <ul className="list-disc list-inside space-y-2">
              <li>Purchase bowel prep items</li>
              <li>STOP eating nuts, seeds, corn, or popcorn</li>
              <li>64 ounces of Gatorade</li>
              <li>no red or purple</li>
              <li>Patients with diabetes should use Gatorade G2</li>
              <li>1 - 8 ounce bottle of Miralax</li>
              <li>4 - Dulcolax laxative 5mg tablets</li>
              <li>
                2 - Gas-X/Simethicone (gas relief) Extra strength chewable
                tablets
              </li>
            </ul>
          </div>
        )}

        {dates?.fiveDaysPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              <strong>5 Days Prior</strong> <br />
              <span className="text-sm">{dates.fiveDaysPrior}</span>
            </h1>
            <p>
              Please get approval from prescribing provider to stop below
              medications; if unable to stop, please call{" "}
              <strong>417-875-3760 </strong>
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Aspirin (81 mg okay to continue)</li>
              <li>Vitamin E, iron, fish oil, other herbals</li>
              <li>Aggrenox (aspirin and Dipyridamole)</li>
              <li>Brilinta (Ticagrelor)</li>
              <li>Coumadin (Warfarin)</li>
              <li>Effient (Prasugrel)</li>
              <li>Plavix (Clopidogrel)</li>
            </ul>
          </div>
        )}

        {dates?.threeDaysPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              <strong>3 Days Prior</strong> <br />
              <span className="text-sm">{dates.threeDaysPrior}</span>
            </h1>
            <p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Start a low fiber diet (no fruits, vegetables, grains, cereal
                  or oatmeal)
                </li>
                <li>Stop any fiber supplement or iron</li>
              </ul>
            </p>
          </div>
        )}

        {dates?.sixHoursPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              <strong>6 Hours Prior</strong> <br />
              <span className="text-sm">{dates.sixHoursPrior}</span>
            </h1>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Drink the second half of solution 8 ounces every 15 minutes
                (over 1-2 hours) until mixture is gone
              </li>
              <li>
                After finishing liquid prep, take 2 Gas-X/Simethicone tablets by
                mouth
              </li>
            </ul>
          </div>
        )}

        {dates?.fortyEightHoursPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              <strong>48 Hours Prior</strong> <br />{" "}
              <span className="text-sm">{dates.fortyEightHoursPrior}</span>
            </h1>

            <ul className="list-disc list-inside space-y-2">
              <li>Eliquis (Apixaban)</li>
              <li>Pradaxa (Dabigatran)</li>
              <li>Xarelto (Rivaroxban)</li>
            </ul>
          </div>
        )}

        {dates?.oneDayPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              <strong>Day Before Procedure:</strong> <br />{" "}
              <span className="text-sm">{dates.oneDayPrior}</span>
            </h1>
            <ul className="list-disc list-inside space-y-2">
              <li>All day - Clear liquid diet</li>
              <li>DO NOT eat any solid foods</li>
              <li>
                Drink an extra 8 ounces of clear liquids every hour that you are
                awake
              </li>
              <li>
                <strong>04:00 pm</strong> - Take 4 Dulcolax tablets, continue
                clear liquids
              </li>

              <li>
                <strong>6:00 PM</strong>Start drinking Gatorade/Miralax solution
                <br />
                <span className="text-sm text-gray-600">
                  Drink 8 ounces every 15 minutes (over 1-2 hours) until half of
                  the mixture is gone
                </span>
              </li>
              <li>Continue clear liquid diet until bed</li>
            </ul>
          </div>
        )}

        {dates?.dayOfProcedure && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              Day of Procedure <br />{" "}
              <span className="text-sm">{dates.dayOfProcedure}</span>
            </h1>
            <ul className="list-disc list-inside space-y-2">
              <li>Continue clear liquid diet</li>
              <li>
                <strong>6 hours before your procedure</strong> Drink the second
                half of solution 8 ounces every 15 minutes (over 1-2 hours)
                until mixture is gone
                <br />
                <span className="text-sm text-gray-600">
                  After finishing liquid prep, take 2 Gas-X/Simethicone tablets
                  by mouth
                </span>
              </li>
            </ul>
          </div>
        )}

        {dates?.fourHoursPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender text-center shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              4 hours prior to procedure <br />
              <span className="text-sm">{dates.fourHoursPrior}</span>
            </h1>
            <span className="text-md text-red-600">DO NOT drink anything</span>
            <br />
            <span className="text-md text-red-600">Nothing by mouth</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GatoradeMiralax;
