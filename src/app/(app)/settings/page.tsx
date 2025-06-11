
import fs from 'fs/promises';
import path from 'path';
import { DataSourceSettings } from "@/components/settings/data-source-settings";
import { Separator } from "@/components/ui/separator";
import { multipleDataSourcesSchema, defaultNewConfiguration, CONFIG_FILE_NAME, type MultipleDataSourcesFormData } from '@/lib/data-source-config-schema';

const CONFIG_FILE_PATH = path.resolve(process.cwd(), CONFIG_FILE_NAME);

async function loadConfigurations(): Promise<MultipleDataSourcesFormData> {
  try {
    const fileContent = await fs.readFile(CONFIG_FILE_PATH, 'utf8');
    const jsonData = JSON.parse(fileContent);
    // Validate data against schema
    const validatedData = multipleDataSourcesSchema.parse(jsonData);
    // Ensure there's at least one configuration for the form, if array is empty
    if (validatedData.configurations.length === 0) {
      return { configurations: [JSON.parse(JSON.stringify(defaultNewConfiguration))] };
    }
    return validatedData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('Config file not found, using default empty configuration set.');
    } else {
      console.error('Failed to load or parse data source settings:', error);
    }
    // Return a default structure that includes one empty configuration for the form
    return { configurations: [JSON.parse(JSON.stringify(defaultNewConfiguration))] };
  }
}


export default async function SettingsPage() {
  const initialConfigurations = await loadConfigurations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and data sources.
        </p>
      </div>
      <Separator />
      <DataSourceSettings initialConfigurations={initialConfigurations} />
      {/* Add other settings sections here if needed */}
    </div>
  );
}
