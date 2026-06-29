import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { LucideIcon } from "lucide-react";
import { BackButton } from "@/components/legal/back-button";

export interface LegalDocumentProps {
  /** Path relative to project root, e.g. "app/privacy-policy/content/privacy-policy.md" */
  filePath: string;
  icon: LucideIcon;
  accentClass?: string;
}

async function getMarkdownContent(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  const lastUpdated =
    data.lastUpdated instanceof Date
      ? data.lastUpdated.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : String(data.lastUpdated ?? "");

  return {
    frontmatter: {
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      lastUpdated,
    },
    contentHtml,
  };
}

export async function LegalDocument({
  filePath,
  icon: Icon,
  accentClass = "text-purple-600",
}: LegalDocumentProps) {
  const { frontmatter, contentHtml } = await getMarkdownContent(filePath);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <BackButton />

        <header className="mb-8 border-b border-gray-200 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className={`text-4xl font-extrabold tracking-tight ${accentClass} sm:text-5xl`}
              >
                {frontmatter.title}
              </h1>
              <p className={`mt-2 text-sm font-semibold ${accentClass}`}>
                Effective Date: {frontmatter.lastUpdated}
              </p>
            </div>
            <Icon className={`h-12 w-12 shrink-0 ${accentClass}`} />
          </div>
        </header>

        <article
          className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-purple-600 prose-strong:text-gray-900 prose-li:text-gray-600 prose-li:marker:text-purple-500"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <p className="mt-8 text-center text-sm italic text-gray-400">
          Last updated: {frontmatter.lastUpdated}
        </p>
      </div>
    </div>
  );
}
