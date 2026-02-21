import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from "@assets/TR_Icon_1771651745444.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-border/50 py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src={logoImage} alt="TotalRefresh" className="h-12" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === link.href ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book">
            <Button size="sm" className="rounded-full px-6 bg-primary text-white hover:bg-primary/90 cursor-pointer">
              Book Appointment
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-medium py-2 border-b border-border/50",
                location === link.href ? "text-primary" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setIsOpen(false)}>
            <Button className="w-full mt-2 rounded-full bg-primary text-white hover:bg-primary/90 cursor-pointer">
              Book Appointment
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 block">
              <img src={logoImage} alt="TotalRefresh" className="h-12" />
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Reset the space, not just the surface. Deep extraction cleaning that brings back the freshness you can feel.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/totalrefreshnow?igsh=NGM0cDZyeXpseXp4&utm_source=qr" className="p-2 rounded-full bg-white border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="mailto:info@totalrefreshnow.com" className="p-2 rounded-full bg-white border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary">Carpet Cleaning</Link></li>
              <li><Link href="/services" className="hover:text-primary">Upholstery Extraction</Link></li>
              <li><Link href="/services" className="hover:text-primary">Area Rugs</Link></li>
              <li><Link href="/services" className="hover:text-primary">Spot Treatment</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@totalrefreshnow.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TotalRefresh Surface Care. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}