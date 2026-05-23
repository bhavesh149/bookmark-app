export default function SettingsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">Update your personal information.</p>
            </div>
            <button className="premium-btn text-sm font-semibold px-4 py-2 rounded-xl">
              Edit
            </button>
          </div>
          
          <div className="flex items-center justify-between border-b border-border/50 pb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Configure how you receive alerts.</p>
            </div>
            <button className="bg-accent text-foreground hover:bg-accent/80 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Manage
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Subscription Plan</h3>
              <p className="text-sm text-muted-foreground">You are currently on the Pro plan.</p>
            </div>
            <button className="bg-accent text-foreground hover:bg-accent/80 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
