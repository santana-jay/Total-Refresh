import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Calendar, Clock, Phone, Mail, User, LogOut, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Appointment } from "@shared/schema";

const serviceLabels: Record<string, string> = {
  carpet: "Carpet Cleaning",
  upholstery: "Upholstery/Couch",
  rugs: "Area Rugs",
  multiple: "Multiple Services",
};

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const { toast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }
      onLogin(data.token);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    try {
      const res = await fetch("/api/admin/request-reset", { method: "POST" });
      const data = await res.json();
      toast({ title: "Reset Requested", description: data.message });
      setResetRequested(true);
    } catch {
      toast({ title: "Error", description: "Failed to request reset.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
          <CardDescription>Enter your password to view appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-admin-password"
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary text-white" disabled={loading} data-testid="button-admin-login">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            {!showForgot ? (
              <button
                onClick={() => setShowForgot(true)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                data-testid="link-forgot-password"
              >
                Forgot password?
              </button>
            ) : resetRequested ? (
              <p className="text-sm text-muted-foreground">Check the server console for your reset link.</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A reset token will be logged to the server console.
                </p>
                <Button variant="outline" size="sm" onClick={handleForgotPassword} data-testid="button-request-reset">
                  Send Reset Token
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResetPasswordForm({ token, onDone }: { token: string; onDone: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Reset failed.");
        return;
      }
      toast({ title: "Password Reset", description: "Your password has been reset. You can now log in." });
      onDone();
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              data-testid="input-new-password"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-testid="input-confirm-password"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary text-white" disabled={loading} data-testid="button-reset-password">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ChangePasswordModal({ token, onClose }: { token: string; onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function handleChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }
      toast({ title: "Password Changed", description: "Your password has been updated." });
      onClose();
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound size={20} />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChange} className="space-y-4">
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              data-testid="input-current-password"
              autoFocus
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              data-testid="input-change-new-password"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-testid="input-change-confirm-password"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-white" disabled={loading} data-testid="button-change-password">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("adminToken"));
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [, setLocation] = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("reset");

  function handleLogin(t: string) {
    sessionStorage.setItem("adminToken", t);
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem("adminToken");
    setToken(null);
  }

  function handleResetDone() {
    window.history.replaceState({}, "", "/admin");
    setLocation("/admin");
  }

  if (resetToken) {
    return <ResetPasswordForm token={resetToken} onDone={handleResetDone} />;
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <AppointmentsList token={token} onLogout={handleLogout} onChangePassword={() => setShowChangePassword(true)} showChangePassword={showChangePassword} onCloseChangePassword={() => setShowChangePassword(false)} />;
}

function AppointmentsList({
  token,
  onLogout,
  onChangePassword,
  showChangePassword,
  onCloseChangePassword,
}: {
  token: string;
  onLogout: () => void;
  onChangePassword: () => void;
  showChangePassword: boolean;
  onCloseChangePassword: () => void;
}) {
  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("adminToken");
        window.location.reload();
        throw new Error("Session expired");
      }
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Appointment Requests</h1>
          <p className="text-muted-foreground">All submitted booking requests, newest first.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onChangePassword} data-testid="button-open-change-password">
            <KeyRound size={16} className="mr-1" />
            Password
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout} data-testid="button-logout">
            <LogOut size={16} className="mr-1" />
            Log Out
          </Button>
        </div>
      </div>

      {showChangePassword && <ChangePasswordModal token={token} onClose={onCloseChangePassword} />}

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
          {appointments.map((apt) => (
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