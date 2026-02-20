import { motion } from "framer-motion";
import { ArrowRight, Droplets, Sparkles, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-clean.png" 
            alt="Deep clean fabric texture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              Total Refresh
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 text-foreground">
              Refresh the space, <br/>
              <span className="text-primary">not just the surface.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Dust, residue, and everyday grime settle deep into fibers. 
              We specialize in deep extraction cleaning that brings back that freshness you can actually feel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book">
                <Button size="lg" className="rounded-full text-lg px-8 py-6 shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 cursor-pointer">
                  Book a Refresh
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="rounded-full text-lg px-8 py-6 bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-white cursor-pointer">
                  Our Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Statement */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            There’s a moment every home hits.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            The rug that never looks quite the same. The couch that feels “lived in” no matter how much you tidy. 
            The room that’s clean… but doesn’t feel fresh. It’s not because you’re not cleaning. 
            It’s because soft surfaces hold onto life.
          </p>
          <div className="h-1 w-20 bg-primary/30 mx-auto rounded-full" />
        </div>
      </section>

      {/* Why Extraction? */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/living-room-clean.png" 
                  alt="Clean living room" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-border max-w-xs hidden md:block">
                <p className="font-display font-bold text-lg text-primary mb-2">Did you know?</p>
                <p className="text-sm text-muted-foreground">Vacuuming only removes surface dirt. Extraction pulls out deep-seated allergens and oils.</p>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Why Extraction?</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Deeper than vacuuming</h3>
                    <p className="text-muted-foreground">Removes embedded dirt, oils, and buildup that regular cleaning can't reach.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <RefreshCw size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Refreshes the feel</h3>
                    <p className="text-muted-foreground">It’s not just about how it looks. We restore the texture and softness of your fabrics.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">The ultimate reset</h3>
                    <p className="text-muted-foreground">The reset button for your home when regular cleaning stops being enough.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Clean */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What We Clean</h2>
          <p className="text-muted-foreground">Comprehensive care for your home's soft surfaces.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Couches & Sectionals", desc: "Revitalize your main gathering space.", icon: "🛋️" },
            { title: "Area Rugs", desc: "Delicate care for your woven treasures.", icon: "🧶" },
            { title: "Wall-to-Wall Carpet", desc: "Deep extraction for whole-room freshness.", icon: "🏠" },
            { title: "Upholstered Seating", desc: "Dining chairs, armchairs, and ottomans.", icon: "🪑" },
            { title: "High-Traffic Areas", desc: "Targeted cleaning for busy pathways.", icon: "👣" },
            { title: "Spot Treatments", desc: "Specialized stain removal.", icon: "✨" },
          ].map((item, i) => (
            <Card key={i} className="group hover:shadow-lg transition-all border-border/50 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-primary rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              If it’s been a while, it’s time for extraction.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Let’s make your home feel new again. Book your appointment today.
            </p>
            <Link href="/book">
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 font-bold shadow-xl cursor-pointer">
                Book an Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}