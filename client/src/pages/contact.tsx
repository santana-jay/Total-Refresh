import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Contact() {
  return (
    <div className="pb-20">
      <div className="bg-slate-50 py-20 mb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? Ready for a quote? We're here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-muted-foreground mb-2">Mon-Fri from 8am to 5pm.</p>
                    <a href="tel:+15551234567" className="text-lg font-semibold hover:text-primary transition-colors">
                      (555) 123-4567
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-muted-foreground mb-2">Drop us a line anytime.</p>
                    <a href="mailto:hello@totalrefresh.com" className="text-lg font-semibold hover:text-primary transition-colors">
                      hello@totalrefresh.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-6">
                <h3 className="font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                    <Instagram size={20} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                    <Facebook size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col justify-center text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Ready to book?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              The fastest way to get on our schedule is through our online booking form. It takes less than 2 minutes.
            </p>
            <Link href="/book">
              <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90 text-lg w-full cursor-pointer">
                Book Appointment Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}