"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import {
  privacyPolicySections,
  privacyPolicyEffectiveDate,
  type PolicyBlock
} from "./content/privacy-policy-data";

function renderBlock(block: PolicyBlock, index: number) {
  switch (block.type) {
    case "subheading":
      return (
        <h3
          key={index}
          className="mt-4 mb-2 text-sm font-semibold text-gray-900"
        >
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p key={index} className="mb-3 text-sm leading-6 text-gray-600">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul
          key={index}
          className="mb-3 ml-5 list-disc space-y-1 text-sm leading-6 text-gray-600 marker:text-purple-500"
        >
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "ordered-list":
      return (
        <ol
          key={index}
          className="mb-3 ml-5 list-decimal space-y-1 text-sm leading-6 text-gray-600 marker:text-purple-500"
        >
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "contact":
      return (
        <div
          key={index}
          className="mb-3 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm leading-6 text-gray-700"
        >
          {block.lines.map((line, i) => (
            <p key={i} className={i === 0 ? "font-semibold" : undefined}>
              {line}
            </p>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <header className="mb-8 border-b border-gray-200 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-purple-600 sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-3 text-lg text-gray-500">
                AIMOS &ndash; Platform Digital Marketing
              </p>
              <p className="mt-2 text-sm font-semibold text-purple-600">
                {privacyPolicyEffectiveDate}
              </p>
            </div>
            <Shield className="h-12 w-12 shrink-0 text-purple-600" />
          </div>
        </header>

        <Accordion
          type="single"
          collapsible
          defaultValue="introduction"
          className="space-y-4"
        >
          {privacyPolicySections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="rounded-2xl border border-gray-200 bg-white px-6 shadow-sm"
            >
              <AccordionTrigger className="py-5 text-lg font-bold text-gray-900 hover:no-underline">
                {section.number}. {section.title}
              </AccordionTrigger>
              <AccordionContent>
                {section.blocks.map((block, i) => renderBlock(block, i))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
