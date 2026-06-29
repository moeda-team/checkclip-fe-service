import { Shield } from "lucide-react";
import { LegalDocument } from "@/components/legal/LegalDocument";

export default async function PrivacyPolicyPage() {
  return (
    <LegalDocument
      filePath="app/privacy-policy/content/privacy-policy.md"
      icon={Shield}
      accentClass="text-purple-600"
    />
  );
}
