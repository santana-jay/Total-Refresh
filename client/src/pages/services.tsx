import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Clock, AlertCircle, Sparkles } from "lucide-react";

export default function Services() {
  return (
    <div className="pb-20">
      <div className="bg-slate-50 py-20 mb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Services & Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade extraction for every soft surface in your home. Transparent pricing, no surprises.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl space-y-16">

        {/* Service Area & Policies */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-start gap-4">
              <MapPin className="text-primary shrink-0 mt-1" size={22} />
              <div>
                <h3 className="font-bold mb-1">Service Area</h3>
                <p className="text-sm text-muted-foreground">Westchester County, NY + Nyack (in-home service)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-start gap-4">
              <AlertCircle className="text-primary shrink-0 mt-1" size={22} />
              <div>
                <h3 className="font-bold mb-1">Trip Minimum</h3>
                <p className="text-sm text-muted-foreground">$150 service minimum per visit</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-start gap-4">
              <Clock className="text-primary shrink-0 mt-1" size={22} />
              <div>
                <h3 className="font-bold mb-1">Dry Time</h3>
                <p className="text-sm text-muted-foreground">Typically 2–8 hours depending on conditions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upholstery Pricing */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-2">Upholstery Cleaning</h2>
          <p className="text-muted-foreground mb-8">Deep extraction for sofas, chairs, and more. Starting ranges below.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { item: "Dining Chair", detail: "Seat + back (min. 4 recommended)", price: "$35 – $55", unit: "per chair" },
              { item: "Accent Chair", detail: "Armchairs, reading chairs", price: "$79 – $129", unit: "" },
              { item: "Recliner", detail: "Standard reclining chairs", price: "$99 – $159", unit: "" },
              { item: "Loveseat", detail: "2-seat sofa", price: "$129 – $199", unit: "" },
              { item: "Sofa", detail: "Standard 3-seat", price: "$179 – $279", unit: "" },
              { item: "Sectional", detail: "Up to 5 seats included, then +$35–$65 per extra seat", price: "$299 – $549", unit: "" },
            ].map((s, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1">{s.item}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.detail}</p>
                  <p className="text-primary font-display font-bold text-xl">{s.price}</p>
                  {s.unit && <p className="text-xs text-muted-foreground mt-1">{s.unit}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Carpet Extraction */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-2">Carpet Extraction</h2>
          <p className="text-muted-foreground mb-8">Wall-to-wall carpet deep cleaning. Pricing by area type.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { item: "Room", price: "$79 – $139" },
              { item: "Hallway", price: "$49 – $89" },
              { item: "Stairs", price: "$6–$12/step or $99–$189/flight" },
              { item: "Closet", price: "$25 – $45" },
            ].map((s, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-3">{s.item}</h3>
                  <p className="text-primary font-display font-bold text-xl">{s.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Area Rugs */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-2">Area Rugs</h2>
          <p className="text-muted-foreground mb-8">In-home cleaning for synthetic rugs. Wool, silk, and antique rugs are referred to a specialist.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { size: "Small", dimensions: "2x3 to 4x6", price: "$79 – $129" },
              { size: "Medium", dimensions: "5x7 to 6x9", price: "$129 – $199" },
              { size: "Large", dimensions: "8x10+", price: "$199 – $349" },
            ].map((s, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-1">{s.size}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.dimensions}</p>
                  <p className="text-primary font-display font-bold text-xl">{s.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 italic">
            Wool, silk, and antique rugs require specialized care and are referred to a trusted partner.
          </p>
        </section>

        {/* Add-ons */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
            <Sparkles className="text-primary" size={28} />
            Add-Ons
          </h2>
          <p className="text-muted-foreground mb-8">Enhance your clean with targeted treatments.</p>
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { name: "Pet Urine / Odor Treatment", price: "+$50 – $200", note: "Based on severity and number of areas" },
                  { name: "Spot Treatment Package", price: "+$25 – $75", note: "" },
                  { name: "General Deodorizer", price: "+$20 – $50", note: "" },
                  { name: "Fabric Protector", price: "+$40 – $150", note: "" },
                  { name: "Same-Day Rush / Tight Time Window", price: "+$25 – $75", note: "" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium">{a.name}</p>
                      {a.note && <p className="text-xs text-muted-foreground mt-1">{a.note}</p>}
                    </div>
                    <p className="text-primary font-display font-bold text-lg whitespace-nowrap ml-4">{a.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Policy Note */}
        <div className="bg-slate-50 rounded-2xl p-8 text-center">
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
            Final pricing is confirmed after an inspection of the items to be cleaned. While we achieve excellent results, some stains may improve but not fully disappear. We'll always set honest expectations upfront.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Book your appointment today and let us bring the freshness back to your home.
          </p>
          <Link href="/book">
            <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90 text-lg px-10 cursor-pointer">
              Book an Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}