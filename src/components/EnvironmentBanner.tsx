import { getRuntimeConfig } from '../config/env';

/** Non-secret runtime banner to help operators verify which backend they are using. */
export function EnvironmentBanner(): React.JSX.Element {
  const config = getRuntimeConfig();

  return (
    <div className="environment-banner" role="note">
      <strong>Backend:</strong> <code>{config.apiBaseUrl}</code>
      <span>Client version: {config.appVersion}</span>
    </div>
  );
}
