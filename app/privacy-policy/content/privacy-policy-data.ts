export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "contact"; lines: string[] };

export interface PolicySection {
  id: string;
  number: number;
  title: string;
  blocks: PolicyBlock[];
}

export const privacyPolicyEffectiveDate = "Last Updated: June 2026";

export const privacyPolicySections: PolicySection[] = [
  {
    id: "introduction",
    number: 1,
    title: "Introduction",
    blocks: [
      {
        type: "paragraph",
        text: "Welcome to AIMOS – Platform Digital Marketing (\u201cAIMOS\u201d, \u201cwe\u201d, \u201cour\u201d, or \u201cus\u201d).",
      },
      {
        type: "paragraph",
        text: "AIMOS is a digital marketing platform designed to help businesses, marketers, agencies, and organizations manage marketing assets, products, campaigns, audience data, and AI-powered marketing strategies.",
      },
      {
        type: "paragraph",
        text: "We are committed to protecting your privacy and ensuring that all personal, organizational, and marketing-related information is processed securely and responsibly.",
      },
      {
        type: "paragraph",
        text: "By accessing or using AIMOS, you agree to the collection, use, and disclosure of information as described in this Privacy Policy.",
      },
    ],
  },
  {
    id: "information-we-collect",
    number: 2,
    title: "Information We Collect",
    blocks: [
      { type: "subheading", text: "2.1 Account Information" },
      {
        type: "paragraph",
        text: "When creating or managing an AIMOS account, we may collect:",
      },
      {
        type: "list",
        items: [
          "Full name",
          "Email address",
          "Company or organization name",
          "Job title",
          "Profile photo (optional)",
          "Phone number (optional)",
          "Authentication credentials",
        ],
      },
      { type: "subheading", text: "2.2 Organization & Business Information" },
      {
        type: "paragraph",
        text: "Users may provide business-related information, including but not limited to:",
      },
      {
        type: "list",
        items: [
          "Company profiles",
          "Brand information",
          "Product information",
          "Service information",
          "Marketing assets",
          "Campaign information",
          "Marketing objectives",
          "Audience personas",
          "Competitor information",
          "Promotional content",
          "Landing page content",
          "Media files and documents",
        ],
      },
      { type: "subheading", text: "2.3 AI Input & Generated Content" },
      {
        type: "paragraph",
        text: "To provide AI-powered features, AIMOS may process:",
      },
      {
        type: "list",
        items: [
          "Marketing prompts",
          "Campaign briefs",
          "Product descriptions",
          "Audience targeting information",
          "Marketing objectives",
          "Competitor analysis",
          "Content generation requests",
          "AI-generated recommendations and outputs",
        ],
      },
      { type: "subheading", text: "2.4 Usage and Technical Information" },
      { type: "paragraph", text: "We may automatically collect:" },
      {
        type: "list",
        items: [
          "Device information",
          "Browser information",
          "Operating system",
          "IP address",
          "Session information",
          "Log data",
          "Error reports",
          "Platform activity records",
          "Feature usage analytics",
        ],
      },
    ],
  },
  {
    id: "how-we-use-information",
    number: 3,
    title: "How We Use Information",
    blocks: [
      { type: "paragraph", text: "AIMOS uses collected information to:" },
      {
        type: "list",
        items: [
          "Provide and maintain platform services",
          "Generate AI-powered marketing strategies",
          "Create content recommendations and campaign plans",
          "Improve user experience",
          "Deliver customer support",
          "Analyze platform performance",
          "Prevent fraud, abuse, and unauthorized access",
          "Enhance platform security",
          "Develop and improve platform features",
          "Fulfill legal and contractual obligations",
        ],
      },
    ],
  },
  {
    id: "ai-powered-features",
    number: 4,
    title: "AI-Powered Features",
    blocks: [
      {
        type: "paragraph",
        text: "AIMOS provides AI-powered capabilities that may assist users in:",
      },
      {
        type: "list",
        items: [
          "Marketing strategy generation",
          "Campaign planning",
          "Content ideation",
          "Advertising recommendations",
          "Audience analysis",
          "SEO recommendations",
          "Marketing performance insights",
          "Marketing automation workflows",
        ],
      },
      {
        type: "paragraph",
        text: "User-provided information may be processed through AI systems solely for delivering requested services and improving platform functionality.",
      },
      {
        type: "paragraph",
        text: "AI-generated outputs are intended as recommendations only. Users remain responsible for reviewing, validating, and approving any generated content, strategy, or business decision before implementation.",
      },
    ],
  },
  {
    id: "data-ownership",
    number: 5,
    title: "Data Ownership",
    blocks: [
      {
        type: "paragraph",
        text: "All data uploaded, created, or managed within AIMOS remains the property of the respective user or organization. This includes:",
      },
      {
        type: "list",
        items: [
          "Products",
          "Campaigns",
          "Marketing assets",
          "Business information",
          "Documents",
          "Generated content",
          "Brand materials",
        ],
      },
      {
        type: "paragraph",
        text: "AIMOS does not claim ownership of user content. Users are responsible for ensuring they have the appropriate rights and permissions to upload and manage content within the platform.",
      },
    ],
  },
  {
    id: "third-party-integrations",
    number: 6,
    title: "Third-Party Integrations",
    blocks: [
      {
        type: "paragraph",
        text: "AIMOS may integrate with third-party platforms and services, including:",
      },
      {
        type: "list",
        items: [
          "Google Ads",
          "Google Analytics",
          "Google Search Console",
          "Meta Ads",
          "Instagram",
          "Facebook",
          "LinkedIn",
          "TikTok Ads",
          "YouTube",
          "CRM platforms",
          "Marketing automation platforms",
          "Analytics and reporting tools",
        ],
      },
      {
        type: "paragraph",
        text: "Information exchanged with third-party services is subject to the respective provider\u2019s privacy policies and terms of service.",
      },
    ],
  },
  {
    id: "data-sharing-and-disclosure",
    number: 7,
    title: "Data Sharing and Disclosure",
    blocks: [
      {
        type: "paragraph",
        text: "AIMOS does not sell personal data or customer information. Information may only be shared under the following circumstances:",
      },
      { type: "subheading", text: "Service Providers" },
      {
        type: "paragraph",
        text: "With trusted vendors and service providers supporting:",
      },
      {
        type: "list",
        items: [
          "Cloud infrastructure",
          "Authentication services",
          "Data storage",
          "Analytics services",
          "Payment processing",
          "AI processing services",
        ],
      },
      { type: "subheading", text: "Legal Compliance" },
      {
        type: "paragraph",
        text: "When required by applicable laws, regulations, legal processes, or governmental requests.",
      },
      { type: "subheading", text: "Business Transactions" },
      {
        type: "paragraph",
        text: "In connection with mergers, acquisitions, investments, restructurings, or asset transfers.",
      },
    ],
  },
  {
    id: "data-security",
    number: 8,
    title: "Data Security",
    blocks: [
      {
        type: "paragraph",
        text: "AIMOS implements reasonable technical and organizational measures to protect information, including:",
      },
      {
        type: "ordered-list",
        items: [
          "Secure authentication",
          "HTTPS/TLS encryption",
          "Access control mechanisms",
          "Role-based permissions",
          "Infrastructure monitoring",
          "Backup and disaster recovery procedures",
          "Security auditing and logging",
        ],
      },
      {
        type: "paragraph",
        text: "While we strive to maintain industry-standard security practices, no electronic storage or transmission method can be guaranteed to be completely secure.",
      },
    ],
  },
  {
    id: "data-retention",
    number: 9,
    title: "Data Retention",
    blocks: [
      {
        type: "paragraph",
        text: "We retain information only for as long as necessary to:",
      },
      {
        type: "ordered-list",
        items: [
          "Provide platform services",
          "Maintain account functionality",
          "Fulfill legal obligations",
          "Resolve disputes",
          "Enforce agreements",
        ],
      },
    ],
  },
  {
    id: "user-rights",
    number: 10,
    title: "User Rights",
    blocks: [
      {
        type: "paragraph",
        text: "Depending on applicable laws and regulations, users may have the right to:",
      },
      {
        type: "ordered-list",
        items: [
          "Access personal information",
          "Update inaccurate information",
          "Request deletion of data",
          "Export platform data",
          "Restrict certain processing activities",
          "Withdraw consent where applicable",
        ],
      },
      {
        type: "paragraph",
        text: "Users may request deletion of their account and associated information, subject to legal and operational requirements.",
      },
      {
        type: "paragraph",
        text: "Requests may be submitted through the contact information listed below.",
      },
    ],
  },
  {
    id: "cookies",
    number: 11,
    title: "Cookies and Similar Technologies",
    blocks: [
      {
        type: "paragraph",
        text: "AIMOS may use cookies and related technologies to:",
      },
      {
        type: "ordered-list",
        items: [
          "Maintain secure sessions",
          "Store preferences",
          "Improve performance",
          "Analyze platform usage",
          "Enhance security and reliability",
        ],
      },
      {
        type: "paragraph",
        text: "Users may manage cookie preferences through their browser settings.",
      },
    ],
  },
  {
    id: "international-data-processing",
    number: 12,
    title: "International Data Processing",
    blocks: [
      {
        type: "paragraph",
        text: "Information may be stored or processed in locations where AIMOS, its affiliates, or service providers operate. We take reasonable measures to ensure appropriate protection of information regardless of processing location.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    number: 13,
    title: "Children\u2019s Privacy",
    blocks: [
      {
        type: "paragraph",
        text: "AIMOS is intended for professional and business use and is not designed for individuals under the age of 13. We do not knowingly collect personal information from children.",
      },
    ],
  },
  {
    id: "changes",
    number: 14,
    title: "Changes to This Privacy Policy",
    blocks: [
      {
        type: "paragraph",
        text: "We may update this Privacy Policy periodically. Any updates will be published on this page along with the revised effective date. Continued use of AIMOS following any changes constitutes acceptance of the updated Privacy Policy.",
      },
    ],
  },
  {
    id: "contact",
    number: 15,
    title: "Contact Information",
    blocks: [
      {
        type: "paragraph",
        text: "For questions regarding this Privacy Policy, data protection practices, or privacy-related requests, please contact:",
      },
      {
        type: "contact",
        lines: [
          "AIMOS Support Team",
          "Email: support@aimos.ai",
          "Website: aimos.ai",
        ],
      },
      {
        type: "paragraph",
        text: "At AIMOS, we are committed to building a secure, transparent, and trustworthy digital marketing platform that empowers organizations to leverage AI responsibly while maintaining control and ownership of their data.",
      },
    ],
  },
];
