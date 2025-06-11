
'use server';

import fs from 'fs/promises';
import path from 'path';
import { multipleDataSourcesSchema, type MultipleDataSourcesFormData, CONFIG_FILE_NAME } from '@/lib/data-source-config-schema';

const CONFIG_FILE_PATH = path.resolve(process.cwd(), CONFIG_FILE_NAME);

export async function saveDataSourceSettings(data: MultipleDataSourcesFormData) {
  try {
    // Validate data against schema before saving
    const validatedData = multipleDataSourcesSchema.parse(data);
    const jsonData = JSON.stringify(validatedData, null, 2);
    await fs.writeFile(CONFIG_FILE_PATH, jsonData, 'utf8');
    return { success: true, message: 'Settings saved successfully.' };
  } catch (error) {
    console.error('Failed to save data source settings:', error);
    if (error instanceof Error) {
        return { success: false, message: `Failed to save settings: ${error.message}` };
    }
    return { success: false, message: 'An unknown error occurred while saving settings.' };
  }
}
