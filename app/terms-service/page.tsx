import { FileText } from "lucide-react";
import { LegalDocument } from "@/components/legal/LegalDocument";

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      filePath="app/terms-service/content/terms-of-service.md"
      icon={FileText}
      accentClass="text-purple-600"
    />
  );
}
