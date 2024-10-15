import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'LinkedIn Extension',
    description: 'A browser extension for LinkedIn',
    version: '1.0.0',
    permissions: ['activeTab'],
    host_permissions: ['https://*.linkedin.com/*'],
  }
});
