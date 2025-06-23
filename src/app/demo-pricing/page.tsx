import { Header } from "@/components/Header";
import { PricingDemo } from "@/components/PricingDemo";

export default function DemoPricingPage() {
  return (
    <>
      <Header title="Demo: Agente de Pricing Interactivo" />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <PricingDemo />
        </div>
      </main>
    </>
  );
} 