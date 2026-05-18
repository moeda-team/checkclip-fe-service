"use client";

import { DollarSign, Calendar, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BudgetScheduleData } from "@/types/campaign";

type Props = {
  data: BudgetScheduleData;
  onChange: (data: BudgetScheduleData) => void;
};

const budgetTypes = ["Daily", "Weekly", "Monthly", "Lifetime"];
const daysOptions = ["14 days", "30 days", "60 days"];

// Format number with thousand separators: "20000" → "20,000"
function formatBudget(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

// Strip formatting back to raw digits for storage
function parseBudget(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

export function SectionBudgetSchedule({ data, onChange }: Props) {
  const set = (patch: Partial<BudgetScheduleData>) => onChange({ ...data, ...patch });

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
          <DollarSign className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Budget / Schedule</h2>
          <p className="text-xs text-gray-500">
            Configure how much you want to spend and when your campaign will run.
          </p>
        </div>
      </div>

      {/* Budget Type + Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Budget Type <span className="text-red-500">*</span>
          </Label>
          <Select value={data.budgetType} onValueChange={(v) => set({ budgetType: v })}>
            <SelectTrigger className="h-10 border-gray-200 text-sm">
              <SelectValue placeholder="Select budget type" />
            </SelectTrigger>
            <SelectContent>
              {budgetTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="budget" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Budget <span className="text-red-500">*</span>
          </Label>
          {/* Dollar prefix + formatted input */}
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm text-gray-500 select-none pointer-events-none">
              $
            </span>
            <input
              id="budget"
              inputMode="numeric"
              placeholder="0"
              value={formatBudget(data.budget)}
              onChange={(e) => set({ budget: parseBudget(e.target.value) })}
              className="w-full h-10 pl-7 pr-3 rounded-md border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Start Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <input
              id="start-date"
              type="date"
              value={data.startDate}
              onChange={(e) => set({ startDate: e.target.value })}
              className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <Calendar className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <Label htmlFor="start-time" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Time <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <input
              id="start-time"
              type="time"
              value={data.startTime}
              onChange={(e) => set({ startTime: e.target.value })}
              className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <Clock className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* End Date toggle */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="has-end-date"
            checked={data.hasEndDate}
            onCheckedChange={(checked) =>
              set({ hasEndDate: checked === true, endDate: checked ? data.endDate : "" })
            }
            className="rounded data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
          />
          <Label htmlFor="has-end-date" className="text-sm text-gray-700 cursor-pointer font-normal">
            End Date
          </Label>
        </div>

        {/* End Date expanded fields */}
        {data.hasEndDate && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Days */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Days (14, 30, 60 days) <span className="text-red-500">*</span>
              </Label>
              <Select value={data.endDays ?? ""} onValueChange={(v) => set({ endDays: v })}>
                <SelectTrigger className="h-10 border-gray-200 text-sm">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  {daysOptions.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="end-date" className="text-sm font-medium text-gray-700 mb-1.5 block">
                End Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative flex items-center">
                <input
                  id="end-date"
                  type="date"
                  value={data.endDate}
                  onChange={(e) => set({ endDate: e.target.value })}
                  className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* End Time */}
            <div>
              <Label htmlFor="end-time" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative flex items-center">
                <input
                  id="end-time"
                  type="time"
                  value={data.endTime ?? ""}
                  onChange={(e) => set({ endTime: e.target.value })}
                  className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Clock className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
