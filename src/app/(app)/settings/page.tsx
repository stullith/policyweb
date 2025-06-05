
import { DataSourceSettings } from "@/components/settings/data-source-settings";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and data sources.
        </p>
      </div>
      <Separator />
      <DataSourceSettings />
      {/* Add other settings sections here if needed */}
    </div>
  );
}
