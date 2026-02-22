// =============================================================================
// ADMIN PAGE (client/src/pages/admin.tsx)
// =============================================================================
// Password-protected admin panel at /superadminmothafucka
//
// Flow:
//   1. If a ?reset=<token> query param is present, show ResetPasswordForm
//   2. If not logged in, show LoginForm (username + password)
//   3. If logged in, show AppointmentsList (view, edit, delete appointments)
//
// Components in this file:
//   - LoginForm — handles admin login and "forgot password" flow
//   - ResetPasswordForm — lets admin set a new password using a reset token
//   - ChangePasswordModal — modal to change password while logged in
//   - EditAppointmentModal — modal to edit appointment details
//   - DeleteConfirmModal — confirmation dialog before deleting an appointment
//   - AppointmentsList — main dashboard showing all appointment requests
//   - Admin (default export) — orchestrates which view to show
// =============================================================================

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar, Clock, Phone, Mail, User, LogOut, KeyRound, Pencil, Trash2, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Appointment } from "@shared/schema";

// Human-readable labels for the service type codes stored in the database
const serviceLabels: Record<string, string> = {
  carpet: "Carpet Cleaning",
  upholstery: "Upholstery/Couch",
  rugs: "Area Rugs",
  multiple: "Multiple Services",
};

