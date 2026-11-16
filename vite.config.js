import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { normalizeSiteUrl } from './src/seo/site.js'

export default defineConfig(({ command, mode, isSsrBuild }) => {
  // The production origin comes from SITE_URL (env var or .env file) — never hard-coded.
  // `vite build` refuses to run without it so a wrong/guessed domain can't reach
  // canonicals, the sitemap or JSON-LD. `vite dev` / `vite preview` don't need it.
  const env = loadEnv(mode, process.cwd(), '')
  const rawSiteUrl = env.SITE_URL?.trim()
  if (command === 'build' && !rawSiteUrl) {
    throw new Error(
      '\n[seo] SITE_URL is not set. Set it to the verified production origin before building, e.g.\n' +
        '        SITE_URL=https://your-domain.example npm run build\n' +
        '      (see .env.example). It is used for canonical URLs, sitemap.xml, robots.txt and JSON-LD.\n',
    )
  }
  const siteUrl = rawSiteUrl ? normalizeSiteUrl(rawSiteUrl) : ''

  return {
    plugins: [react()],
    define: {
      // Read by src/seo/SeoManager.jsx for client-side canonical/og:url updates.
      __SITE_URL__: JSON.stringify(siteUrl),
    },
    build: {
      // Optimize build output
      rollupOptions: isSsrBuild
        ? undefined
        : {
            output: {
              manualChunks: {
                // Separate vendor chunks for better caching
                'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                'animation-vendor': ['framer-motion'],
                'icons-vendor': ['react-icons'],
              },
            },
          },
      // Enable minification (using esbuild which is faster and included)
      minify: 'esbuild',
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Source maps for production debugging (can be disabled for smaller builds)
      sourcemap: false,
    },
    // SSR bundle (build-time prerender only): bundle every dependency so Node never has to
    // resolve CJS/ESM packages such as gsap/ScrollTrigger or react-icons at runtime.
    ssr: {
      noExternal: true,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    },
  }
})
