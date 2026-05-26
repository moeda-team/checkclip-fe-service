// components/campaign/CampaignDetailsStep.tsx
// Step 2: Campaign details form with submission footer

"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Package,
  DollarSign,
  Users,
  CalendarIcon,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  CampaignObjectiveKey,
  BriefFormData
} from "@/types/campaign-brief";

interface CampaignDetailsStepProps {
  selectedObjective: CampaignObjectiveKey;
  formData: BriefFormData;
  onFormChange: (data: BriefFormData) => void;
  onBack: () => void;
  onCreate: () => void;
  isSubmitting: boolean;
}

export function CampaignDetailsStep({
  selectedObjective,
  formData,
  onFormChange,
  onBack,
  onCreate,
  isSubmitting
}: CampaignDetailsStepProps) {
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [locationTimeout, setLocationTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // ─── Validation errors ────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Brand
    if (!formData.brand.brandName.trim())
      newErrors.brandName = "Brand name is required";

    // Budget
    if (!formData.budget.budgetType)
      newErrors.budgetType = "Budget type is required";
    if (!formData.budget.budget || Number(formData.budget.budget) <= 0)
      newErrors.budget = "Budget amount is required";
    if (!formData.budget.startDate)
      newErrors.startDate = "Start date is required";
    if (!formData.budget.startTime)
      newErrors.startTime = "Start time is required";
    if (formData.budget.hasEndDate) {
      if (!formData.budget.endDate) newErrors.endDate = "End date is required";
      if (!formData.budget.endTime) newErrors.endTime = "End time is required";
    }

    // Audience
    if (!formData.audience.location.trim())
      newErrors.location = "Location is required";
    if (!formData.audience.age) newErrors.age = "Age is required";
    if (!formData.audience.language)
      newErrors.language = "Language is required";
    if (!formData.audience.gender) newErrors.gender = "Gender is required";
    if (!formData.audience.interest || formData.audience.interest.length === 0)
      newErrors.interest = "At least one interest is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onCreate();
  };

  const audienceInterestOptions = [
    { value: "lifestyle-hobbies", label: "Lifestyle and Hobbies" },
    { value: "clothes", label: "Clothes" },
    { value: "sportswear", label: "Sportswear" },
    { value: "fashion", label: "Fashion" },
    { value: "shoes", label: "Shoes" },
    { value: "eyewear-accessories", label: "Eyewear Accessories" },
    { value: "pants-trousers", label: "Pants & Trousers" }
  ];

  const fetchPlacePredictions = async (value: string) => {
    try {
      const res = await fetch(`/api/places?input=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.predictions) {
        setLocationSuggestions(data.predictions.map((p: any) => p.description));
        setShowLocationSuggestions(true);
      } else {
        setLocationSuggestions([]);
      }
    } catch {
      setLocationSuggestions([value]);
      setShowLocationSuggestions(true);
    }
  };

  const handleLocationSearch = (value: string) => {
    setLocationQuery(value);
    updateAudience("location", value);

    if (locationTimeout) {
      clearTimeout(locationTimeout);
    }

    if (value.length > 2) {
      const timeout = setTimeout(() => {
        fetchPlacePredictions(value);
      }, 300);
      setLocationTimeout(timeout);
    } else if (value.length > 0) {
      setLocationSuggestions([value]);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (loc: string) => {
    setLocationQuery(loc);
    updateAudience("location", loc);
    setShowLocationSuggestions(false);
  };

  const updateBrand = (field: keyof typeof formData.brand, value: string) => {
    onFormChange({
      ...formData,
      brand: { ...formData.brand, [field]: value }
    });
  };

  const updateBudget = (
    field: keyof typeof formData.budget,
    value: string | boolean
  ) => {
    onFormChange({
      ...formData,
      budget: { ...formData.budget, [field]: value }
    });
  };

  const updateAudience = (
    field: keyof typeof formData.audience,
    value: string | string[]
  ) => {
    onFormChange({
      ...formData,
      audience: { ...formData.audience, [field]: value }
    });
  };

  const parsedStartDate = formData.budget.startDate
    ? new Date(formData.budget.startDate)
    : undefined;
  const parsedEndDate = formData.budget.endDate
    ? new Date(formData.budget.endDate)
    : undefined;

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    return new Intl.NumberFormat("en-US").format(Number(numericValue));
  };

  const handleBudgetChange = (value: string) => {
    const rawValue = value.replace(/\D/g, "");

    updateBudget("budget", rawValue);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        {/* Single Card Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
          {/* Brand / Product Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Brand / Product
                </h3>
                <p className="text-xs text-gray-500">
                  Identify the brand or product this campaign will promote.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Brand Name */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Brand Name / Brand Type{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Input brand name / brand type"
                  value={formData.brand.brandName}
                  onChange={(e) => {
                    updateBrand("brandName", e.target.value);
                    if (errors.brandName)
                      setErrors((p) => ({ ...p, brandName: "" }));
                  }}
                  className={`mt-1.5 h-10 text-sm ${errors.brandName ? "border-red-400 focus-visible:ring-red-400" : "border-gray-200"}`}
                />
                {errors.brandName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.brandName}
                  </p>
                )}
              </div>

              {/* Description */}
              {/* <div>
                <Label className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Input description"
                  value={formData.brand.description}
                  onChange={(e) => updateBrand("description", e.target.value)}
                  className="mt-1.5 min-h-20 border-gray-200 text-sm resize-none"
                />
              </div> */}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Budget / Schedule Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Budget / Schedule
                </h3>
                <p className="text-xs text-gray-500">
                  Configure how much you want to spend and when your campaign
                  will run.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Budget Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.budget.budgetType}
                    onValueChange={(value) => {
                      updateBudget("budgetType", value);
                      if (errors.budgetType)
                        setErrors((p) => ({ ...p, budgetType: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={`mt-1.5 h-10 text-sm ${errors.budgetType ? "border-red-400" : "border-gray-200"}`}
                    >
                      <SelectValue placeholder="Select budget type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.budgetType && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.budgetType}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Budget <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      $
                    </span>
                    <Input
                      type="text"
                      placeholder="Input Budget"
                      value={formatNumber(
                        formData.budget.budget?.toString() || ""
                      )}
                      onChange={(e) => {
                        handleBudgetChange(e.target.value);
                        if (errors.budget)
                          setErrors((p) => ({ ...p, budget: "" }));
                      }}
                      className={`h-10 text-sm pl-7 pr-3 ${errors.budget ? "border-red-400 focus-visible:ring-red-400" : "border-gray-200"}`}
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-xs text-red-500 mt-1">{errors.budget}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date with Calendar Popover */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "mt-1.5 w-full h-10 justify-start text-left font-normal text-sm bg-white hover:bg-white",
                          !parsedStartDate && "text-gray-400",
                          errors.startDate
                            ? "border-red-400"
                            : "border-gray-200"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                        {parsedStartDate
                          ? format(parsedStartDate, "PPP")
                          : "Choose Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parsedStartDate}
                        onSelect={(date) => {
                          if (date) {
                            updateBudget(
                              "startDate",
                              format(date, "yyyy-MM-dd")
                            );
                            setStartDateOpen(false);
                            if (errors.startDate)
                              setErrors((p) => ({ ...p, startDate: "" }));
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1.5">
                    <TimePicker
                      value={formData.budget.startTime}
                      onChange={(time) => {
                        updateBudget("startTime", time);
                        if (errors.startTime)
                          setErrors((p) => ({ ...p, startTime: "" }));
                      }}
                      date={parsedStartDate}
                      placeholder="Choose Time"
                    />
                  </div>
                  {errors.startTime && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.startTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasEndDate"
                  checked={formData.budget.hasEndDate}
                  onCheckedChange={(checked) =>
                    updateBudget("hasEndDate", !!checked)
                  }
                  className="border-gray-300 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                />
                <Label
                  htmlFor="hasEndDate"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  End Date
                </Label>
              </div>

              {formData.budget.hasEndDate && (
                <div className="grid grid-cols-3 gap-4">
                  {/* Days */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Days (14, 30, 60 days){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.budget.endDays}
                      onValueChange={(value) => updateBudget("endDays", value)}
                    >
                      <SelectTrigger className="mt-1.5 h-10 border-gray-200 text-sm">
                        <SelectValue placeholder="Choose Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* End Date with Calendar Popover */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      End Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "mt-1.5 w-full h-10 justify-start text-left font-normal text-sm bg-white hover:bg-white",
                            !parsedEndDate && "text-gray-400",
                            errors.endDate
                              ? "border-red-400"
                              : "border-gray-200"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {parsedEndDate
                            ? format(parsedEndDate, "PPP")
                            : "Choose Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={parsedEndDate}
                          onSelect={(date) => {
                            if (date) {
                              updateBudget(
                                "endDate",
                                format(date, "yyyy-MM-dd")
                              );
                              setEndDateOpen(false);
                              if (errors.endDate)
                                setErrors((p) => ({ ...p, endDate: "" }));
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.endDate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.endDate}
                      </p>
                    )}
                  </div>

                  {/* End Time */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1.5">
                      <TimePicker
                        value={formData.budget.endTime}
                        onChange={(time) => {
                          updateBudget("endTime", time);
                          if (errors.endTime)
                            setErrors((p) => ({ ...p, endTime: "" }));
                        }}
                        date={parsedEndDate}
                        placeholder="Choose Time"
                      />
                    </div>
                    {errors.endTime && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Audience Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Audience
                </h3>
                <p className="text-xs text-gray-500">
                  Define your target audience for this campaign.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Location with Search */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      placeholder="Select Location"
                      value={locationQuery}
                      onChange={(e) => {
                        handleLocationSearch(e.target.value);
                        if (errors.location)
                          setErrors((p) => ({ ...p, location: "" }));
                      }}
                      onFocus={() =>
                        locationQuery.length > 1 &&
                        setShowLocationSuggestions(true)
                      }
                      className={`h-10 text-sm pr-10 ${errors.location ? "border-red-400 focus-visible:ring-red-400" : "border-gray-200"}`}
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    {showLocationSuggestions &&
                      locationSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {locationSuggestions.map((loc, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => selectLocation(loc)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.audience.age}
                    onValueChange={(value) => {
                      updateAudience("age", value);
                      if (errors.age) setErrors((p) => ({ ...p, age: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={`mt-1.5 h-10 text-sm ${errors.age ? "border-red-400" : "border-gray-200"}`}
                    >
                      <SelectValue placeholder="Select Age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55-64">55-64</SelectItem>
                      <SelectItem value="65+">65+</SelectItem>
                      <SelectItem value="all">All ages</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.age && (
                    <p className="text-xs text-red-500 mt-1">{errors.age}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Language <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.audience.language}
                    onValueChange={(value) => {
                      updateAudience("language", value);
                      if (errors.language)
                        setErrors((p) => ({ ...p, language: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={`mt-1.5 h-10 text-sm ${errors.language ? "border-red-400" : "border-gray-200"}`}
                    >
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="indonesia">Indonesian</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.language && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.language}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.audience.gender}
                  onValueChange={(value) => updateAudience("gender", value)}
                  className="flex items-center gap-4 mt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="all" id="gender-all" />
                    <Label
                      htmlFor="gender-all"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      All
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="men" id="gender-men" />
                    <Label
                      htmlFor="gender-men"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Men
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="women" id="gender-women" />
                    <Label
                      htmlFor="gender-women"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Women
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Audience Size & Audience Interest */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Audience Interest <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={interestOpen} onOpenChange={setInterestOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`mt-1.5 w-full h-10 justify-start text-left font-normal text-sm bg-white hover:bg-white ${errors.interest ? "border-red-400" : "border-gray-200"}`}
                      >
                        {formData.audience.interest?.length > 0
                          ? formData.audience.interest
                              .map(
                                (v) =>
                                  audienceInterestOptions.find(
                                    (o) => o.value === v
                                  )?.label ?? v
                              )
                              .join(", ")
                          : "Select Interest"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-2 space-y-1">
                        {audienceInterestOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
                          >
                            <Checkbox
                              checked={formData.audience.interest.includes(
                                option.value
                              )}
                              onCheckedChange={(checked) => {
                                const current = formData.audience.interest;
                                const updated = checked
                                  ? [...current, option.value]
                                  : current.filter((v) => v !== option.value);
                                updateAudience("interest", updated);
                                if (errors.interest)
                                  setErrors((p) => ({ ...p, interest: "" }));
                              }}
                              className="border-gray-300 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.interest ? (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.interest}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1.5">
                      Add any interests related to your audience
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Detail Audience <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Type here"
                  value={formData.audience.detail}
                  onChange={(e) => updateAudience("detail", e.target.value)}
                  className="mt-1.5 min-h-20 border-gray-200 text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Add any detailed demographics, or life events related to your
                  audience
                </p>
              </div>
            </div>
          </div>
          {/* Footer Buttons */}
          <div className=" bg-white px-6 py-4 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-8 h-10 rounded-lg text-sm font-medium border-gray-200"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-10 rounded-lg text-sm font-medium"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
