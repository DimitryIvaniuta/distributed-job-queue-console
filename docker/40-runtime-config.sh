#!/bin/sh
set -eu
cat > /usr/share/nginx/html/config.js <<CONFIG
window.__QUEUEOPS_CONFIG__ = {
  apiBaseUrl: '${APP_API_BASE_URL:-${VITE_API_BASE_URL:-http://localhost:8080}}',
  appVersion: '${APP_VERSION:-${VITE_APP_VERSION:-container}}'
};
CONFIG
