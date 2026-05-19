"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 w-full", className)}>
        <DayPicker
          showOutsideDays={showOutsideDays}
          classNames={{
            months: "flex flex-col",
            month: "flex flex-col gap-4",

            month_caption: "flex justify-center items-center relative h-9 mb-1",
            caption_label: "text-sm font-semibold text-gray-900",

            nav: "absolute inset-x-0 top-0 flex justify-between items-center h-9 px-1",
            button_previous:
              "h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors",
            button_next:
              "h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors",

            month_grid: "w-full border-collapse",
            weekdays: "grid grid-cols-7 mb-1",
            weekday:
              "text-center text-xs font-medium text-gray-400 py-2 w-full",

            weeks: "flex flex-col gap-1",
            week: "grid grid-cols-7",

            day: "flex items-center justify-center p-0 h-10",
            day_button:
              "h-9 w-9 text-sm font-normal text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center",

            selected:
              "!bg-gray-900 !text-white rounded-lg font-medium hover:!bg-gray-800",
            today: "font-semibold text-gray-900",
            outside: "text-gray-300",
            disabled: "text-gray-200 cursor-not-allowed",
            range_middle: "bg-gray-100 rounded-none",
            range_start: "bg-gray-900 text-white rounded-lg",
            range_end: "bg-gray-900 text-white rounded-lg",
            hidden: "invisible",
            ...classNames
          }}
          formatters={{
            formatWeekdayName: (date) =>
              ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()]
          }}
          {...props}
        />
      </div>
    );
  }
);

Calendar.displayName = "Calendar";
export { Calendar };
