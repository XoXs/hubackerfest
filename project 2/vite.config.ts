import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const isUserOrOrgPagesSite = repositoryName.endsWith('.github.io');
const base = isGitHubPagesBuild && repositoryName && !isUserOrOrgPagesSite
  ? `/${repositoryName}/`
  : '/';

export default defineConfig({
  base,
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
