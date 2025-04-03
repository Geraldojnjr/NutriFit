export type DatabaseType = 'supabase' | 'mariadb';

interface DatabaseConfig {
  type: DatabaseType;
  connection: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
  };
}

// Function to get environment variables with fallbacks
// This works in both Node.js and browser environments
const getEnv = (key: string, defaultValue: string): string => {
  // For browser environments
  if (typeof window !== 'undefined') {
    // We could use localStorage here if we wanted to let users configure this in the UI
    return defaultValue;
  }
  
  // For Node.js environments (this code won't run in the browser)
  // @ts-ignore - process.env might not be defined in the browser
  return process?.env?.[key] || defaultValue;
};

// Default to Supabase if no config is provided
export const dbConfig: DatabaseConfig = {
  type: 'mariadb', // Change to 'mariadb' to use MariaDB or supabase
  connection: {
    // MariaDB connection details (used only when type is 'mariadb')
    host: getEnv('DB_HOST', 'localhost'),
    port: parseInt(getEnv('DB_PORT', '3306')),
    username: getEnv('DB_USER', 'root'),
    password: getEnv('DB_PASSWORD', ''),
    database: getEnv('DB_NAME', 'recipe_manager')
  }
};
