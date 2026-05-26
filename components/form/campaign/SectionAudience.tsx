"use client";

import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AudienceData } from "@/types/campaign";

type Props = {
  data: AudienceData;
  onChange: (data: AudienceData) => void;
};

const ageOptions = ["18-24", "25-34", "35-44", "45-54", "55+", "All ages"];

const languageOptions = [
  "English",
  "Indonesian",
  "Japanese",
  "Mandarin",
  "Spanish",
  "French"
];

const genderOptions: { value: AudienceData["gender"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" }
];

export function SectionAudience({ data, onChange }: Props) {
  const set = (patch: Partial<AudienceData>) => onChange({ ...data, ...patch });

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Audience</h2>
          <p className="text-xs text-gray-500">
            Define your target audience for this campaign.
          </p>
        </div>
      </div>

      {/* Location + Age + Language */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label
            htmlFor="location"
            className="text-sm font-medium text-gray-700 mb-1.5 block"
          >
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            placeholder="Input Location"
            value={data.location}
            onChange={(e) => set({ location: e.target.value })}
            className="h-10 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Age <span className="text-red-500">*</span>
          </Label>
          <Select value={data.age} onValueChange={(v) => set({ age: v })}>
            <SelectTrigger className="h-10 border-gray-200 text-sm">
              <SelectValue placeholder="Input Age" />
            </SelectTrigger>
            <SelectContent>
              {ageOptions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Language <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.language}
            onValueChange={(v) => set({ language: v })}
          >
            <SelectTrigger className="h-10 border-gray-200 text-sm">
              <SelectValue placeholder="Input Language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gender */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Gender <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-4">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set({ gender: opt.value })}
              className="flex items-center gap-1.5 text-sm text-gray-700"
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                  data.gender === opt.value
                    ? "border-primary-600"
                    : "border-gray-300"
                )}
              >
                {data.gender === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-primary-600" />
                )}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interest */}
      <div>
        <Label
          htmlFor="interest"
          className="text-sm font-medium text-gray-700 mb-1.5 block"
        >
          Interest and Detail Audience <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="interest"
          placeholder="Type here"
          value={data.interest}
          onChange={(e) => set({ interest: e.target.value })}
          rows={3}
          className="border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Add any interests, detailed demographics, or life events related to
          your customers
        </p>
      </div>
    </section>
  );
}
