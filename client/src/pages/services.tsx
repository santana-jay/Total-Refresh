import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      title: "Carpet Extraction",
      description: "Deep clean for wall-to-wall carpets. We use hot water extraction to remove dirt, allergens, and stains from the base of the fibers.",
      features: ["Pre-treatment of heavy traffic areas", "Stain removal", "Deodorizing", "Fast drying times"],
      price: "Starting at $150"
    },
    {
      title: "Upholstery Cleaning",
      description: "Revitalize your furniture. We clean sofas, loveseats, chairs, and ottomans, removing oils and restoring fabric vibrancy.",
      features: ["Delicate fabric care", "Odor neutralization", "Pet hair removal", "Fabric protection available"],
      price: "Starting at $120"
    },
    {
      title: "Area Rug Care",
      description: "Specialized cleaning for your area rugs. Whether synthetic or wool, we treat them with care to preserve colors and fibers.",
      features: ["Gentle agitation", "Color-safe solutions", "Fringe cleaning", "Pickup & delivery available"],
      price: "Starting at $80"
    }
  ];

  return (
    <div className="pb-20">
      <div className="bg-slate-50 py-20 mb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional grade extraction for every soft surface in your home.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-12 max-w-4xl mx-auto">
          {services.map((service, i) => (
            <Card key={i} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="md:flex">
                <div className="p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold font-display mb-4 text-primary">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4">
                    <Link href="/book">
                      <Button className="rounded-full bg-primary text-white hover:bg-primary/90 cursor-pointer">
                        Book Now
                      </Button>
                    </Link>
                    <span className="text-sm text-muted-foreground font-medium">{service.price}</span>
                  </div>
                </div>
                <div className="bg-primary/5 md:w-1/3 flex items-center justify-center p-8">
                  {/* Placeholder for service specific icons/images */}
                  <div className="text-primary/20">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}