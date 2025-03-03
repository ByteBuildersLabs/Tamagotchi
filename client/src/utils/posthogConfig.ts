import posthog from 'posthog-js';

interface CustomEnv {
  VITE_POSTHOG_API_KEY: string;
  VITE_POSTHOG_HOST: string;
  DEV: boolean;
}

// Initialize PostHog
export function setupPostHog() {
  const env = import.meta.env as unknown as CustomEnv;
  const apiKey = env.VITE_POSTHOG_API_KEY;
  const apiHost = env.VITE_POSTHOG_HOST;
  const isDevelopment = env.DEV;

  if (!apiKey) {
    console.warn('PostHog API key not found. Analytics will not be loaded.');
    return { initialized: false, client: null };
  }

  // Basic configuration
  const options = {
    api_host: apiHost,
    autocapture: true,
    loaded: (ph: typeof posthog) => {
      if (isDevelopment) {
        // Descomment the following line to disable capturing in development
        // ph.opt_out_capturing();
        ph.debug(true);
      }
    },
  };

  posthog.init(apiKey, options);

  return { 
    initialized: true, 
    client: posthog 
  };
}

export const posthogInstance = setupPostHog();