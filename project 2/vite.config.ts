import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const isUserOrOrgPagesSite = repositoryName.endsWith('.github.io');
const appVersion = process.env.GITHUB_SHA?.slice(0, 7) ?? `${Date.now()}`;
const base = isGitHubPagesBuild && repositoryName && !isUserOrOrgPagesSite
  ? `/${repositoryName}/`
  : '/';

export default defineConfig({
  base,
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'emit-version-json',
          generateBundle() {
            this.emitFile({
              type: 'asset',
              fileName: 'version.json',
              source: JSON.stringify({ version: appVersion }),
            });
          },
        },
      ],
    },
  },
});
