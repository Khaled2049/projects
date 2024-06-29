import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FormComponent = () => {
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    const { date, time, option } = data;
    const formattedDate = date ? date.toISOString() : null;
    const formattedTime = time ? time.toISOString() : null;

    if (option === "Trilyte") {
      navigate("/trilyte", {
        state: { date: formattedDate, time: formattedTime, option },
      });
    } else if (option === "Gatorade/Miralax") {
      navigate("/gatorade-miralax", {
        state: { date: formattedDate, time: formattedTime, option },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg"
    >
      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
          Select Date
        </label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              placeholderText="MM/DD/YYYY"
              dateFormat="MM/dd/yyyy"
              id="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
          Select Time
        </label>
        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(time) => field.onChange(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="hh:mm aa"
              id="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Select Option
        </label>
        <div className="flex items-center mb-2">
          <Controller
            control={control}
            name="option"
            defaultValue="Trilyte"
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="radio"
                  id="trilyte"
                  value="Trilyte"
                  checked={field.value === "Trilyte"}
                  onChange={() => field.onChange("Trilyte")}
                  className="mr-2"
                />
                <label htmlFor="trilyte" className="text-gray-700">
                  Trilyte
                </label>
              </>
            )}
          />
        </div>
        <div className="flex items-center">
          <Controller
            control={control}
            name="option"
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="radio"
                  id="gatoradeMiralax"
                  value="Gatorade/Miralax"
                  checked={field.value === "Gatorade/Miralax"}
                  onChange={() => field.onChange("Gatorade/Miralax")}
                  className="mr-2"
                />
                <label htmlFor="gatoradeMiralax" className="text-gray-700">
                  Gatorade/Miralax
                </label>
              </>
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Generate Schedule
        </button>
      </div>
    </form>
  );
};

export default FormComponent;
