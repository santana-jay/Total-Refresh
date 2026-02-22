import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Construction size={40} className="text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">Coming Soon</h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          We're working on something great. This page will be available shortly.
        </p>
        <Link href="/">
          <Button
            size="lg"
            className="rounded-full bg-primary text-white hover:bg-primary/90 px-8 cursor-pointer"
            data-testid="button-back-home"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
