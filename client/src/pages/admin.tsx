import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, Phone, Mail, User } from "lucide-react";
import type { Appointment } from "@shared/schema";

const serviceLabels: Record<string, string> = {
  carpet: "Carpet Cleaning",
  upholstery: "Upholstery/Couch",
  rugs: "Area Rugs",
  multiple: "Multiple Services",
};

export default function Admin() {
  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold mb-2">Appointment Requests</h1>
        <p className="text-muted-foreground">All submitted booking requests, newest first.</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6 text-destructive">
            Failed to load appointments. Please refresh the page.
          </CardContent>
        </Card>
      )}

      {appointments && appointments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No appointment requests yet.
          </CardContent>
        </Card>
      )}

      {appointments && appointments.length > 0 && (
        <div className="space-y-4">
          {[...appointments].reverse().map((apt) => (
            <Card key={apt.id} className="border-border/50 hover:border-primary/20 transition-colors" data-testid={`card-appointment-${apt.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <User size={18} className="text-primary" />
                        {apt.name}
                      </h3>
                      <Badge variant="secondary" data-testid={`badge-service-${apt.id}`}>
                        {serviceLabels[apt.serviceType] || apt.serviceType}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />
                        {apt.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} />
                        {apt.email}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        {apt.preferredDate}
                      </span>
                      {apt.preferredTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-primary" />
                          {apt.preferredTime}
                        </span>
                      )}
                    </div>
                    {apt.details && (
                      <p className="text-sm text-muted-foreground bg-slate-50 rounded-lg p-3 mt-2">
                        {apt.details}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(apt.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}