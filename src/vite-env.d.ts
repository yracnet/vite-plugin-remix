/// <reference types="vite/client" />

declare var process: {
  env: {
    NODE_ENV: string;
    VITE_ENTRY_CLIENT: string;
    VITE_URL_REFRESH: string;
    VITE_URL_CLIENT: string;
  };
  cwd: () => string;
};
