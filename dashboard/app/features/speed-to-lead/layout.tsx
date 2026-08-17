import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speed to Lead AI | Book Plumbing Jobs in 60 Seconds",
  description: "Our AI-powered text-back system ensures no missed call goes unanswered. Convert every plumbing lead into a booked appointment automatically.",
};

export default function SpeedToLeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
