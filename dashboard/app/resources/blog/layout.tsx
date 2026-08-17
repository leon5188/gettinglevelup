import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plumbing Software 2026 Blog | Insights & Trends",
  description: "Stay ahead of the competition with the Plumbify Blog. Expert insights on Plumbing Software 2026, AI plumber assistants, automation, and trade service growth.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
