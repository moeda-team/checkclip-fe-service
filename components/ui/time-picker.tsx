"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { format, parse } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  date?: Date;
  placeholder?: string;
  className?: string;
}

// Generate time options from 00:00 to 23:30 in 30-min intervals
const generateTimeOptions = () => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      options.push(time);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export function TimePicker({
  value,
  onChange,
  date,
  placeholder = "Choose Time",
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedTime = value
    ? parse(value, "HH:mm", new Date())
    : undefined;

  const handleSelect = (time: string) => {
    onChange?.(time);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-10 justify-start text-left font-normal border-gray-200 text-sm bg-white hover:bg-white",
            !value && "text-gray-400",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-gray-400" />
          {value ? format(selectedTime || new Date(), "HH:mm") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="start">
        <div className="p-3 border-b border-gray-100">
          <p className="text-sm font-medium text-center text-gray-900">
            {date ? format(date, "EEEE, d") : "Select time"}
          </p>
        </div>
        <ScrollArea className="h-60">
          <div className="p-2">
            {timeOptions.map((time) => (
              <button
                key={time}
                onClick={() => handleSelect(time)}
                className={cn(
                  "w-full text-center py-2 px-3 text-sm rounded-lg transition-colors",
                  value === time
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {time.replace(":", " : ")}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
