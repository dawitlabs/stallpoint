import { ClosingSection } from "@/features/marketing/closing-section";
import { FaqSection } from "@/features/marketing/faq-section";
import { Hero } from "@/features/marketing/hero";
import { HowSection } from "@/features/marketing/how-section";
import { PricingSection } from "@/features/marketing/pricing-section";
import { ProductSection } from "@/features/marketing/product-section";
import { SiteFooter } from "@/features/marketing/site-footer";
import { SiteHeader } from "@/features/marketing/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="mx-auto w-[min(1200px,100%-2rem)]">
          <Hero />
        </div>
        <ProductSection />
        <HowSection />
        <PricingSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </>
  );
}
