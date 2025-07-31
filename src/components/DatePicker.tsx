import React, { useState, useRef } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react"; // Calendar icon
import "react-day-picker/dist/style.css";

export default function DatePicker({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const defaultClassNames = getDefaultClassNames();
  const today = new Date();
  // Close calendar on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={calendarRef}>
      <button
        onClick={() => setShowCalendar((prev) => !prev)}
        className="w-full border px-4 py-2 rounded text-sm bg-white shadow flex items-center justify-between"
      >
        <span className="text-black font-medium">
          {selectedDate ? selectedDate.toLocaleDateString() : "Select a Date"}
        </span>
        <CalendarIcon className="w-5 h-5 text-gray-500 ml-2" />
      </button>

      {showCalendar && (
        <div className="absolute z-10 mt-2 bg-white border rounded shadow">
          <DayPicker
            mode="single"
            selected={selectedDate}
            navLayout="around"
            captionLayout="dropdown"
            onSelect={(date) => {
              setSelectedDate(date);
              setShowCalendar(false); // auto close on selection
            }}
            classNames={{
              today: `border-amber-500`, // Add a border to today's date
              selected: `bg-amber-500 border-amber-500 text-white`, // Highlight the selected day
              root: `${defaultClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
              chevron: `${defaultClassNames.chevron} fill-amber-500`, // Change the color of the chevron
            }}
            disabled={{ after: today }} // ✅ disables all dates after today
            toMonth={today} // ✅ disables navigation to future months
          />
        </div>
      )}
    </div>
  );
}
