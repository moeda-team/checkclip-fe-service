import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Sparkles,
  Settings
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavNode = {
  title: string;
  // Leaf items navigate via `href`. Items with `children` act as
  // placeholders (no `href` needed) and only expand/collapse on click.
  href?: string;
  icon?: React.ElementType;
  children?: NavNode[];
};

export type NavSection = {
  title: string;
  items: NavNode[];
};

// ─── Navigation data ──────────────────────────────────────────────────────────

export const navigationItems: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
      }
    ]
  },
  {
    title: "CRM",
    items: [
      {
        title: "Customer Data",
        icon: FileText,
        children: [
          {
            title: "Customer Profile",
            href: "/customer-data/customer-profile"
          }
        ]
      }
    ]
  },
  {
    title: "CRM2",
    items: [
      {
        title: "Customer Data",
        icon: FileText,
        children: [
          {
            title: "Customer Profile",
            href: "/campaigns"
          }
        ]
      }
    ]
  },
  {
    title: "Campaigns",
    items: [
      {
        title: "Campaign",
        href: "/campaigns",
        icon: Megaphone
      },
      {
        title: "Campaign Briefs",
        href: "/campaign-brief",
        icon: FileText
      },
      {
        title: "Strategy Planner",
        href: "/strategy-planner",
        icon: Sparkles
      }
    ]
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        href: "/setting",
        icon: Settings
      }
    ]
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Returns true if this node (or any descendant) matches the current path.
export function nodeContainsActive(node: NavNode, pathname: string): boolean {
  if (node.href && (pathname === node.href || pathname.startsWith(node.href + "/"))) {
    return true;
  }
  return node.children?.some((c) => nodeContainsActive(c, pathname)) ?? false;
}

// Depth-first walk over every node in the navigation tree.
function walkNodes(nodes: NavNode[], visit: (node: NavNode) => void): void {
  for (const node of nodes) {
    visit(node);
    if (node.children?.length) {
      walkNodes(node.children, visit);
    }
  }
}

/**
 * Given a placeholder parent path (e.g. `/customer-data`), returns the href of
 * its first navigable descendant leaf (e.g. `/customer-data/customer-profile`),
 * or `null` if none exists. Used to auto-redirect placeholder routes to their
 * first child page.
 */
export function findFirstChildHref(pathname: string): string | null {
  const prefix = pathname.endsWith("/") ? pathname : pathname + "/";
  let found: string | null = null;

  for (const section of navigationItems) {
    walkNodes(section.items, (node) => {
      if (found) return;
      const isLeaf = !node.children?.length;
      if (isLeaf && node.href && node.href.startsWith(prefix)) {
        found = node.href;
      }
    });
    if (found) break;
  }

  return found;
}
