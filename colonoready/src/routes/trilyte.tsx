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
    twoWeeksPrior: format(subWeeks(procedureDate, 2), "MM/dd/yyyy"),
    sixHoursPrior: format(subHours(procedureDate, 6), "MM/dd/yyyy h:mm aa"),
    fourHoursPrior: format(subHours(procedureDate, 4), "MM/dd/yyyy h:mm aa"),
    fiveDaysPrior: format(subDays(procedureDate, 5), "MM/dd/yyyy"),
    fortyEightHoursPrior: format(subDays(procedureDate, 2), "MM/dd/yyyy"),
    sevenDaysPrior: format(subDays(procedureDate, 7), "MM/dd/yyyy"),
    threeDaysPrior: format(subDays(procedureDate, 3), "MM/dd/yyyy "),
    oneDayPrior: format(subDays(procedureDate, 1), "MM/dd/yyyy"),
    dayOfProcedure: format(procedureDate, "MM/dd/yyyy"),
  };
};

const Trilyte = () => {
  const { state } = useLocation();
  const { date, time, email } = state || {};
  const [dates, setDates] = useState<Dates | null>(null);
  console.log("Email won't be sent yet", email);
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
      <h1 className="text-2xl font-bold mb-4">Trilyte Schedule </h1>
      <button
        onClick={() => exportToICS(dates)}
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Export to Calendar
      </button>
      <div className="space-y-2">
        {dates?.twoWeeksPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 ">
              <strong>2 Weeks Prior</strong> <br />
              <span className="text-sm">{dates.twoWeeksPrior} 6:00 AM</span>
            </h1>
            <p>
              Read all instructions at-least 2 weeks prior to your procedure.
              Failure to follow instructions may result in rescheduling of
              procedure.
            </p>
          </div>
        )}

        {dates?.sevenDaysPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 ">
              <strong>7 Days Prior</strong> <br />
              <span className="text-sm ">{dates.sevenDaysPrior} 6:00 AM</span>
            </h1>

            <ul className="list-disc list-inside space-y-2">
              <li>STOP eating nuts, seeds, corn, or popcorn</li>
              <li>Ensure you have the following bowel prep items</li>
              {/* Secondary List */}
              <li>Trilyte and Reglan, prescription from pharmacy</li>
              <li>4 - Dulcolax laxative tablets, over-the-counter</li>
              <li>
                2 -Gas-X/Simethicone (gas relief) Extra strength chewable
                tablets
              </li>
            </ul>
          </div>
        )}

        {dates?.fiveDaysPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 ">
              <strong>5 Days Prior</strong> <br />
              <span className="text-sm">{dates.fiveDaysPrior} 6:00 AM</span>
            </h1>
            <p>
              Stop the following medications if you are on any (Obtain approval
              from prescibing provider prior to stopping)
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Aspirin full dose or 325mg (81 mg okay to continue)</li>
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
            <h1 className="text-2xl font-bold mb-4 ">
              <strong>3 Days Prior</strong> <br />
              <span className="text-sm">{dates.threeDaysPrior} 6:00 AM</span>
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

        {dates?.fortyEightHoursPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 ">
              <strong>48 Hours Prior</strong> <br />{" "}
              <span className="text-sm">
                {dates.fortyEightHoursPrior} 6:00 AM
              </span>
            </h1>
            <p>
              Stop the following medications if you are on any (Obtain approval
              from prescibing provider prior to stopping)
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Eliquis (Apixaban)</li>
              <li>Pradaxa (Dabigatran)</li>
              <li>Xarelto (Rivaroxban)</li>
            </ul>
          </div>
        )}

        {dates?.oneDayPrior && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 ">
              <strong>Day Before Procedure:</strong> <br />{" "}
              <span className="text-sm">{dates.oneDayPrior} 6:00 AM</span>
            </h1>
            <ul className="list-disc list-inside space-y-2">
              <li>All day - Clear liquid diet</li>
              <li>DO NOT eat any solid foods</li>
              <li>
                Drink an extra 8 ounces of clear liquids every hour that you are
                awake
              </li>
              <hr />
              <li>
                <strong>12:00 noon</strong> - Take 4 Dulcolax tablets, continue
                clear liquids
              </li>
              <li>
                <strong>6:00 PM</strong> – Take Reglan to settle your stomach
                <br />
                <span className="text-sm text-gray-600">
                  If you did not receive Reglan skip this step, some patients
                  have allergies or drug interactions
                </span>
              </li>
              <li>
                <strong>6:30 PM</strong> - Start 8oz Trilyte Solution every 10
                minutes until half gone
                <br />
                <span className="text-sm text-gray-600">
                  If you get sick, take a 10-15 minute break
                </span>
                <br />
                <span className="text-sm text-gray-600">
                  Place remainder in fridge
                </span>
              </li>
            </ul>
          </div>
        )}

        {dates?.dayOfProcedure && (
          <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 ">
              Day of Procedure <br />{" "}
              <span className="text-sm">{dates.dayOfProcedure}</span>
            </h1>
            <ul className="list-disc list-inside space-y-2">
              <li>Continue clear liquid diet</li>
            </ul>
            {dates?.sixHoursPrior && (
              <div className="max-w-lg mx-auto my-8 p-4 bg-lavender shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4 ">
                  <strong>6 Hours Prior</strong> <br />
                  <span className="text-sm">{dates.sixHoursPrior}</span>
                </h1>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <span className="text-sm text-gray-600">
                      8oz every 10 minutes until it is gone
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-gray-600">
                      After finishing liquid prep, take 2 Gas-X/Simethicone
                      tablets by mouth
                    </span>
                  </li>
                  <li>
                    If you take blood pressure medication, make sure to take it
                    at least 6 hours prior to procedure with a sip of water
                  </li>
                  <li>
                    If you are diabetic - talk to the doctor who prescribes your
                    medication, you may need special instructions for day of
                    procedure
                  </li>
                </ul>
              </div>
            )}

            {dates?.fourHoursPrior && (
              <div className="max-w-lg mx-auto my-8 p-4 text-center bg-lavender shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4 ">
                  4 hours prior to procedure <br />
                  <span className="text-sm">{dates.fourHoursPrior}</span>
                </h1>
                <span className="text-lg text-red-600">
                  DO NOT drink anything
                </span>
                <br />
                <span className="text-lg text-red-600">Nothing by mouth</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trilyte;
