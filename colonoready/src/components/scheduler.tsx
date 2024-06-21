import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const Scheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [checked, setChecked] = useState(true);
  const navigate = useNavigate();

  const toggleChecked = () => {
    setChecked(!checked);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Schedule Appointment</h2>
      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
          Select Date
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: any) => setSelectedDate(date)}
          placeholderText="MM/DD/YYYY"
          dateFormat="MM/dd/yyyy"
          id="date"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={toggleChecked}
          id="emailReminders"
          className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="emailReminders" className="text-gray-700">
          Email Reminders
        </label>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            console.log(selectedDate);
          }}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Schedule
        </button>
        <button
          className="text-red-500 hover:underline focus:outline-none border-2 px-4 py-2 rounded-lg"
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Scheduler;
