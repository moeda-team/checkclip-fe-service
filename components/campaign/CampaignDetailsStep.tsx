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
import type { CampaignObjectiveKey, CampaignFormData } from "@/types/campaign";

interface CampaignDetailsStepProps {
  selectedObjective: CampaignObjectiveKey;
  formData: CampaignFormData;
  onFormChange: (data: CampaignFormData) => void;
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
                  onChange={(e) => updateBrand("brandName", e.target.value)}
                  className="mt-1.5 h-10 border-gray-200 text-sm"
                />
              </div>

              {/* Industry Vertical & Competition Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Industry Vertical <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.brand.industryVertical}
                    onValueChange={(value) =>
                      updateBrand("industryVertical", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-10 border-gray-200 text-sm">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="animals_pets">
                        Animals & Pets
                      </SelectItem>
                      <SelectItem value="fashion_retail">
                        Apparel/Fashion & Jewelry
                      </SelectItem>
                      <SelectItem value="entertainment_media">
                        Arts & Entertainment
                      </SelectItem>
                      <SelectItem value="legal_services">
                        Attorneys & Legal Services
                      </SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="beauty_personal_care">
                        Beauty & Personal Care
                      </SelectItem>
                      <SelectItem value="b2b_services">
                        Business Services
                      </SelectItem>
                      <SelectItem value="employment_recruiting">
                        Career & Employment
                      </SelectItem>
                      <SelectItem value="education">
                        Education & Instruction
                      </SelectItem>
                      <SelectItem value="finance_fintech">
                        Finance & Insurance
                      </SelectItem>
                      <SelectItem value="food_beverage">
                        Food & Beverage
                      </SelectItem>
                      <SelectItem value="health_wellness">
                        Health & Wellness
                      </SelectItem>
                      <SelectItem value="home_living">Home & Living</SelectItem>
                      <SelectItem value="industrial_manufacturing">
                        Industrial & Manufacturing
                      </SelectItem>
                      <SelectItem value="personal_services">
                        Personal Services
                      </SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="shopping_gifts">
                        Shopping, Collectibles & Gifts
                      </SelectItem>
                      <SelectItem value="sports_recreation">
                        Sports & Recreation
                      </SelectItem>
                      <SelectItem value="tech_electronics">
                        Tech & Electronics
                      </SelectItem>
                      <SelectItem value="travel_hospitality">
                        Travel & Hospitality
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Competition Level
                  </Label>
                  <Select
                    value={formData.brand.competitionLevel}
                    onValueChange={(value) =>
                      updateBrand("competitionLevel", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-10 border-gray-200 text-sm">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Product Average Price, Rating, Total Reviews */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Product Average Price
                  </Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.brand.productAveragePrice}
                      onChange={(e) =>
                        updateBrand("productAveragePrice", e.target.value)
                      }
                      className="h-10 border-gray-200 text-sm pl-7 pr-3"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Product Average Rating
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="0.0"
                    value={formData.brand.productAverageRating}
                    onChange={(e) =>
                      updateBrand("productAverageRating", e.target.value)
                    }
                    className="mt-1.5 h-10 border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Total Reviews
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.brand.totalReviews}
                    onChange={(e) =>
                      updateBrand("totalReviews", e.target.value)
                    }
                    className="mt-1.5 h-10 border-gray-200 text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Input description"
                  value={formData.brand.description}
                  onChange={(e) => updateBrand("description", e.target.value)}
                  className="mt-1.5 min-h-20 border-gray-200 text-sm resize-none"
                />
              </div>
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
                    onValueChange={(value) => updateBudget("budgetType", value)}
                  >
                    <SelectTrigger className="mt-1.5 h-10 border-gray-200 text-sm">
                      <SelectValue placeholder="Select budget type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
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
                      type="number"
                      placeholder="Input Budget"
                      value={formData.budget.budget}
                      onChange={(e) => updateBudget("budget", e.target.value)}
                      className="h-10 border-gray-200 text-sm pl-7 pr-3"
                    />
                  </div>
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
                          "mt-1.5 w-full h-10 justify-start text-left font-normal border-gray-200 text-sm bg-white hover:bg-white",
                          !parsedStartDate && "text-gray-400"
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
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1.5">
                    <TimePicker
                      value={formData.budget.startTime}
                      onChange={(time) => updateBudget("startTime", time)}
                      date={parsedStartDate}
                      placeholder="Choose Time"
                    />
                  </div>
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
                            "mt-1.5 w-full h-10 justify-start text-left font-normal border-gray-200 text-sm bg-white hover:bg-white",
                            !parsedEndDate && "text-gray-400"
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
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Time */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1.5">
                      <TimePicker
                        value={formData.budget.endTime}
                        onChange={(time) => updateBudget("endTime", time)}
                        date={parsedEndDate}
                        placeholder="Choose Time"
                      />
                    </div>
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
                      onChange={(e) => handleLocationSearch(e.target.value)}
                      onFocus={() =>
                        locationQuery.length > 1 &&
                        setShowLocationSuggestions(true)
                      }
                      className="h-10 border-gray-200 text-sm pr-10"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

                    {/* Location Suggestions Dropdown */}
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
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.audience.age}
                    onValueChange={(value) => updateAudience("age", value)}
                  >
                    <SelectTrigger className="mt-1.5 h-10 border-gray-200 text-sm">
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
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Language <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.audience.language}
                    onValueChange={(value) => updateAudience("language", value)}
                  >
                    <SelectTrigger className="mt-1.5 h-10 border-gray-200 text-sm">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                      <SelectItem value="ms">Malay</SelectItem>
                      <SelectItem value="th">Thai</SelectItem>
                      <SelectItem value="vi">Vietnamese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                    </SelectContent>
                  </Select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Audience Size
                  </Label>
                  <Select
                    value={formData.audience.audienceSize}
                    onValueChange={(value) =>
                      updateAudience("audienceSize", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-10 border-gray-200 text-sm">
                      <SelectValue placeholder="Select Audience Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Audience Interest <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={interestOpen} onOpenChange={setInterestOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="mt-1.5 w-full h-10 justify-start text-left font-normal border-gray-200 text-sm bg-white hover:bg-white"
                      >
                        {formData.audience.audienceInterest.length > 0
                          ? formData.audience.audienceInterest
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
                              checked={formData.audience.audienceInterest.includes(
                                option.value
                              )}
                              onCheckedChange={(checked) => {
                                const current =
                                  formData.audience.audienceInterest;
                                const updated = checked
                                  ? [...current, option.value]
                                  : current.filter((v) => v !== option.value);
                                updateAudience("audienceInterest", updated);
                              }}
                              className="border-gray-300 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Add any interests related to your audience
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Detail Audience <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Type here"
                  value={formData.audience.detailAudience}
                  onChange={(e) =>
                    updateAudience("detailAudience", e.target.value)
                  }
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
              onClick={onCreate}
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-10 rounded-lg text-sm font-medium"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