// =============================================================================
// LoginForm — username + password login for the admin panel
// Also includes a "Forgot password?" flow that generates a reset token
// (logged to the server console).
// =============================================================================
function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const { toast } = useToast();

  // Authenticate with the server and store the returned bearer token
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
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

  // Request a password reset token (it gets printed in the server console)
  async function handleForgotPassword() {
    try {
      const res = await fetch("/api/admin/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: resetUsername || "admin" }),
      });
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
          <CardDescription>Enter your credentials to manage appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-admin-username"
              autoFocus
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-admin-password"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary text-white" disabled={loading} data-testid="button-admin-login">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
            </Button>
          </form>

          {/* Forgot password section — toggles between link, form, and confirmation */}
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
                <Input
                  type="text"
                  placeholder="Username (default: admin)"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  className="text-sm"
                />
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

// =============================================================================
// ResetPasswordForm — shown when the URL has ?reset=<token>
// Lets the admin set a new password using the token from the server console.
// =============================================================================
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

// =============================================================================
// ChangePasswordModal — overlay modal for changing password while logged in.
// Requires current password + new password (min 8 chars).
// =============================================================================
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
            <Input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoFocus />
            <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-primary text-white" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// EditAppointmentModal — overlay modal for editing an existing appointment.
// Pre-filled with the appointment's current data.
// =============================================================================
function EditAppointmentModal({
  appointment,
  token,
  onClose,
  onSaved,
}: {
  appointment: Appointment;
  token: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(appointment.name);
  const [email, setEmail] = useState(appointment.email);
  const [phone, setPhone] = useState(appointment.phone);
  const [serviceType, setServiceType] = useState(appointment.serviceType);
  const [preferredDate, setPreferredDate] = useState(appointment.preferredDate);
  const [preferredTime, setPreferredTime] = useState(appointment.preferredTime || "");
  const [details, setDetails] = useState(appointment.details || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Send PUT request to update the appointment
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, serviceType, preferredDate, preferredTime, details }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to update.");
        return;
      }
      toast({ title: "Updated", description: "Appointment updated successfully." });
      onSaved();
      onClose();
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil size={20} />
            Edit Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} data-testid="input-edit-name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="input-edit-phone" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-edit-email" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Service</label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger data-testid="select-edit-service">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border shadow-lg">
                  <SelectItem value="carpet">Carpet Cleaning</SelectItem>
                  <SelectItem value="upholstery">Upholstery/Couch</SelectItem>
                  <SelectItem value="rugs">Area Rugs</SelectItem>
                  <SelectItem value="multiple">Multiple Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} data-testid="input-edit-date" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Time</label>
                <Input value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} placeholder="e.g. 6:00 PM" data-testid="input-edit-time" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Details</label>
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} className="resize-none" data-testid="textarea-edit-details" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-primary text-white" disabled={loading} data-testid="button-save-edit">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save size={16} className="mr-1" /> Save</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// DeleteConfirmModal — asks for confirmation before permanently deleting
// an appointment request.
// =============================================================================
function DeleteConfirmModal({
  appointment,
  token,
  onClose,
  onDeleted,
}: {
  appointment: Appointment;
  token: string;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast({ title: "Error", description: "Failed to delete appointment.", variant: "destructive" });
        return;
      }
      toast({ title: "Deleted", description: `Appointment for ${appointment.name} has been removed.` });
      onDeleted();
      onClose();
    } catch {
      toast({ title: "Error", description: "Connection error.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 size={20} />
            Delete Appointment
          </CardTitle>
          <CardDescription>
            Are you sure you want to delete the appointment for <strong>{appointment.name}</strong>? This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={loading} data-testid="button-confirm-delete">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Admin (default export) — top-level controller for the admin page.
// Decides which view to render based on login state and URL params.
// =============================================================================
export default function Admin() {
  // Persist the auth token in sessionStorage so it survives page refreshes
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("adminToken"));
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [, setLocation] = useLocation();

  // Check for a password reset token in the URL query string
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

  // After resetting password, strip the ?reset param from the URL
  function handleResetDone() {
    window.history.replaceState({}, "", "/superadminmothafucka");
    setLocation("/superadminmothafucka");
  }

  // Show the reset form if a reset token is in the URL
  if (resetToken) {
    return <ResetPasswordForm token={resetToken} onDone={handleResetDone} />;
  }

  // Show login form if not authenticated
  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show the main appointments dashboard
  return (
    <AppointmentsList
      token={token}
      onLogout={handleLogout}
      onChangePassword={() => setShowChangePassword(true)}
      showChangePassword={showChangePassword}
      onCloseChangePassword={() => setShowChangePassword(false)}
    />
  );
}

// =============================================================================
// AppointmentsList — the main admin dashboard.
// Fetches all appointments from the API and displays them as cards.
// Provides edit and delete actions for each appointment.
// =============================================================================
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
  const queryClient = useQueryClient();
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);

  // Fetch appointments from the API with the auth token
  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // If unauthorized, clear session and force re-login
      if (res.status === 401) {
        sessionStorage.removeItem("adminToken");
        window.location.reload();
        throw new Error("Session expired");
      }
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  // Refresh the appointments list after an edit or delete
  function refreshList() {
    queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header with title and action buttons */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Appointment Requests</h1>
          <p className="text-muted-foreground">Manage all booking requests. Edit or delete as needed.</p>
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

      {/* Modals — rendered when their state is active */}
      {showChangePassword && <ChangePasswordModal token={token} onClose={onCloseChangePassword} />}
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          token={token}
          onClose={() => setEditingAppointment(null)}
          onSaved={refreshList}
        />
      )}
      {deletingAppointment && (
        <DeleteConfirmModal
          appointment={deletingAppointment}
          token={token}
          onClose={() => setDeletingAppointment(null)}
          onDeleted={refreshList}
        />
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6 text-destructive">
            Failed to load appointments. Please refresh the page.
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {appointments && appointments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No appointment requests yet.
          </CardContent>
        </Card>
      )}

      {/* Appointment cards */}
      {appointments && appointments.length > 0 && (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt.id} className="border-border/50 hover:border-primary/20 transition-colors" data-testid={`card-appointment-${apt.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Appointment info */}
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

                  {/* Actions column — timestamp + edit/delete buttons */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(apt.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAppointment(apt)}
                        data-testid={`button-edit-${apt.id}`}
                      >
                        <Pencil size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingAppointment(apt)}
                        data-testid={`button-delete-${apt.id}`}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
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
