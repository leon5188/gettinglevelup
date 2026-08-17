import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Affordable AI Software for Plumbing Companies",
  description: "Transparent pricing for plumbers. From solo trucks to large fleets, see how Plumbify's AI automation fits your budget.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
