import AIAgentWidget from "@/components/AIAgentWidget";

export default function WidgetEmbedPage() {
  return (
    <main className="w-screen h-screen min-h-screen bg-transparent overflow-hidden relative">
      <AIAgentWidget isEmbedPage={true} />
    </main>
  );
}
