// components/campaign/CampaignReviewStep.tsx
// Step 3: Review all campaign inputs before submission

"use client";

import { objectives } from "@/components/card/CampaignObjective";
import { CampaignAlertModal } from "@/components/modal/CampaignAlertModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CampaignFormData, CampaignObjectiveKey } from "@/types/campaign";
import {
  DollarSign,
  LocateFixed,
  PackageOpen,
  Pencil,
  Settings,
  Sparkles,
  UsersRound
} from "lucide-react";

interface CampaignReviewStepProps {
  campaignName: string;
  selectedObjective: CampaignObjectiveKey;
  selectedSubtype: string;
  selectedConversionGoals: string[];
  formData: CampaignFormData;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  modalOpen: boolean;
  modalVariant: "confirm" | "success" | "failed";
  errorMessage?: string;
  onModalClose: () => void;
  entityName?: string;
}

const formatCurrency = (value: string) => {
  if (!value) return "-";
  const num = parseInt(value, 10);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "-";
  try {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
};

export function CampaignReviewStep({
  campaignName,
  selectedObjective,
  selectedSubtype,
  selectedConversionGoals,
  formData,
  onBack,
  onConfirm,
  isSubmitting,
  modalOpen,
  modalVariant,
  errorMessage,
  onModalClose,
  entityName = "campaign"
}: CampaignReviewStepProps) {
  const objective = objectives.find((o) => o.key === selectedObjective);

  const ReviewSection = ({
    icon: Icon,
    iconColor,
    title,
    children
  }: {
    icon: React.ElementType;
    iconColor?: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor || "bg-primary-50"}`}
        >
          <Icon
            className={`w-4 h-4 ${iconColor ? "text-white" : "text-primary-600"}`}
          />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  const ReviewRow = ({
    label,
    value,
    multiline = false
  }: {
    label: string;
    value: React.ReactNode;
    multiline?: boolean;
  }) => (
    <div
      className={`flex ${multiline ? "flex-col gap-1.5 items-end" : "flex-row items-center justify-between"} py-3 border-b border-gray-100 last:border-0 last:pb-0 first:pt-0`}
    >
      <span className={`text-sm text-gray-600 ${multiline ? "w-full" : ""}`}>
        {label}
      </span>
      <span
        className={`text-sm font-medium text-gray-900 ${multiline ? "text-right" : "text-right"}`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
            Review and Confirm
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Configure the basic settings for your new marketing campaign.
        </p>
      </div>

      {/* Alert Banner */}
      <div className="px-6 py-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <p className="text-sm text-blue-700">
            Review your inputs before generating your strategy and moving
            forward with campaign planning.
          </p>
        </div>
      </div>

      {/* Review Content */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {/* Campaign Setup */}
        <ReviewSection icon={Settings} title="Campaign Setup">
          <ReviewRow label="Campaign Name" value={campaignName || "-"} />
        </ReviewSection>

        {/* Campaign Objective */}
        <ReviewSection icon={LocateFixed} title="Campaign Objective">
          <ReviewRow
            label="Campaign Objective"
            value={
              <div>
                <span className="font-medium">
                  {objective?.label || selectedObjective}
                </span>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  {objective?.description}
                </p>
              </div>
            }
            multiline
          />
          {selectedSubtype && (
            <ReviewRow label="Campaign Subtype" value={selectedSubtype} />
          )}
          {selectedConversionGoals.length > 0 && (
            <ReviewRow
              label="Conversion Goals"
              value={
                <div className="flex flex-wrap gap-1 justify-end">
                  {selectedConversionGoals.map((goal) => (
                    <Badge key={goal} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              }
            />
          )}
        </ReviewSection>

        {/* Brand / Product */}
        <ReviewSection icon={PackageOpen} title="Brand / Product">
          <ReviewRow
            label="Brand Name / Brand Type"
            value={formData.brand.brandName || "-"}
          />
          <ReviewRow
            label="Description"
            value={formData.brand.description || "-"}
            multiline
          />
        </ReviewSection>

        {/* Budget & Schedule */}
        <ReviewSection icon={DollarSign} title="Budget & Schedule">
          <ReviewRow
            label="Budget Type"
            value={
              formData.budget.budgetType
                ? formData.budget.budgetType.charAt(0).toUpperCase() +
                  formData.budget.budgetType.slice(1)
                : "-"
            }
          />
          <ReviewRow
            label="Budget"
            value={formatCurrency(formData.budget.budget)}
          />
          <ReviewRow
            label="Start Date"
            value={formatDate(formData.budget.startDate)}
          />
          <ReviewRow
            label="Start Time"
            value={formatTime(formData.budget.startTime)}
          />
          <ReviewRow
            label="End Date"
            value={
              formData.budget.hasEndDate
                ? formatDate(formData.budget.endDate)
                : "No end date"
            }
          />
          <ReviewRow
            label="End Time"
            value={
              formData.budget.hasEndDate
                ? formatTime(formData.budget.endTime)
                : "No end time"
            }
          />
        </ReviewSection>

        {/* Audience */}
        <ReviewSection icon={UsersRound} title="Audience">
          <ReviewRow
            label="Location"
            value={formData.audience.location || "-"}
          />
          <ReviewRow label="Age" value={formData.audience.age || "-"} />
          <ReviewRow
            label="Gender"
            value={
              formData.audience.gender
                ? formData.audience.gender.charAt(0).toUpperCase() +
                  formData.audience.gender.slice(1)
                : "-"
            }
          />
          <ReviewRow
            label="Language"
            value={formData.audience.language || "-"}
          />
          <ReviewRow
            label="Interest and Detail Audience"
            value={formData.audience.interest || "-"}
            multiline
          />
        </ReviewSection>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ready to create your strategy?
              </p>
              <p className="text-xs text-gray-500">
                Once confirmed, your strategy will be created and you can start
                planning your campaign.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-6 h-10 rounded-lg text-sm font-medium border-gray-200"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 h-10 rounded-lg text-sm font-medium"
            >
              {isSubmitting ? "Creating..." : "Confirm & Create Strategy"}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CampaignAlertModal
        variant="success"
        open={modalOpen && modalVariant === "success"}
        onClose={onModalClose}
        entityName={entityName}
      />
      <CampaignAlertModal
        variant="failed"
        open={modalOpen && modalVariant === "failed"}
        errorMessage={errorMessage}
        onClose={onModalClose}
        entityName={entityName}
      />
    </div>
  );
}
