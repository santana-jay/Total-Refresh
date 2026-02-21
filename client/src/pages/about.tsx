import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">About Us</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-balance">We believe that a truly clean home feels different.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">Total Refresh was founded on a simple observation: most cleaning just skims the surface. We wanted to go deeper.</p>
        </div>

        <div className="aspect-video w-full bg-slate-100 rounded-3xl overflow-hidden mb-16 relative">
             <img 
              src="/images/hero-clean.png" 
              alt="Clean texture" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <h2 className="text-white text-4xl font-display font-bold drop-shadow-lg">Reset. Refresh. Restore.</h2>
            </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 text-lg text-muted-foreground leading-relaxed">
          <p>
            Dust, residue, oils, and everyday grime settle into the fibers over time — and vacuuming can only reach so far. That's why we built our process around <strong>extraction</strong>.
          </p>
          <p>
            We don't just use soaps and scrub. We use professional-grade equipment to inject cleaning solution deep into the fibers and then extract it back out, taking the dirt and allergens with it.
          </p>
          <p>
            The result isn't just a rug that looks cleaner. It's a room that smells fresher, air that feels lighter, and a home that feels like new again.
          </p>
          
          <div className="pt-8 border-t border-border mt-12">
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Promise</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                We treat your home with respect and care.
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                We use safe, effective cleaning solutions.
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                We don't leave until the job is done right.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center pb-20">
          <Link href="/book">
            <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90 px-8 cursor-pointer">
                Experience the Difference
            </Button>
          </Link>
      </div>
    </div>
  );
}